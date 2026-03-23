import bcrypt from 'bcrypt';


import { LoginDto, RegisterDto } from "../api/validators/auth.validator";
import { userRepo } from "../db/repositories/users.repo";
import { JwtPayload } from "../types/auth.types";
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { config } from "../config";
import { refreshTokenRepo } from '../db/repositories/refreshToken.repo';


const SALT_ROUNDS = 10;




export const authService = {

    register: async (dto: RegisterDto) => {
        const existingUser = await userRepo.findByEmail(dto.email);
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

        const user = await userRepo.create(dto.email, hashedPassword);
        return await generateToken({ userId: user.id, email: user.email });

    },
    login: async (dto: LoginDto) => {
        const user = await userRepo.findByEmail(dto.email);
        if (!user) throw new Error('Invalid credentials');

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        return await generateToken({ userId: user.id, email: user.email });


    },
    refresh: async (token: string) => {
        const stored = await refreshTokenRepo.findByToken(token);
        if (!stored) throw new Error('Invalid refresh token');

        if (new Date() > stored.expiresAt) {
            await refreshTokenRepo.deleteByToken(token);
            throw new Error('Refresh token expired');
        }
        const user = await userRepo.findById(stored.userId);
        if (!user) throw new Error('User not found');

        await refreshTokenRepo.deleteByToken(token);
        return await generateToken({ userId: user.id, email: user.email });
    },
    logout: async (token: string) => {
        await refreshTokenRepo.deleteByToken(token);
    },
}




const generateToken = async (payload: JwtPayload) => {
    const signOptions: SignOptions = {
        expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
    };
    const accessToken = jwt.sign(payload, config.jwtSecret, {
        ...signOptions,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = await refreshTokenRepo
        .create(payload.userId, expiresAt);
    return {
        accessToken,
        refreshToken: refreshToken.token,
        user: { id: payload.userId, email: payload.email },
    }
};










