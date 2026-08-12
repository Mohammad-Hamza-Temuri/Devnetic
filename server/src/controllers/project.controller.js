import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import { AppError } from "../utils/AppError.js";

export async function createProject(req, res, next){
    try{
        const owner = req.userId;
        
        const { title, description, category, requiredSkills, techStack, startDate, endDate, repositoryUrl } = req.body;

        const project = await Project.create({ owner, title, description, category, requiredSkills, techStack, startDate, endDate, repositoryUrl });
        
        const projectMember = await ProjectMember.create({
            project: project._id,
            user: req.userId,
            role: "owner"
        })
        
        res.status(201).json(project);
    }
    catch(error){
        next(error);
    }
};

export async function getAllProjects(req, res, next){
    try{
        const project = await Project.find();
        res.json(project);
    }
    catch(error){
        next(error);
    }
};

export async function getProjectById(req, res, next){
    try {
        const project = await Project.findById(req.params.id);
        
        if(!project){
            return next(new AppError("User not found", 404))
        }

        res.json(project);

    } catch (error) {
        next(error);
    }
};

export async function updateProject(req, res, next){
    try {
        const project = await Project.findById(req.params.id);

        if(!project){
            return next(new AppError("Project not found", 404));
        }

        if(project.owner.toString() !== req.userId){
            return next(new AppError("Not authorized to update this project", 403));
        }

        const { title, description, category, requiredSkills, techStack, startDate, endDate, repositoryUrl } = req.body;

        project.title = title;
        project.description = description;
        project.category = category;
        project.requiredSkills = requiredSkills;
        project.techStack = techStack;
        project.startDate = startDate;
        project.endDate = endDate;
        project.repositoryUrl = repositoryUrl;

        await project.save();
        res.json(project)

    } catch (error) {
        next(error);
    }
};


export async function deleteProject(req, res, next){
    try {
        const project = await Project.findById(req.params.id);

        if(!project){
            return next(new AppError("Project not found", 404));
        }

        if(project.owner.toString() !== req.userId){
            return next(new AppError("Not authorized to update this project", 403));
        }       

        await Project.findByIdAndDelete(req.params.id);
        res.status(204).send();

    } catch (error) {
        next(error);
    }
};

export async function getProjectMembers(req, res, next){
    try {
        const projectMembers = await ProjectMember.find({project: req.params.id}).populate("user", "-password");
        res.json(projectMembers);
    } catch (error) {
        next(error);
    }
};