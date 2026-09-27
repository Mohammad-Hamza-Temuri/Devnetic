import mongoose from "mongoose";
import Project from "../models/Project.js";
import Invitation from "../models/ProjectInvitation.js";
import ProjectMember from "../models/ProjectMember.js";
import { AppError } from "../utils/AppError.js";

const RESPONSE_STATUSES = ["accepted", "rejected"];

export const createInvitationService = async (projectId, userId, invitedUserId) => {

    if (typeof invitedUserId !== "string" || !mongoose.isValidObjectId(invitedUserId)) {
        throw new AppError("A valid invitedUserId is required", 400);
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    if (project.owner.toString() !== userId) {
        throw new AppError("Not authorized to send an invitation", 403);
    }

    if (invitedUserId.toString() === userId) {
        throw new AppError("You cannot invite yourself", 400);
    }

    const existingMember = await ProjectMember.findOne({ project: projectId, user: invitedUserId });

    if (existingMember) {
        throw new AppError("This developer is already a member of the project", 409);
    }

    const pendingInvite = await Invitation.findOne({
        project: projectId,
        invitedUser: invitedUserId,
        status: "pending"
    });

    if (pendingInvite) {
        throw new AppError("This developer already has a pending invitation", 409);
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

    if (!RESPONSE_STATUSES.includes(status)) {
        throw new AppError("Status must be 'accepted' or 'rejected'", 400);
    }

    const incomingInvite = await Invitation.findById(incomingInviteId);

    if (!incomingInvite) {
        throw new AppError("Not found", 404);
    }

    if (incomingInvite.invitedUser.toString() !== userId) {
        throw new AppError("Incorrect user", 403);
    }

    if (incomingInvite.status !== "pending") {
        throw new AppError(`Invitation has already been ${incomingInvite.status}`, 409);
    }

    incomingInvite.status = status;

    if (status === "accepted") {
        const existingMember = await ProjectMember.findOne({ project: incomingInvite.project, user: userId });

        if (!existingMember) {
            await ProjectMember.create({
                project: incomingInvite.project,
                user: userId,
                role: "contributor"
            });
        }
    }

    await incomingInvite.save();

    return incomingInvite;
}

export const getMyInvitationService = async (invitedUserId) => {
    const invitationDoc = await Invitation.find({
        invitedUser: invitedUserId,
        status: "pending",
    })
        .populate("project", "title category")
        .populate("invitedBy", "name");
    return invitationDoc;
}
