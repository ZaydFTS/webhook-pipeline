


import express from "express";
import pipelineRouter from "./routes/pipelines.routes";
import authRouter from "./routes/auth.routes";
import { authenticate } from "./middlewares/authenticate";
import webhookRouter from "./routes/webhooks.routes";
import { errorHandler } from "./middlewares/error.handler";
import jobRouter from "./routes/job.routes";
import { swaggerSpec } from "../config/swagger";
import swaggerUi from 'swagger-ui-express';



const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

app.use('/auth', authRouter);


app.use('/api/pipelines', authenticate, pipelineRouter)
app.use('/api/jobs', authenticate, jobRouter);

app.use('/webhooks', webhookRouter);








app.use(errorHandler);

app.post("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});



export default app;