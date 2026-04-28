import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/\d/, 'Debe contener al menos un número'),
});

export const signupSchema = loginSchema.extend({
  fullName: z
    .string()
    .min(2, 'Nombre muy corto')
    .max(60, 'Nombre muy largo'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
