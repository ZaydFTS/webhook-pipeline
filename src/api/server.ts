


import express from "express";
import pipelineRouter from "./routes/pipelines.routes";
import authRouter from "./routes/auth.routes";
import { authenticate } from "./middlewares/authenticate";
import webhookRouter from "./routes/webhooks.routes";
import { errorHandler } from "./middlewares/error.handler";



const app = express();

app.use(express.json());




app.use('/auth', authRouter);

app.use('/api/pipelines', authenticate, pipelineRouter)

app.use('/webhooks', webhookRouter);






app.use(errorHandler);

app.post("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});



export default app;