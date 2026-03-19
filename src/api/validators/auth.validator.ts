import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email("Invalid Email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});


export const loginSchema = z.object({
    email: z.string().email("Invalid Email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;