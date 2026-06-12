import z from "zod";

export const SimplePanaSchema = z.object({
    _id: z.string(),
    title: z.string(),
    workspaceId: z.string(),
})

export const PanaSchema = z.object({
    _id: z.string(),
    title: z.string(),
    workspaceId: z.string(),
    isOpen: z.boolean().optional(),
    hasChildrenFetched: z.boolean().optional(),
    children: z.array(SimplePanaSchema).optional()
})