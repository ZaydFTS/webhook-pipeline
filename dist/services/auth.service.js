"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_repo_1 = require("../db/repositories/users.repo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const SALT_ROUNDS = 10;
exports.authService = {
    register: async (dto) => {
        const existingUser = await users_repo_1.userRepo.findByEmail(dto.email);
        if (existingUser)
            throw new Error('User already exists');
        const hashedPassword = await bcrypt_1.default.hash(dto.password, SALT_ROUNDS);
        const user = await users_repo_1.userRepo.create(dto.email, hashedPassword);
        const token = generateToken({ userId: user.id, email: user.email });
        return {
            token,
            user: { id: user.id, email: user.email },
        };
    },
    login: async (dto) => {
        const user = await users_repo_1.userRepo.findByEmail(dto.email);
        if (!user)
            throw new Error('Invalid credentials');
        const isValid = await bcrypt_1.default.compare(dto.password, user.password);
        if (!isValid)
            throw new Error('Invalid credentials');
        const token = generateToken({ userId: user.id, email: user.email });
        return {
            token,
            user: { id: user.id, email: user.email },
        };
    }
};
const generateToken = (payload) => {
    const signOptions = {
        expiresIn: config_1.config.jwtExpiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, {
        ...signOptions,
    });
};
