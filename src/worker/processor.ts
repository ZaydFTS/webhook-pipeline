import { actionMap } from "./actions";
import { pipelineRepo } from "../db/repositories/pipeline.repo";
import { jobRepo } from "../db/repositories/job.repo";
import { Job } from "../types/job.types";







export const processJob = async (
    job: Job
): Promise<void> => {
    const pipeline = await pipelineRepo.findById(job.pipelineId);
    if (!pipeline) {
        await jobRepo.markFailed(job.id, 'Pipeline not found');
        return;
    }


    const action = actionMap[pipeline.actionType];

    if (!action) {
        await jobRepo.markFailed(job.id, 'Action type not supported');
        return;
    }
    const result = await action(
        job.payload as Record<string, unknown>,
        pipeline.actionConfig
    );
    await jobRepo.markCompleted(job.id, result);
    console.log(`Job ${job.id} completed successfully`);
}