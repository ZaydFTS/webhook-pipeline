"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_validator_1 = require("../validators/auth.validator");
const auth_service_1 = require("../../services/auth.service");
exports.authController = {
    register: async (req, res, next) => {
        try {
            const body = auth_validator_1.registerSchema.parse(req.body);
            const result = await auth_service_1.authService.register(body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const body = auth_validator_1.loginSchema.parse(req.body);
            const result = await auth_service_1.authService.login(body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    me: async (req, res) => {
        res.json({ user: req.user });
    }
};
