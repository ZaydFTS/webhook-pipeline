



import { Router } from "express";
import { pipelinesController } from "../controllers/pipelines.controller";
import { jobService } from "../../services/job.service";



const pipelineRouter = Router();


pipelineRouter.get("/", pipelinesController.getAll);
pipelineRouter.get('/:id', pipelinesController.getById);
pipelineRouter.get('/by-url', pipelinesController.getBySourceUrl);


pipelineRouter.post("/", pipelinesController.create);
pipelineRouter.put('/:id', pipelinesController.update);
pipelineRouter.delete('/:id', pipelinesController.delete);


pipelineRouter.get('/:id/jobs', async (req, res, next) => {
    try {
        const jobs = await jobService.getByPipelineId(req.params.id);
        res.json(jobs);
    } catch (err) { next(err); }
});

export default pipelineRouter;

