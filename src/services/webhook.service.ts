import { jobRepo } from "../db/repositories/job.repo";
import { pipelineRepo } from "../db/repositories/pipeline.repo";



export const webhookService = {
    receive: async (sourceId: string, payload: Record<string, unknown>) => {
        const sourceUrl1 = `/webhook/${sourceId}`;
        const pipeline = await pipelineRepo.findBySourceUrl(sourceUrl1);

        if (!pipeline) {
            throw new Error('Pipeline not found');
        }
        if (!pipeline.isActive) {
            throw new Error('Pipeline is inactive');
        }
        const job = await jobRepo.create(pipeline.id, payload);
        return job;
    }
}