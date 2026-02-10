import type { AuthUserSchema, LoginFormSchema, RegisterFormSchema } from "@/schemas";
import type z from "zod";

export type LoginFormType = z.infer<typeof LoginFormSchema>;
export type RegisterFormType = z.infer<typeof RegisterFormSchema>;
export type AuthUserType = z.infer<typeof AuthUserSchema>;

