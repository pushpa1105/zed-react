import z from "zod";

export const LoginFormSchema = z.object({
    email: z.email().min(1, 'Required'),
    password: z.string().min(1, 'Required')
})

export const RegisterFormSchema = z.object({
    name: z.string().min(3, "Required"),
    email: z.email().min(1, 'Required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
})

export const AuthUserSchema = z.object({
    _id: z.string(),
    email: z.email(),
    name: z.string(),
    role: z.enum(['admin', 'user']),
})