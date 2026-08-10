import express from "express";
import { protect } from "../middleware/auth.js";
import { createProfile, getProfileByUserId, updateProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/", protect, createProfile);
router.get("/:id", getProfileByUserId);
router.put("/", protect, updateProfile);

export default router;