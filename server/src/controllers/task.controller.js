import Task from "../models/Task.js";
import { AppError } from "../utils/AppError.js";;

//GET ALL TASKS DATA

export async function getAllTasks(req, res, next){
    try{
        const tasks = await Task.find();
        res.json(tasks);
    }
    catch(error){
        next(error);
    }
}

// export function getAllTask (req, res){
//     res.send(taskData);
// }

//GET TASK DATA BY ID

export async function getTaskById(req, res, next) {
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return next(new AppError("Task not found", 404));
        }
        res.json(task);
    }
    catch(error){
        next(error);
    }
}

// export function getTaskById (req, res, next){
//     const taskId = Number(req.params.id);
//     const task = taskData.find((data) => data.id === taskId);
//     if (!task) {
//        return next(new AppError("Task not found", 404));
//     } 
    
//     res.json(task);
// }

//POST: CREATE A NEW TASK

export async function createTask(req, res, next){
    try{
        const { title, description} =  req.body;

        if(!title || !description){
        return next(new AppError("Title and description are required", 400));
        }
        const newTask = await Task.create({ title, description});
        res.status(201).json(newTask);
    }
    catch(error){
        next(error);
    }
    
}

// export function createTask(req, res) {
//     const { title, description}= req.body;

//     if (!title || !description) {
//         return res.status(400).send("Title and description are required");
//     }

//     const newTask = {id: Date.now(), title, description};
//     taskData.push(newTask);
//     res.status(201).json(newTask);
// }

//PUT: UPDATE A TASK DATA BY ID

export async function updateTask(req, res, next) {
    try{
        const taskId = req.params.id;
        const task = await Task.findById(taskId);

        if(!task){
            return next(new AppError("Task not found", 404));
        }
        const { title, description} = req.body;

        if(!title || !description){
            return next(new AppError("Title and description are required", 400));
        }

        task.title = title;
        task.description = description;
        await task.save();
        res.json(task);
    }
    catch(error){
        next(error);
    }
}

// export function updateTask (req, res, next) {
//     const taskId = Number(req.params.id);
//     const task = taskData.find((u) => u.id === taskId);

//     if(!task) {
//     return next(new AppError("Task not found", 404));
//     }

//     const {title, description} = req.body;

//     if(!title || !description) {
//         return res.status(400).json({ message: "Tile and description are required!"});
//     }

//     task.title = title;
//     task.description = description;
//     res.json(task);
// }


//DELETE: DELETE A TASK DATA BY ID

export async function deleteTask(req, res, next) {
    try{
        const taskId = req.params.id;
        const taskIndex = await Task.findById(taskId);

        if(!taskIndex){
            return next(new AppError("Task not found", 404));
        }
        await Task.findByIdAndDelete(taskId)
        res.status(204).send();
    }
    catch(error){
        next(error);
    }
    
}

// export function deleteTask(req, res, next) {
//     const taskId = Number(req.params.id);
//     const taskIndex = taskData.findIndex((u) => u.id === taskId);

//     if(taskIndex === -1){
//         return next(new AppError("Task not found", 404));
//     }

//     taskData.splice(taskIndex, 1);
//     res.status(204).send();
// }