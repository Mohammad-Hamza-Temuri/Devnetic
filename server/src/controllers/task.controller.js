import {
    createTaskService,
    getAllTasksService,
    getTaskByIdService,
    updateTaskService,
    deleteTaskService
} from "../services/task.service.js";

//GET ALL TASKS DATA

export async function getAllTasks(req, res, next) {
    try {
        const tasks = await getAllTasksService();
        res.json(tasks);
    }
    catch (error) {
        next(error);
    }
}

//GET TASK DATA BY ID

export async function getTaskById(req, res, next) {
    try {
        const taskId = req.params.id;
        const task = await getTaskByIdService(taskId);
        res.json(task);
    }
    catch (error) {
        next(error);
    }
}


//POST: CREATE A NEW TASK

export async function createTask(req, res, next) {
    try {

        const { title, description } = req.body;

        const newTask = await createTaskService(title, description);
        res.status(201).json(newTask);
    }
    catch (error) {
        next(error);
    }

}


//PUT: UPDATE A TASK DATA BY ID

export async function updateTask(req, res, next) {
    try {

        const taskId = req.params.id;
        const { title, description } = req.body;
        const task = await updateTaskService(taskId, title, description);

        res.json(task);
    }
    catch (error) {
        next(error);
    }
}


//DELETE: DELETE A TASK DATA BY ID

export async function deleteTask(req, res, next) {
    try {
        const taskId = req.params.id;
        const task = await deleteTaskService(taskId);

        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}