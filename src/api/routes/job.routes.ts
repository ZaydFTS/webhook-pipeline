



import { Router } from "express";
import { jobController } from "../controllers/job.controller";


const jobRouter = Router();


jobRouter.get("/:id", jobController.getById);
jobRouter.get("/:id/deliveries", jobController.getDeliveries);

export default jobRouter;