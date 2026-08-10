import express from 'express';
import { protect } from "../middleware/auth.js";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/', protect, getAllTasks);
router.get('/:id', protect, getTaskById);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);    

export default router;