import { useEffect, useRef, type JSX, type ReactNode } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { nanoid } from 'nanoid';
import type { Block } from '@/lib/zeditor/types';

interface BlockIdPluginProps {
    initialBlocks: Block[] | null;
    children: (idMapRef: React.RefObject<Map<string, string>>) => ReactNode;
};

export default function BlockIdPlugin({ initialBlocks, children }: BlockIdPluginProps) {
    const [editor] = useLexicalComposerContext();
    const idMapRef = useRef<Map<string, string>>(new Map()); // nodeKey -> blockId

    useEffect(() => {
        // after LoadBlocksPlugin hydrates, map the newly created node keys
        // back to the blockIds we already have on disk, in document order
        const unregister = editor.registerUpdateListener(({ editorState, tags }) => {
            editorState.read(() => {
                const children = $getRoot().getChildren();
                children.forEach((node, i) => {
                    const key = node.getKey();
                    if (idMapRef.current.has(key)) return;

                    if (tags.has('load') && initialBlocks?.[i]) {
                        idMapRef.current.set(key, initialBlocks[i].blockId);
                    } else {
                        idMapRef.current.set(key, nanoid(8)); // new block created by typing
                    }
                });

            });
        });
        return unregister;
    }, [editor, initialBlocks]);

    return children(idMapRef);
}