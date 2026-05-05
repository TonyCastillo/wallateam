import { z } from 'zod';

export const newExpenseSchema = z.object({
  wallet_id: z.string().uuid('Wallet inválida'),
  description: z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  amount: z.number().int().positive('Debe ser mayor a 0'),
  // category: aceptamos string libre porque income tiene su propio set (INCOME_CATEGORIES).
  // El front se encarga de presentar las categorías válidas según el `kind`.
  category: z.string().min(1, 'Categoría requerida'),
  kind: z.enum(['expense', 'income']),
  occurred_at: z.string(), // ISO
  note: z.string().max(280, 'Máximo 280 caracteres').nullable().optional(),
  paid_by: z.string().uuid().optional(),
  split_mode: z.enum(['equal', 'percent', 'amount']).default('equal'),
  splits: z.array(z.object({
    user_id: z.string().uuid(),
    percentage: z.number().nullable().optional(),
    amount: z.number().nonnegative(),
  })).min(1, 'Debe haber al menos un split'),
});

export type NewExpenseForm = z.infer<typeof newExpenseSchema>;
