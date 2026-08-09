import type z from 'zod';

import { BlockTypeSchema, PanaSchema } from './schema';

export type PanaType = z.infer<typeof PanaSchema>;

export type UpdatedBlockInterface = {
  id: string;
  panaId: string;
  parentId?: string | null;
  order: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
};

export type NormalizePanas = Record<string, PanaType>;

export type BlockType = z.infer<typeof BlockTypeSchema>;

export type BlockDocument = {
  id: string;
  content: JSON;
  children: BlockDocument[];
  props: JSON;
  type: BlockType;
  order: string;
};
