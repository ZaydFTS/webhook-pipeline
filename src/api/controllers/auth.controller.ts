import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { authService } from "../../services/auth.service";
import { ca } from "zod/v4/locales";




export const authController = {

    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = registerSchema.parse(req.body);
            const result = await authService.register(body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = loginSchema.parse(req.body);
            const result = await authService.login(body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    me: async (req: Request, res: Response) => {
        res.json({ user: req.user });
    }

}