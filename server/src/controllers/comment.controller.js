import { createCommentService, deleteCommentService, getCommentsForProjectService } from "../services/comment.service.js";

export async function createComment(req, res, next) {
    try {

        const projectId = req.params.id;
        const userId = req.userId;
        const { text } = req.body;
        const comment = await createCommentService(projectId, userId, text);

        res.status(201).json(comment);

    } catch (error) {
        next(error);
    }
};

export async function getCommentsForProject(req, res, next){
    try {
        const projectId = req.params.id;
        const comments = await getCommentsForProjectService(projectId);
        res.json(comments);

    } catch (error) {
        next(error);
    }
};

export async function deleteComment(req, res, next) {
    try {
        const userId = req.userId;
        const commentId = req.params.commentId;
        const comment = await deleteCommentService(commentId, userId);

        res.status(204).send();
        
    } catch (error) {
        next(error);
    }
}