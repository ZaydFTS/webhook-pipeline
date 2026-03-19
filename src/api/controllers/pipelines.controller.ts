




import { Request, Response, NextFunction } from "express";
import { pipelineService } from "../../services/pipeline.service";




export const pipelinesController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const piplines = await pipelineService.getAll();
            res.json(piplines);
        } catch (error) {
            next(error);
        }
    },
    getById: async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const pipeline = await pipelineService.getById(req.params.id);
            if (!pipeline) return res.status(404).json({ message: 'Pipeline not found' });
            res.json(pipeline);
        } catch (error) {
            next(error);
        }
    },
    getBySourceUrl: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { url } = req.query;
            if (typeof url !== 'string') {
                return res.status(400).json({ message: 'Invalid url query parameter' });
            }
            const pipeline = await pipelineService.getBySourceUrl(url);
            if (!pipeline) return res.status(404).json({ message: 'Pipeline not found' });
            res.json(pipeline);
        } catch (error) {
            next(error);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pipeline = await pipelineService.create(req.body);
            res.status(201).json(pipeline);
        } catch (error) {
            next(error);
        }
    },
    update: async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const pipeline = await pipelineService.update(req.params.id, req.body);
            if (!pipeline) return res.status(404).json({ message: 'Pipeline not found' });
            res.json(pipeline);
        } catch (error) {
            next(error);
        }
    },
    delete: async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const pipeline = await pipelineService.delete(req.params.id);
            if (!pipeline) return res.status(404).json({ message: 'Pipeline not found' });
            res.status(204).send();
        } catch (error) {
            next(error);
        }

    },
}


