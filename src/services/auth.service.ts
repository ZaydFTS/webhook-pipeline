import bcrypt from 'bcrypt';


import { LoginDto, RegisterDto } from "../api/validators/auth.validator";
import { userRepo } from "../db/repositories/users.repo";
import { JwtPayload } from "../types/auth.types";
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { config } from "../config";


const SALT_ROUNDS = 10;




export const authService = {

    register: async (dto: RegisterDto) => {
        const existingUser = await userRepo.findByEmail(dto.email);
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

        const user = await userRepo.create(dto.email, hashedPassword);
        const token = generateToken({ userId: user.id, email: user.email });
        return {
            token,
            user: { id: user.id, email: user.email },
        };
    },
    login: async (dto: LoginDto) => {
        const user = await userRepo.findByEmail(dto.email);
        if (!user) throw new Error('Invalid credentials');

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        const token = generateToken({ userId: user.id, email: user.email });

        return {
            token,
            user: { id: user.id, email: user.email },
        }
    }
}




const generateToken = (payload: JwtPayload): string => {
    const signOptions: SignOptions = {
        expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, config.jwtSecret, {
        ...signOptions,
    });
};










