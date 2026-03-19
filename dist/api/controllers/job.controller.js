"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobController = void 0;
const job_service_1 = require("../../services/job.service");
exports.jobController = {
    getById: async (req, res, next) => {
        try {
            const job = await job_service_1.jobService.getById(req.params.id);
            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }
            res.json(job);
        }
        catch (error) {
            next(error);
        }
    },
    getDeliveries: async (req, res, next) => {
        try {
            const jobId = req.params.id;
            const deliveries = await job_service_1.jobService.getDeliveries(jobId);
            res.json(deliveries);
        }
        catch (error) {
            next(error);
        }
    }
};
