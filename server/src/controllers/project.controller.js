import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import { createProjectService, getAllProjectsService, getProjectByIdService, updateProjectService, deleteProjectService, getProjectMembersService } from "../services/project.service.js";
import { AppError } from "../utils/AppError.js";

export async function createProject(req, res, next) {
  try {
    const owner = req.userId;

    const {
      title,
      description,
      category,
      requiredSkills,
      techStack,
      startDate,
      endDate,
      repositoryUrl,
    } = req.body;

    const projectData = {
      title,
      description,
      category,
      requiredSkills,
      techStack,
      startDate,
      endDate,
      repositoryUrl,
    };

    const project = await createProjectService(owner, projectData);

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

export async function getAllProjects(req, res, next) {
  try {
    const projects = await getAllProjectsService();
    res.json(projects);
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const projectId = req.params.id;
    const project = await getProjectByIdService(projectId);
    res.json(project);
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req, res, next) {
  try {
    const userId = req.userId;
    const projectId = req.params.id;

    const {
      title,
      description,
      category,
      requiredSkills,
      techStack,
      startDate,
      endDate,
      repositoryUrl,
    } = req.body;

    const projectData = {
      title,
      description,
      category,
      requiredSkills,
      techStack,
      startDate,
      endDate,
      repositoryUrl,
    };

    const project = await updateProjectService(projectId, userId, projectData);

    res.json(project);
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
    try {
        const userId = req.userId;
        const projectId = req.params.id;

        await deleteProjectService(projectId, userId);

        res.status(204).send();

    } catch (error) {
        next(error);
    }
}

export async function getProjectMembers(req, res, next) {
  try {
    const projectId = req.params.id;
    const projectMembers = await getProjectMembersService(projectId);
    res.json(projectMembers);
  } catch (error) {
    next(error);
  }
}
