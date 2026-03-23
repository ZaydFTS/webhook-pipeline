



import { Router } from "express";
import { jobController } from "../controllers/job.controller";


const jobRouter = Router();

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID with its delivery attempts
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job with deliveries
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Job'
 *                 - type: object
 *                   properties:
 *                     deliveries:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DeliveryAttempt'
 *       404:
 *         description: Job not found
 */
jobRouter.get("/:id", jobController.getById);

/**
 * @swagger
 * /api/jobs/{id}/deliveries:
 *   get:
 *     summary: Get all delivery attempts for a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of delivery attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryAttempt'
 */
jobRouter.get("/:id/deliveries", jobController.getDeliveries);

export default jobRouter;