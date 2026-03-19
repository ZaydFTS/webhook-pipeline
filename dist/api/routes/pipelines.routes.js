"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pipelines_controller_1 = require("../controllers/pipelines.controller");
const job_service_1 = require("../../services/job.service");
const pipelineRouter = (0, express_1.Router)();
pipelineRouter.get("/", pipelines_controller_1.pipelinesController.getAll);
pipelineRouter.get('/:id', pipelines_controller_1.pipelinesController.getById);
pipelineRouter.get('/by-url', pipelines_controller_1.pipelinesController.getBySourceUrl);
pipelineRouter.post("/", pipelines_controller_1.pipelinesController.create);
pipelineRouter.put('/:id', pipelines_controller_1.pipelinesController.update);
pipelineRouter.delete('/:id', pipelines_controller_1.pipelinesController.delete);
pipelineRouter.get('/:id/jobs', async (req, res, next) => {
    try {
        const jobs = await job_service_1.jobService.getByPipelineId(req.params.id);
        res.json(jobs);
    }
    catch (err) {
        next(err);
    }
});
exports.default = pipelineRouter;
