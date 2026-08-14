import express from "express";
import {protect} from "../middleware/auth.js";
import { createInvitation, respondToInvitation, getMyInvitation } from "../controllers/invitation.controller.js";

const router = express.Router();

router.post("/:id", protect, createInvitation);
router.put("/:id/respond", protect, respondToInvitation);
router.get("/me", protect, getMyInvitation);

export default router;