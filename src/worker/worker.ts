import { jobRepo } from "../db/repositories/job.repo";
import { processJob } from "./processor";





const POLL_INTERVAL_MS = 5000;

const runWorker = async (): Promise<void> => {
    console.log('Worker started, polling for jobs...');
    while (true) {
        try {
            const job = await jobRepo.claimNextJob();
            if (!job) {
                await sleep(POLL_INTERVAL_MS);
                continue;
            }
            console.log(`Picked up job ${job.id} for pipeline ${job.pipelineId}`);
            await processJob(job);
        } catch (error) {
            console.error('Error processing job:', error);
            await sleep(POLL_INTERVAL_MS);
        }
    }
}

const sleep = (
    ms: number
) => new Promise(resolve => setTimeout(resolve, ms));

runWorker().catch(console.error);