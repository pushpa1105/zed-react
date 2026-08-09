import z from 'zod';

export const SimplePanaSchema = z.object({
  _id: z.string(),
  title: z.string(),
  workspaceId: z.string(),
});

export const PanaSchema = z.object({
  _id: z.string(),
  title: z.string(),
  workspaceId: z.string(),
  parentId: z.string().nullable(),
  isOpen: z.boolean().optional(),
  hasChildrenAdded: z.boolean().optional(),
  children: z.array(SimplePanaSchema).optional(),
  childrenIds: z.array(z.string()).optional(),
});

export const BlockTypeSchema = z.enum([
  'audio',
  'bulletListItem',
  'checkListItem',
  'codeBlock',
  'divider',
  'file',
  'heading',
  'image',
  'numberedListItem',
  'paragraph',
  'quote',
  'table',
  'toggleListItem',
  'video',
]);

export const BlockSchema = z.object({
  _id: z.string(),
  type: BlockTypeSchema,
  panaId: z.string(),
  parentId: z.string().nullable(),
  props: z.any(),
  order: z.string(),
  content: z.any(),
});
