"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhooks_controller_1 = require("../controllers/webhooks.controller");
const webhookRouter = (0, express_1.Router)();
webhookRouter.post("/:sourceId", webhooks_controller_1.webhooksController.receive);
exports.default = webhookRouter;
