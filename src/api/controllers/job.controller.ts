
import { jobService } from "../../services/job.service";
import { Request, Response, NextFunction } from "express";



export const jobController = {
    getById: async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const job = await jobService.getById(req.params.id);
            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }
            res.json(job);
        } catch (error) {
            next(error)
        }
    },
    getDeliveries: async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const jobId = req.params.id;
            const deliveries = await jobService.getDeliveries(jobId);
            res.json(deliveries);

        } catch (error) {
            next(error)
        }
    }

}