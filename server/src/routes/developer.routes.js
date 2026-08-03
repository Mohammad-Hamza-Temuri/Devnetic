import express from 'express';
import { getAllDevelopers, getDeveloperById } from '../controllers/developer.controller.js';

const router = express.Router();

router.get("/", getAllDevelopers);
router.get("/:id", getDeveloperById);

export default router;