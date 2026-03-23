import { Router } from "express";
import { webhooksController } from "../controllers/webhooks.controller";

const webhookRouter = Router();



/**
 * @swagger
 * /webhooks/{sourceId}:
 *   post:
 *     summary: Receive an incoming webhook event
 *     tags: [Webhooks]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: sourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique source ID from the pipeline's sourceUrl
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any JSON payload
 *             example:
 *               name: Ali
 *               email: ali@test.com
 *               password: secret
 *     responses:
 *       202:
 *         description: Webhook received and queued for processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Webhook received, queued for processing
 *       404:
 *         description: Pipeline not found
 */
webhookRouter.post("/:sourceId", webhooksController.receive);

export default webhookRouter;