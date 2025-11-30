import { z } from 'zod';

export const loginSchema = z.object({
  credentials: z.object({
    email: z
      .string()
      .trim()
      .min(1, 'O usuário é obrigatório.')
      .refine((val) => val === 'admin', {
        message: 'Usuário inválido'
      }),
    password: z
      .string()
      .min(1, 'A senha é obrigatória.')
      .refine((val) => val === 'admin123', {
        message: 'Senha inválida'
      })
  }),

  terms: z.object({
    isRememberMeChecked: z.boolean().optional()
  })
});

export type RegisterFormData = z.infer<typeof loginSchema>;
