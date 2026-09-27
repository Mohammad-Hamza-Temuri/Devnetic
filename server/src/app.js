import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import projectRoutes from "./routes/project.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();

// CLIENT_URL: comma-separated list of allowed frontend origins.
// When unset (e.g. local development), every origin is allowed.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : true }));
app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/projects", projectRoutes);
app.use("/invitations", invitationRoutes);
app.use("/comments", commentRoutes);
app.use(errorHandler);

export default app;