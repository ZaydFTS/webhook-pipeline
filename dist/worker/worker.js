"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const job_repo_1 = require("../db/repositories/job.repo");
const processor_1 = require("./processor");
const delivery_service_1 = require("../services/delivery.service");
const POLL_INTERVAL_MS = 5000;
const RETRY_INTERVAL_MS = 60000;
const runWorker = async () => {
    console.log('Worker started, polling for jobs...');
    let lastRetryCheck = Date.now();
    while (true) {
        try {
            const job = await job_repo_1.jobRepo.claimNextJob();
            if (job) {
                console.log(`Picked up job ${job.id} for pipeline ${job.pipelineId}`);
                await (0, processor_1.processJob)(job);
            }
            if (Date.now() - lastRetryCheck >= RETRY_INTERVAL_MS) {
                await delivery_service_1.deliveryService.retryFailedDeliveries();
                lastRetryCheck = Date.now();
            }
            if (!job) {
                await sleep(POLL_INTERVAL_MS);
                continue;
            }
        }
        catch (error) {
            console.error('Error processing job:', error);
            await sleep(POLL_INTERVAL_MS);
        }
    }
};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
runWorker().catch(console.error);
