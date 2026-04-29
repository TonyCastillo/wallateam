import { z } from 'zod';

export const newWalletSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(40, 'Máximo 40'),
  type: z.enum(['personal', 'team']),
  icon: z.enum(['piggy','home','plane','briefcase','gift','sparkle','shopping','food','wallet']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  currency_code: z.string(),
  initial_balance: z.number().int().nonnegative('Debe ser >= 0'),
  target_date: z.string().nullable(),
  budget_alert_pct: z.number().int().min(1).max(100).nullable(),
  is_private: z.boolean(),
});

export type NewWalletForm = z.infer<typeof newWalletSchema>;
