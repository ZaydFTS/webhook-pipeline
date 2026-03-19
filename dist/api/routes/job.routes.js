"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../controllers/job.controller");
const jobRouter = (0, express_1.Router)();
jobRouter.get("/:id", job_controller_1.jobController.getById);
jobRouter.get("/:id/deliveries", job_controller_1.jobController.getDeliveries);
exports.default = jobRouter;
