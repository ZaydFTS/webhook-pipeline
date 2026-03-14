



import { Router } from "express";
import { pipelinesController } from "../controllers/pipelines.controller";



const pipelineRouter = Router();


pipelineRouter.get("/", pipelinesController.getAll);
pipelineRouter.get('/:id', pipelinesController.getById);
pipelineRouter.get('/by-url', pipelinesController.getBySourceUrl);


pipelineRouter.post("/", pipelinesController.create);
pipelineRouter.put('/:id', pipelinesController.update);
pipelineRouter.delete('/:id', pipelinesController.delete);

export default pipelineRouter;

