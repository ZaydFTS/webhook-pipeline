export type ActionType =
    | 'filter_data'
    | 'transform_format'
    | 'http_enrich'



export interface CreatePipelineDto {
    name: string;
    description?: string;                       
    actionType: ActionType;
    actionConfig?: Record<string, unknown>;    
    subscriberUrls: string[];                
}


export interface UpdatePipelineDto {
    name?: string;
    description?: string;
    actionConfig?: Record<string, unknown>;
    isActive?: boolean;
}


export interface Pipeline {
    id: string;
    name: string;
    description: string | null;
    sourceUrl: string;
    actionType: ActionType;
    actionConfig: Record<string, unknown>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export interface Subscriber {
    id: string;
    pipelineId: string;
    url: string;
    isActive: boolean;
    createdAt: Date;
}