"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDataAction = void 0;
const filterDataAction = async (payload, config) => {
    if (!config.dataToKeep || !Array.isArray(config.dataToKeep)) {
        throw new Error('Invalid configuration: dataToKeep must be an array of strings');
    }
    return Object.fromEntries(Object.entries(payload).filter(([key]) => config.dataToKeep.includes(key)));
};
exports.filterDataAction = filterDataAction;
