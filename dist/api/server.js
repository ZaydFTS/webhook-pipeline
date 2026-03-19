"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pipelines_routes_1 = __importDefault(require("./routes/pipelines.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const authenticate_1 = require("./middlewares/authenticate");
const webhooks_routes_1 = __importDefault(require("./routes/webhooks.routes"));
const error_handler_1 = require("./middlewares/error.handler");
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', auth_routes_1.default);
app.use('/api/pipelines', authenticate_1.authenticate, pipelines_routes_1.default);
app.use('/api/jobs', authenticate_1.authenticate, job_routes_1.default);
app.use('/webhooks', webhooks_routes_1.default);
app.use(error_handler_1.errorHandler);
app.post("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
exports.default = app;
