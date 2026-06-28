// plugins/LoadBlocksPlugin.jsx
import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $parseSerializedNode } from 'lexical';
import type { Block } from '@/lib/zeditor/types';

export function LoadBlocksPlugin({ blocks }: { blocks: Block[] }) {
    const [editor] = useLexicalComposerContext();
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (hasLoaded.current) return; // only hydrate once per mount
        hasLoaded.current = true;

        editor.update(() => {
            const root = $getRoot();
            root.clear();

            if (blocks.length === 0) {
                return;
            }

            const sorted = [...blocks].sort((a, b) => (a.order > b.order ? 1 : -1));

            sorted.forEach((block) => {
                // const node = editor.parseEditorState(
                //     JSON.stringify({ root: { children: [block.content], type: 'root', version: 1 } })
                // );

                const node = $parseSerializedNode(block.content);
                root.append(node);
                // pull the single parsed child back out and append to current root
                // node.read(() => {
                //     const parsedChild = $getRoot().getFirstChild();
                //     if (parsedChild) root.append(parsedChild.clone ? parsedChild : parsedChild);
                // });
            });
        }, { tag: 'load' }); // tag this update so BlockSyncPlugin can ignore it
    }, [editor, blocks]);

    return null;
}