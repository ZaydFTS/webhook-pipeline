


import express from "express";
import pipelineRouter from "./routes/pipelines.routes";



const app = express();

app.use(express.json());
app.use('/api/pipelines', pipelineRouter)



app.post("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

export default app;