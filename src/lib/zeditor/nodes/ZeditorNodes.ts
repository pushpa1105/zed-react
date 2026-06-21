import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode } from "@lexical/rich-text";
import type { Klass, LexicalNode } from "lexical";

export const ZeditorNodes: Klass<LexicalNode>[] = [
    HeadingNode,
    ListNode,
    ListItemNode
]
