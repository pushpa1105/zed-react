import { PanaSchema } from "@/schemas/pana.schema";
import type z from "zod";

export type PanaType = z.infer<typeof PanaSchema>