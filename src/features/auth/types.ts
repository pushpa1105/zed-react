import type z from 'zod';

import type {
  AuthUserSchema,
  LoginFormSchema,
  RegisterFormSchema,
} from './schema';

export type LoginFormType = z.infer<typeof LoginFormSchema>;
export type RegisterFormType = z.infer<typeof RegisterFormSchema>;
export type AuthUserType = z.infer<typeof AuthUserSchema>;
