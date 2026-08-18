import Comments from "../models/Comment.js";
import Project from "../models/Project.js";
import { AppError } from "../utils/AppError.js";

export const createCommentService = async (projectId, userId, text) => {

    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const comment = await Comments.create({
        project: projectId,
        user: userId,
        text: text
    });

    return comment;
}

export const getCommentsForProjectService = async (projectId) => {

    const comments = await Comments.find({ project: projectId }).populate("user", "-password");

    return comments;
}

export const deleteCommentService = async (commentId, userId) => {

    const comment = await Comments.findById(commentId);

    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    if (comment.user.toString() !== userId) {
       throw new AppError("Not authorized to delete the comment", 403);
    }

    await Comments.findByIdAndDelete(commentId);
}