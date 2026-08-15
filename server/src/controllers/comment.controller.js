import Comments from "../models/Comment.js";
import Project from "../models/Project.js";
import { AppError } from "../utils/AppError.js";


export async function createComment(req, res, next) {
    try {

        const project = await Project.findById(req.params.id);

        if(!project){
            return next(new AppError("Project not found", 404));
        }

        const user = req.userId;

        const { text } = req.body;

        const comment = await Comments.create({
            project: project._id,
            user: req.userId,
            text: text
        });

        res.status(201).json(comment);

    } catch (error) {
        next(error);
    }
};

export async function getCommentsForProject(req, res, next){
    try {
        const comments = await Comments.find({project: req.params.id}).populate("user", "-password");
        res.json(comments);

    } catch (error) {
        next(error);
    }
};

export async function deleteComment(req, res, next) {
    try {
        const comment = await Comments.findById(req.params.commentId);

        if(!comment){
            return next(new AppError("User not found", 404));
        }
        
        if(comment.user.toString() !== req.userId){
            return next(new AppError("Not authorized to delete the comment", 403));
        }

        await Comments.findByIdAndDelete(req.params.commentId);
        res.status(204).send();
        
    } catch (error) {
        next(error);
    }
}