"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineService = void 0;
const pipeline_repo_1 = require("../db/repositories/pipeline.repo");
exports.pipelineService = {
    getAll: async () => {
        return await pipeline_repo_1.pipelineRepo.findAll();
    },
    getById: async (id) => {
        return await pipeline_repo_1.pipelineRepo.findById(id);
    },
    getBySourceUrl: async (url) => {
        return await pipeline_repo_1.pipelineRepo.findBySourceUrl(url);
    },
    create: async (dto) => {
        return await pipeline_repo_1.pipelineRepo.create(dto);
    },
    update: async (id, data) => {
        return await pipeline_repo_1.pipelineRepo.update(id, data);
    },
    delete: async (id) => {
        return await pipeline_repo_1.pipelineRepo.delete(id);
    },
};
