import z from "zod";

export const BlockType = z.enum([
    "audio", "bulletListItem", "checkListItem", "codeBlock", "divider", "file", "heading", "image", "numberedListItem", "paragraph", "quote", "table", "toggleListItem", "video"
])

export const BlockSchema = z.object({
    _id: z.string(),
    type: BlockType,
    panaId: z.string(),
    parentId: z.string().nullable(),
    props: z.any(),
    order: z.string(),
    content: z.any(),
})