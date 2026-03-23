



import { Router } from "express";
import { pipelinesController } from "../controllers/pipelines.controller";
import { jobService } from "../../services/job.service";



const pipelineRouter = Router();


/**
 * @swagger
 * /api/pipelines:
 *   get:
 *     summary: Get all pipelines
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pipelines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pipeline'
 */
pipelineRouter.get("/", pipelinesController.getAll);

/**
 * @swagger
 * /api/pipelines/{id}:
 *   get:
 *     summary: Get a pipeline by ID
 *     tags: [Pipelines]
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
 *         description: Pipeline found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pipeline'
 *       404:
 *         description: Pipeline not found
 */
pipelineRouter.get('/:id', pipelinesController.getById);





pipelineRouter.get('/by-url', pipelinesController.getBySourceUrl);

/**
 * @swagger
 * /api/pipelines:
 *   post:
 *     summary: Create a new pipeline
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePipelineDto'
 *     responses:
 *       201:
 *         description: Pipeline created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pipeline'
 */

pipelineRouter.post("/", pipelinesController.create);


/**
 * @swagger
 * /api/pipelines/{id}:
 *   patch:
 *     summary: Update a pipeline
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePipelineDto'
 *     responses:
 *       200:
 *         description: Pipeline updated
 *       404:
 *         description: Pipeline not found
 */
pipelineRouter.put('/:id', pipelinesController.update);


/**
 * @swagger
 * /api/pipelines/{id}:
 *   delete:
 *     summary: Delete a pipeline
 *     tags: [Pipelines]
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
 *         description: Pipeline deleted
 *       404:
 *         description: Pipeline not found
 */
pipelineRouter.delete('/:id', pipelinesController.delete);

/**
 * @swagger
 * /api/pipelines/{id}/jobs:
 *   get:
 *     summary: Get all jobs for a pipeline
 *     tags: [Pipelines]
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
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
pipelineRouter.get('/:id/jobs', async (req, res, next) => {
    try {
        const jobs = await jobService.getByPipelineId(req.params.id);
        res.json(jobs);
    } catch (err) { next(err); }
});

export default pipelineRouter;

