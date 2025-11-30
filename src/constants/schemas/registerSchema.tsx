import { z } from 'zod';

export const registerSchema = z.object({
  address: z.object({
    countryCode: z.string().optional(),
    postalCode: z
      .string()
      .min(9, 'O CEP deve ter 8 dígitos.')
      .regex(/^\d{5}-\d{3}$/, 'CEP inválido.'),
    lineAddress: z
      .string()
      .trim()
      .min(5, 'O endereço deve ter pelo menos 5 caracteres.')
      .max(255, 'O endereço não pode exceder 255 caracteres.')
  }),

  phone: z.object({
    DDD: z.string().trim().min(2, 'O DDD deve ter 2 dígitos.').max(2, 'O DDD deve ter 2 dígitos.'),
    phoneNumber: z.string().trim().min(8, 'O número deve ter 8 ou 9 dígitos.')
  }),

  credentials: z
    .object({
      email: z.string().trim().min(1, 'O e-mail é obrigatório.').email('Por favor, insira um e-mail válido.'),
      password: z
        .string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres.')
        .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
        .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
        .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
        .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial.'),
      confirmedPassword: z.string()
    })
    .refine((data) => data.password === data.confirmedPassword, {
      message: 'As senhas não coincidem.',
      path: ['confirmedPassword']
    }),

  user: z.object({
    fullName: z.string().trim().min(8, 'O nome deve ter pelo menos 8 caracteres.'),
    cpf: z
      .string()
      .trim()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido.'),
    nickName: z.string().trim().min(2, 'O apelido deve ter pelo menos 2 caracteres.'),
    birthDate: z
      .date({
        error: (issue) => (issue.input === undefined ? 'Digite uma data válida' : 'Invalid date')
      })
      .min(new Date('1900-01-01'), { error: 'Data inválida' })
      .max(new Date(), { error: 'Digite uma data válida' })
  }),

  terms: z.object({
    isChecked: z.boolean().refine((val) => val === true, {
      message: 'Você deve aceitar os termos de uso.'
    }),
    isRememberMeChecked: z.boolean().optional()
  })
});

export type RegisterFormData = z.infer<typeof registerSchema>;
