import Project from "../models/Project.js";
import Invitation from "../models/ProjectInvitation.js";
import ProjectMember from "../models/ProjectMember.js";
import { AppError } from "../utils/AppError.js";



export const createInvitationService = async (projectId, userId, invitedUserId) => {

    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    if (project.owner.toString() !== userId) {
        throw new AppError("Not authorized to send an invitation", 403);
    }


    const invitation = await Invitation.create({
        project: projectId,
        invitedUser: invitedUserId,
        invitedBy: userId,
        status: "pending"
    });

    return invitation;

}

export const respondToInvitationService = async (incomingInviteId, userId, status) => {

    const incomingInvite = await Invitation.findById(incomingInviteId);

    if (!incomingInvite) {
        throw new AppError("Not found", 404);
    }

    if (incomingInvite.invitedUser.toString() !== userId) {
        throw new AppError("Incorrect user", 403);
    }

    incomingInvite.status = status;

    if (status === "accepted") {
        const newMember = await ProjectMember.create({
            project: incomingInvite.project,
            user: userId,
            role: "contributor"
        })
    }

    await incomingInvite.save();

    return incomingInvite;
}

export const getMyInvitationService = async (invitedUserId) => {
    const invitationDoc = await Invitation.find({
        invitedUser: invitedUserId,
        status: "pending",
    });
    return invitationDoc;
}