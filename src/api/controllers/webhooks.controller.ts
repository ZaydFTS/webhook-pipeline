import { webhookService } from "../../services/webhook.service";
import { NextFunction, Request, Response } from "express";


export const webhooksController = {

    receive: async (req: Request<{ sourceId: string }>, res: Response, next: NextFunction) => {
        try {
            const { sourceId } = req.params
            const payload = req.body;
            await webhookService.receive(sourceId, payload);

            res.status(202).json({
                message: 'Webhook received, queued for processing'
            })
        } catch (error) {
            next(error);
        }
    }
}