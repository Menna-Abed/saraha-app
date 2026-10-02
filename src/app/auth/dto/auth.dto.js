import { z } from 'zod';

export const registerDTO = z.object({
    email: z.email().toLowerCase().trim(),
    name: z.string().min(2).max(20).trim(),
    password: z.string().min(8).max(16).trim(),
    dob: z.coerce.date().optional(),
    gender: z.enum(['male', 'female']).optional(),
});

export const verifyAccountDTO = z.object({
    email: z.email().toLowerCase().trim(),
    code: z.string().length(6).trim(),
});

export const loginDTO = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
});



export const sendOTPDto = z.object({
    email: z.email().toLowerCase().trim(),
});

export const resetPasswordDTO = z.object({
    email: z.email().toLowerCase().trim(),
    code: z.string().length(6).trim(),
    newPassword: z.string().min(8).max(16).trim(),
});