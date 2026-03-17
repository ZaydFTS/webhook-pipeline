
import { deliveryRepo } from "../db/repositories/delivery.repo";
import { jobRepo } from "../db/repositories/job.repo";

export const jobService = {

    getById: async (id: string) => {
        const job = await jobRepo.findById(id);
        if (!job) return null;
        const deliveries = await deliveryRepo.findByJobId(id);
        return { ...job, deliveries };
    },
    getDeliveries: async (jobId: string) => {
        return await deliveryRepo.findByJobId(jobId);
    },
    getByPipelineId: async (pipelineId: string) => {
        return await jobRepo.findByPipelineId(pipelineId);
    },
}