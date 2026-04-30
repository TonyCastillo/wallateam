import { z } from 'zod';

export const newExpenseSchema = z.object({
  wallet_id: z.string().uuid('Wallet inválida'),
  description: z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  amount: z.number().int().positive('Debe ser mayor a 0'),
  category: z.enum(['food', 'transport', 'home', 'shopping', 'entertainment', 'health', 'work', 'other']),
  occurred_at: z.string(), // ISO
  note: z.string().max(280, 'Máximo 280 caracteres').nullable().optional(),
});

export type NewExpenseForm = z.infer<typeof newExpenseSchema>;
