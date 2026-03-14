import { NextFunction, Request, Response } from "express";
import { config } from '../../config';
import jwt from 'jsonwebtoken';
import { JwtPayload } from "../../types/auth.types";



export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeaders.split(' ')[1];
    try {
        const decode = jwt.verify(token, config.jwtSecret) as JwtPayload;
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}


