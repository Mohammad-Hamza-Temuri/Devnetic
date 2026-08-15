import express from "express";
import { protect } from "../middleware/auth.js";
import { createComment, getCommentsForProject, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:id", protect, createComment);
router.get("/:id", getCommentsForProject);
router.delete("/:commentId", protect, deleteComment);

export default router;