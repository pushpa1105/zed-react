import z from "zod";

export const WorkspaceSchema = z.object({
    _id: z.string(),
    name: z.email(),
    type: z.string(),
    ownerId: z.string(),
})

export const CreateWorkspaceFormSchema = z.object({
    type: z.string(),
    name: z.string().min(3, 'Should be more than 3 letters.'),
    teamId: z.string(),
})