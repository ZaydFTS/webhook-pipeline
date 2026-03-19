"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhooksController = void 0;
const webhook_service_1 = require("../../services/webhook.service");
exports.webhooksController = {
    receive: async (req, res, next) => {
        try {
            const { sourceId } = req.params;
            const payload = req.body;
            await webhook_service_1.webhookService.receive(sourceId, payload);
            res.status(202).json({
                message: 'Webhook received, queued for processing'
            });
        }
        catch (error) {
            next(error);
        }
    }
};
