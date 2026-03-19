"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionMap = void 0;
const filterData_action_1 = require("./filterData.action");
const httpEnrich_action_1 = require("./httpEnrich.action");
const transformFormat_action_1 = require("./transformFormat.action");
exports.actionMap = {
    'filter_data': filterData_action_1.filterDataAction,
    'transform_format': transformFormat_action_1.transformFormatAction,
    'http_enrich': httpEnrich_action_1.httpEnrichAction,
};
