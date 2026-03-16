



export const httpEnrichAction = async (
    payload: Record<string, unknown>,
    config: {
        url: string;
        method?: string
        headers?: Record<string, string>;
        megeKey: string;
    }
): Promise<Record<string, unknown>> => {
    if (!config.url || !config.megeKey) {
        throw new Error('Invalid configuration: url and megeKey are required');
    }
    const response = await fetch(config.url, {
        method: config.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...config.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP request failed with status ${response.status}`);
    }

    const data = await response.json();
    return { ...payload, [config.megeKey]: data };
}