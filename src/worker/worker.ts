import http from 'http';
import { jobRepo } from '../db/repositories/job.repo';
import { processJob } from './processor';
import { deliveryService } from '../services/delivery.service';

const POLL_INTERVAL_MS = 3000;
const RETRY_INTERVAL_MS = 60000;
// ── Add comment for 
// ── Minimal HTTP server for Cloud Run health checks ────────
const PORT = process.env.PORT || 8080;

const server = http.createServer((_req, res) => {
    res.writeHead(200);
    res.end('Worker is running');
});

server.listen(PORT, () => {
    console.log(`Worker health check listening on port ${PORT}`);
});

// ── Main polling loop ──────────────────────────────────────
const runWorker = async (): Promise<void> => {
    console.log('Worker started, polling for jobs...');

    let lastRetryCheck = Date.now();

    while (true) {
        try {
            const job = await jobRepo.claimNextJob();

            if (job) {
                console.log(`Picked up job ${job.id}`);
                await processJob(job);
            }

            if (Date.now() - lastRetryCheck >= RETRY_INTERVAL_MS) {
                await deliveryService.retryFailedDeliveries();
                lastRetryCheck = Date.now();
            }

            if (!job) {
                await sleep(POLL_INTERVAL_MS);
            }

        } catch (err) {
            console.error('Worker error:', err);
            await sleep(POLL_INTERVAL_MS);
        }
    }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

runWorker().catch(console.error);