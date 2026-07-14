import { generateKeyBetween } from "fractional-indexing";

/**
 * Minimal structural type for a BlockNote block node.
 * BlockNote's actual `Block<...>` type has more fields (props, content, type),
 * but for tree-walking purposes we only need `id` and `children`.
 * If you already import `Block` from "@blocknote/core", you can use that
 * instead and this will still work since it's structurally compatible.
 */
export interface BlockNode {
    id: string;
    children?: BlockNode[];
    [key: string]: unknown;
}

/**
 * orderMap: Map<blockId, orderString>
 * This is YOUR side-store of Mongo `order` values, kept in sync
 * separately from BlockNote's own tree (BlockNote has no concept
 * of your `order` field).
 */
export type OrderMap = Map<string, string>;

interface BlockContext {
    siblings: BlockNode[];
    index: number;
    parentId: string | null;
}

// 1. Find a block's siblings array + its index + its parentId,
//    searching recursively through BlockNote's nested tree.
export const findBlockContext = (
    tree: BlockNode[],
    blockId: string,
    parentId: string | null = null
): BlockContext | null => {
    for (let i = 0; i < tree.length; i++) {
        const block = tree[i];

        if (block.id === blockId) {
            return { siblings: tree, index: i, parentId };
        }

        if (block.children && block.children.length > 0) {
            const found = findBlockContext(block.children, blockId, block.id);
            if (found) return found;
        }
    }
    return null;
}

// 2. Get the order string for a sibling, computing it on the fly
//    (recursively, left to right) if it's missing — e.g. a block
//    that was just created and never got an order assigned yet.
export const ensureOrder = (
    blockId: string,
    siblings: BlockNode[],
    index: number,
    orderMap: OrderMap
): string => {
    const existing = orderMap.get(blockId);
    if (existing !== undefined) return existing;

    const prevSibling = siblings[index - 1];
    const prevOrder: string | null = prevSibling
        ? ensureOrder(prevSibling.id, siblings, index - 1, orderMap)
        : null;

    // don't look ahead to "next" here — only need prev to bootstrap left-to-right
    const newOrder = generateKeyBetween(prevOrder, null);
    orderMap.set(blockId, newOrder);
    return newOrder;
}

/**
 * Main function: given the full tree (editor.document) and a blockId
 * that just moved (or was created), return its new order string.
 */
export const getOrderForBlock = (
    tree: BlockNode[],
    blockId: string,
    orderMap: OrderMap
): string => {
    const ctx = findBlockContext(tree, blockId);
    if (!ctx) {
        throw new Error(`Block ${blockId} not found in tree`);
    }

    const { siblings, index } = ctx;

    const prevBlock: BlockNode | null = siblings[index - 1] ?? null;
    const nextBlock: BlockNode | null = siblings[index + 1] ?? null;

    const prevOrder: string | null = prevBlock
        ? ensureOrder(prevBlock.id, siblings, index - 1, orderMap)
        : null;

    const nextOrder: string | null = nextBlock
        ? orderMap.get(nextBlock.id) ?? null // don't recurse forward, just use if known
        : null;

    const newOrder = generateKeyBetween(prevOrder, nextOrder);
    orderMap.set(blockId, newOrder);
    return newOrder;
}