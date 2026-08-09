import type { Block } from '@blocknote/core';

import type { UpdatedBlockInterface } from '@/features/pana';

export const flattenBlocks = (
  blocks: Block[],
  panaId: string,
  parentId?: string
) => {
  const result: UpdatedBlockInterface[] = [];

  blocks.forEach((block, index) => {
    result.push({
      id: block.id,
      panaId,
      parentId: parentId ?? null,
      order: `${index}`, // position among siblings — BlockNote already ordered this
      type: block.type,
      content: block.content,
      props: block.props,
    });

    if (block.children?.length) {
      result.push(...flattenBlocks(block.children, panaId, block.id));
    }
  });

  return result;
};
