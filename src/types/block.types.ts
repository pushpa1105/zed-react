import type { BlockType } from "@/schemas";
import type z from "zod";

export type BlockType = z.infer<typeof BlockType>

export type BlockDocument = {
    _id: string;
    content: JSON;
    children: BlockDocument[];
    props: JSON;
    type: BlockType;
    order: string;
}