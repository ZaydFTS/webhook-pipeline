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
    refresh: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
            const result = await authService.refresh(refreshToken);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
            await authService.logout(refreshToken);
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            next(error);
        }
    },
    me: async (req: Request, res: Response) => {
        res.json({ user: req.user });
    }

}