import { z } from 'zod';

/** Fields every persisted entity has. Extend it: `entitySchema.extend({...})`. */
export const entitySchema = z.object({
  id: z.string(),
  createdAt: z.number(),
});

export const paginationMetaSchema = z.object({
  page: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/** `{ data: T[], meta }` envelope used by every list endpoint. */
export const paginated = <T extends z.ZodType>(item: T) =>
  z.object({ data: z.array(item), meta: paginationMetaSchema });

export type Paginated<T> = { data: T[]; meta: PaginationMeta };
