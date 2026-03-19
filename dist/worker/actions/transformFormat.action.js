"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFormatAction = void 0;
const transformFormatAction = async (payload, config) => {
    if (!config.fieldMappings || typeof config.fieldMappings !== 'object') {
        throw new Error('Invalid configuration: fieldMappings must be an object with key-value pairs');
    }
    const result = {};
    for (const [newKey, oldKey] of Object.entries(config.fieldMappings)) {
        if (oldKey in payload) {
            result[newKey] = payload[oldKey];
        }
    }
    return result;
};
exports.transformFormatAction = transformFormatAction;
