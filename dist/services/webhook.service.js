"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookService = void 0;
const job_repo_1 = require("../db/repositories/job.repo");
const pipeline_repo_1 = require("../db/repositories/pipeline.repo");
exports.webhookService = {
    receive: async (sourceId, payload) => {
        const sourceUrl1 = `/webhook/${sourceId}`;
        const pipeline = await pipeline_repo_1.pipelineRepo.findBySourceUrl(sourceUrl1);
        if (!pipeline) {
            throw new Error('Pipeline not found');
        }
        if (!pipeline.isActive) {
            throw new Error('Pipeline is inactive');
        }
        const job = await job_repo_1.jobRepo.create(pipeline.id, payload);
        return job;
    }
};
