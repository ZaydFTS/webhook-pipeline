"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpEnrichAction = void 0;
const httpEnrichAction = async (payload, config) => {
    if (!config.url || !config.mergeKey) {
        throw new Error('httpEnrich requires "url" and "mergeKey" in actionConfig');
    }
    const response = await fetch(config.url, {
        method: config.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...config.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP enrich failed with status ${response.status}`);
    }
    const externalData = await response.json();
    return {
        ...payload,
        [config.mergeKey]: externalData,
    };
};
exports.httpEnrichAction = httpEnrichAction;
