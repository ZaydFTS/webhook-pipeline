export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
    id: string;
    pipelineId: string;
    status: JobStatus;
    payload: Record<string, unknown>;
    result: Record<string, unknown> | null;
    error: string | null;
    attempts: number;
    maxAttempts: number;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
}

export interface CreateJobDto {
    pipelineId: string;
    payload: Record<string, unknown>;
}