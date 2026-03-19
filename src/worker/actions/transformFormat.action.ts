



export const transformFormatAction = async (
    payload: Record<string, unknown>,
    config: { fieldMappings: Record<string, string> }
) => {
    if (!config.fieldMappings || typeof config.fieldMappings !== 'object') {
        throw new Error('Invalid configuration: fieldMappings must be an object with key-value pairs');
    }


    const result: Record<string, unknown> = {};
    for (const [newKey, oldKey] of Object.entries(config.fieldMappings)) {
        if (oldKey in payload) {
            result[newKey] = payload[oldKey];
        }
    }
    return result;
}