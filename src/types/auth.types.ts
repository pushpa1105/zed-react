import type { AuthUserSchema, LoginFormSchema } from "@/schemas";
import type z from "zod";

export type LoginFormType = z.infer<typeof LoginFormSchema>;
export type AuthUserType = z.infer<typeof AuthUserSchema>;

