import express from "express";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js"

const app = express();

app.use(express.json());
app.use("/tasks", taskRoutes);
app.use(errorHandler);
app.use("/auth", authRoutes);


export default app;