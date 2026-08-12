import Project from "../models/Project.js";
import Invitation from "../models/ProjectInvitation.js";
import { AppError } from "../utils/AppError.js";

export async function createInvitation(req, res, next){
    try {
        const project = await Project.findById(req.params.id);
        
        if(!project){
            return next(new AppError("Project not found", 404));
        }

        if(project.owner.toString() !== req.userId){
            return next(new AppError("Not authorized to send an invitation", 403));
        }

        const invitation = await Invitation.create({
            project: project._id,
            invitedUser: req.body.invitedUserId,
            invitedBy: req.userId,
            status: "pending"
        });

        res.status(201).json(invitation);

    } catch (error) {
        next(error);
    }
};