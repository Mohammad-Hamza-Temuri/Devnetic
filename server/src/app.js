import express from "express";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js"
import profileRoutes from "./routes/profile.routes.js"

const app = express();

app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes)
app.use(errorHandler);

export default app;