import express from "express";
import developerRouter from "./routes/developer.routes.js";

const app = express();

app.use("/developers", developerRouter);

app.get("/", (req, res) => {
    res.send("Welcome to Devnetic API");
});


export default app;