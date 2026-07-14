import type { BlockDocument } from "@/types";
import type { Block } from "@blocknote/core";

export const parseToZeditorFormat = (blocks: BlockDocument[]): Block[] => {
    if (!blocks.length) return []

    return blocks.map(({ _id, children, content, order, type, props }) => ({
        id: _id,
        children,
        order,
        type,
        content,
        props,
    }))

} 