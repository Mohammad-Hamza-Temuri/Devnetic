import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import { AppError } from "../utils/AppError.js";

export const createProjectService = async (owner, projectData) => {
    const project = await Project.create({
        owner,
        ...projectData,
    });

    await ProjectMember.create({
        project: project._id,
        user: owner,
        role: "owner",
    });

    return project;
};

export const getAllProjectsService = async () => {
    const projects = await Project.find();
    return projects;
};

export const getProjectByIdService = async (projectId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404)
    }

    return project;
};



export const updateProjectService = async (projectId, userId, projectData) => {

    const project = await Project.findById(projectId)

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    if (project.owner.toString() !== userId) {
        throw new AppError("Not authorized to update this project", 403);
    }

    project.title = projectData.title;
    project.description = projectData.description;
    project.category = projectData.category;
    project.requiredSkills = projectData.requiredSkills;
    project.techStack = projectData.techStack;
    project.startDate = projectData.startDate;
    project.endDate = projectData.endDate;
    project.repositoryUrl = projectData.repositoryUrl;


    await project.save();
    return project;
}



export const deleteProjectService = async (projectId, userId) => {
    const project = await Project.findById(projectId);


    if (!project) {
        throw new AppError("Project not found", 404);
    }

    if (project.owner.toString() !== userId) {
        throw new AppError("Not authorized to delete this project", 403);
    }

    await Project.findByIdAndDelete(projectId);

}



export const getProjectMembersService = async(projectId) =>{
    
    const projectMembers = await ProjectMember.find({
      project: projectId,
    }).populate("user", "-password");

    return projectMembers;
}
