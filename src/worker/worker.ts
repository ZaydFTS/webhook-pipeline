import { jobRepo } from "../db/repositories/job.repo";
import { processJob } from "./processor";
import { deliveryService } from "../services/delivery.service";





const POLL_INTERVAL_MS = 5000;
const RETRY_INTERVAL_MS = 60000;

const runWorker = async (): Promise<void> => {
    console.log('Worker started, polling for jobs...');

    let lastRetryCheck = Date.now();


    while (true) {
        try {
            const job = await jobRepo.claimNextJob();

            if (job) {
                console.log(`Picked up job ${job.id} for pipeline ${job.pipelineId}`);
                await processJob(job);
            }

            if (Date.now() - lastRetryCheck >= RETRY_INTERVAL_MS) {
                await deliveryService.retryFailedDeliveries();
                lastRetryCheck = Date.now();
            }
            if (!job) {
                await sleep(POLL_INTERVAL_MS);
                continue;
            }
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