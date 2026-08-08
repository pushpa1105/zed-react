import { PanaSchema } from "@/schemas/pana.schema";
import type z from "zod";

export type PanaType = z.infer<typeof PanaSchema>

export type UpdatedBlockInterface = {
    id: string,
    panaId: string,
    parentId?: string | null,
    order: string,
    type: string,
    content: any,
    props: any,
}