

export const filterDataAction = async (
    payload: Record<string, unknown>,
    config: { dataToKeep: string[] }
) => {
    if (!config.dataToKeep || !Array.isArray(config.dataToKeep)) {
        throw new Error('Invalid configuration: dataToKeep must be an array of strings');
    }

    return Object.fromEntries(
        Object.entries(payload).filter(([key]) => config.dataToKeep.includes(key))
    );
}