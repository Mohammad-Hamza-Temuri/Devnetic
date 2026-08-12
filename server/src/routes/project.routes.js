import express from "express";
import { protect } from "../middleware/auth.js";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, getProjectMembers } from "../controllers/project.controller.js";


const router = express.Router();

router.post("/", protect, createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.get("/:id/members", getProjectMembers);

export default router;