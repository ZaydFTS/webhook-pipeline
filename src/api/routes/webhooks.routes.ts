import { Router } from "express";
import { webhooksController } from "../controllers/webhooks.controller";

const webhookRouter = Router();

webhookRouter.post("/:sourceId", webhooksController.receive);

export default webhookRouter;