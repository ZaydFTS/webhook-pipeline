"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobService = void 0;
const delivery_repo_1 = require("../db/repositories/delivery.repo");
const job_repo_1 = require("../db/repositories/job.repo");
exports.jobService = {
    getById: async (id) => {
        const job = await job_repo_1.jobRepo.findById(id);
        if (!job)
            return null;
        const deliveries = await delivery_repo_1.deliveryRepo.findByJobId(id);
        return { ...job, deliveries };
    },
    getDeliveries: async (jobId) => {
        return await delivery_repo_1.deliveryRepo.findByJobId(jobId);
    },
    getByPipelineId: async (pipelineId) => {
        return await job_repo_1.jobRepo.findByPipelineId(pipelineId);
    },
};
