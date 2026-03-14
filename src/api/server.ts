


import express from "express";
import pipelineRouter from "./routes/pipelines.routes";



const app = express();

app.use(express.json());
app.use('/api/pipelines', pipelineRouter)



app.post("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'Internal server error';
    const cause = (err as { cause?: unknown })?.cause as {
        message?: string;
        detail?: string;
        code?: string;
        constraint?: string;
    } | undefined;

    res.status(500).json({
        message,
        cause: cause
            ? {
                message: cause.message,
                detail: cause.detail,
                code: cause.code,
                constraint: cause.constraint,
            }
            : undefined,
    });
});

export default app;