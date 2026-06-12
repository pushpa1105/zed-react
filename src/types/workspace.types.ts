import type { CreateWorkspaceFormSchema, WorkspaceSchema } from "@/schemas";
import type z from "zod";

export type WorkspaceType = z.infer<typeof WorkspaceSchema>;
export type CreateWorkspaceType = z.infer<typeof CreateWorkspaceFormSchema>;
export type Workspaces = 'Personal' | 'Team'