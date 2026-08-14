import Project from "../models/Project.js";
import Invitation from "../models/ProjectInvitation.js";
import ProjectMember from "../models/ProjectMember.js";
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

export async function respondToInvitation(req, res, next){
    try {
        const incomingInvite = await Invitation.findById(req.params.id);

        if(!incomingInvite){
            return next(new AppError("Not found", 404));
        }

        if(incomingInvite.invitedUser.toString() !== req.userId){
            return next(new AppError("Incorrect user",403));
        }

        const { status } = req.body;

        incomingInvite.status = status;

        if(status === "accepted"){
            const newMember = await ProjectMember.create({
                project: incomingInvite.project,
                user: req.userId,
                role:"contributor"
            })   
        }

        await incomingInvite.save();
        res.json(incomingInvite);
        
    } catch (error) {
        next(error);
    }
};


export async function getMyInvitation(req, res, next){
    try {
        const invitationDoc = await Invitation.find({invitedUser: req.userId})
        res.json(invitationDoc);
    } catch (error) {
        next(error)
    }
}