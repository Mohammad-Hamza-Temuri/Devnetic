import Task from "../models/Task.js";
import { AppError } from "../utils/AppError.js";

export const getAllTasksService = async () => {
    const tasks = await Task.find();
    return tasks;
};


export const getTaskByIdService = async (taskId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return task;

}

export const createTaskService = async (title, description) => {

    if (!title || !description) {
        throw new AppError("Title and description are required", 400);
    }

    const newTask = await Task.create({ title, description });

    return newTask;
}

export const updateTaskService = async (taskId, title, description) => {

    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    if (!title || !description) {
        throw new AppError("Title and description are required", 400);
    }

    task.title = title;
    task.description = description;
    await task.save();

    return task;
}

export const deleteTaskService = async (taskId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }
    await Task.findByIdAndDelete(taskId)

    return task;
}