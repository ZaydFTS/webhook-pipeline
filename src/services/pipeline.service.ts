import { pipelineServiceRepo } from "../db/repositories/pipeline.repo";
import { CreatePipelineDto } from "..//types/pipeline.types";
import { get } from "node:http";





export const pipelineService = {
    getAll: async () => {
        return await pipelineServiceRepo.findAll();
    },

    getById: async (id: string) => {
        return await pipelineServiceRepo.findById(id);
    },
    getBySourceUrl: async (url: string) => {
        return await pipelineServiceRepo.findBySourceUrl(url);
    },
    create: async (dto: CreatePipelineDto) => {
        return await pipelineServiceRepo.create(dto);
    },
    update: async (id: string, data: Partial<CreatePipelineDto>) => {
        return await pipelineServiceRepo.update(id, data);
    },
    delete: async (id: string) => {
        return await pipelineServiceRepo.delete(id);
    },
}

