"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelinesController = void 0;
const pipeline_service_1 = require("../../services/pipeline.service");
exports.pipelinesController = {
    getAll: async (req, res, next) => {
        try {
            const piplines = await pipeline_service_1.pipelineService.getAll();
            res.json(piplines);
        }
        catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const pipeline = await pipeline_service_1.pipelineService.getById(req.params.id);
            if (!pipeline)
                return res.status(404).json({ message: 'Pipeline not found' });
            res.json(pipeline);
        }
        catch (error) {
            next(error);
        }
    },
    getBySourceUrl: async (req, res, next) => {
        try {
            const { url } = req.query;
            if (typeof url !== 'string') {
                return res.status(400).json({ message: 'Invalid url query parameter' });
            }
            const pipeline = await pipeline_service_1.pipelineService.getBySourceUrl(url);
            if (!pipeline)
                return res.status(404).json({ message: 'Pipeline not found' });
            res.json(pipeline);
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const pipeline = await pipeline_service_1.pipelineService.create(req.body);
            res.status(201).json(pipeline);
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const pipeline = await pipeline_service_1.pipelineService.update(req.params.id, req.body);
            if (!pipeline)
                return res.status(404).json({ message: 'Pipeline not found' });
            res.json(pipeline);
        }
        catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const pipeline = await pipeline_service_1.pipelineService.delete(req.params.id);
            if (!pipeline)
                return res.status(404).json({ message: 'Pipeline not found' });
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    },
};
