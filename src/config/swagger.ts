import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Webhook Pipeline API',
            version: '1.0.0',
            description: 'A webhook-driven task processing pipeline service',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
            {
                url: 'https://webhook-pipeline-api-1081146199416.us-central1.run.app/',
                description: 'Production server',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // ── Auth ──────────────────────────────────────────────
                RegisterDto: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'ali@test.com' },
                        password: { type: 'string', minLength: 8, example: 'password123' },
                    },
                },
                LoginDto: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'ali@test.com' },
                        password: { type: 'string', example: 'password123' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                email: { type: 'string', format: 'email' },
                            },
                        },
                    },
                },
                // ── Pipeline ──────────────────────────────────────────
                CreatePipelineDto: {
                    type: 'object',
                    required: ['name', 'actionType', 'subscriberUrls'],
                    properties: {
                        name: { type: 'string', example: 'My Pipeline' },
                        description: { type: 'string', example: 'Optional description' },
                        actionType: {
                            type: 'string',
                            enum: ['filter_fields', 'transform_format', 'http_enrich'],
                        },
                        actionConfig: {
                            type: 'object',
                            example: { keep: ['name', 'email'] },
                        },
                        subscriberUrls: {
                            type: 'array',
                            items: { type: 'string', format: 'uri' },
                            example: ['https://webhook.site/your-url'],
                        },
                    },
                },
                Pipeline: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        sourceUrl: { type: 'string' },
                        actionType: { type: 'string' },
                        actionConfig: { type: 'object' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                // ── Job ───────────────────────────────────────────────
                Job: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        pipelineId: { type: 'string', format: 'uuid' },
                        status: {
                            type: 'string',
                            enum: ['pending', 'processing', 'completed', 'failed'],
                        },
                        payload: { type: 'object' },
                        result: { type: 'object', nullable: true },
                        error: { type: 'string', nullable: true },
                        attempts: { type: 'integer' },
                        maxAttempts: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                // ── Delivery ──────────────────────────────────────────
                DeliveryAttempt: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        jobId: { type: 'string', format: 'uuid' },
                        subscriberId: { type: 'string', format: 'uuid' },
                        status: {
                            type: 'string',
                            enum: ['pending', 'success', 'failed'],
                        },
                        statusCode: { type: 'integer', nullable: true },
                        responseBody: { type: 'string', nullable: true },
                        error: { type: 'string', nullable: true },
                        attemptNumber: { type: 'integer' },
                        nextRetryAt: { type: 'string', format: 'date-time', nullable: true },
                        deliveredAt: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                // ── Error ─────────────────────────────────────────────
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/api/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);