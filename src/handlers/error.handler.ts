import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err.message);

    if (err.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    if (err.message === 'Email already in use') {
        return res.status(409).json({ message: err.message });
    }
    if (err.message === 'Invalid credentials') {
        return res.status(401).json({ message: err.message });
    }
    if (err.message === 'Pipeline not found') {
        return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
}