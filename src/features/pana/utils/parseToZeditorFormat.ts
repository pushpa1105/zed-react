import type { Block } from '@blocknote/core';

import type { BlockDocument } from '@/features/pana';

export const parseToZeditorFormat = (blocks: BlockDocument[]): Block[] => {
  if (!blocks.length) return [];

  return blocks.map(({ id, children, content, order, type, props }) => ({
    id,
    children,
    order,
    type,
    content,
    props,
  })) as unknown as Block[];
};
