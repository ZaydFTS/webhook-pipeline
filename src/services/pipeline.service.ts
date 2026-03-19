
import { pipelineRepo } from "../db/repositories/pipeline.repo";
import { CreatePipelineDto } from "..//types/pipeline.types";





export const pipelineService = {
    getAll: async () => {
        return await pipelineRepo.findAll();
    },
    getById: async (id: string) => {
        return await pipelineRepo.findById(id);
    },
    getBySourceUrl: async (url: string) => {
        return await pipelineRepo.findBySourceUrl(url);
    },
    create: async (dto: CreatePipelineDto) => {
        return await pipelineRepo.create(dto);
    },
    update: async (id: string, data: Partial<CreatePipelineDto>) => {
        return await pipelineRepo.update(id, data);
    },
    delete: async (id: string) => {
        return await pipelineRepo.delete(id);
    },
}

