"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processJob = void 0;
const actions_1 = require("./actions");
const pipeline_repo_1 = require("../db/repositories/pipeline.repo");
const job_repo_1 = require("../db/repositories/job.repo");
const delivery_service_1 = require("../services/delivery.service");
const processJob = async (job) => {
    const pipeline = await pipeline_repo_1.pipelineRepo.findById(job.pipelineId);
    if (!pipeline) {
        await job_repo_1.jobRepo.markFailed(job.id, 'Pipeline not found');
        return;
    }
    const action = actions_1.actionMap[pipeline.actionType];
    if (!action) {
        await job_repo_1.jobRepo.markFailed(job.id, 'Action type not supported');
        return;
    }
    const result = await action(job.payload, pipeline.actionConfig);
    await job_repo_1.jobRepo.markCompleted(job.id, result);
    console.log(`Job ${job.id} completed successfully`);
    await delivery_service_1.deliveryService.deliverResult(job.id, job.pipelineId, result);
};
exports.processJob = processJob;
