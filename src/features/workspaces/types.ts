import type z from 'zod';

import type { CreateWorkspaceFormSchema, WorkspaceSchema } from './schema';

export type WorkspaceType = z.infer<typeof WorkspaceSchema>;
export type CreateWorkspaceType = z.infer<typeof CreateWorkspaceFormSchema>;
export type Workspaces = 'Personal' | 'Team';
