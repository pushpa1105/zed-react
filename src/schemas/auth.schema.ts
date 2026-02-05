import z from "zod";

export const LoginFormSchema = z.object({
    email: z.email().min(1, 'Required'),
    password: z.string().min(1, 'Required')
})

export const AuthUserSchema = z.object({
    _id: z.string(),
    email: z.email(),
    name: z.string(),
    role: z.enum(['admin', 'user']),
})