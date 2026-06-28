import {
    CAN_USE_DOM,
    type EditorState,
    type LexicalEditor,
} from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from '@/lib/zeditor/plugins/ToolbarPlugin';
import './style.css'
import { useEffect, useState } from 'react';
import ContentEditable from '@/lib/zeditor/ui/ContentEditable';
import { useSettings } from '@/lib/zeditor/hooks';
import DraggableBlockPlugin from '@/lib/zeditor/plugins/DraggablePlugin';
import BlockSyncPlugin from '@/lib/zeditor/plugins/BlockSyncPlugin';
import BlockIdPlugin from '@/lib/zeditor/plugins/BlockIdPlugin';
import type { Block } from '@/lib/zeditor/types';
import { LoadBlocksPlugin } from '@/lib/zeditor/plugins/LoadBlocksPlugin';
import CodeActionMenuPlugin from '@/lib/zeditor/plugins/CodeActionMenuPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const placeholder = 'Enter some rich text...';

interface ZeditorInnerProps {
    initialBlocks: Block[],
    onChange: (_: any) => void
}

export default function ZeditorInner({
    onChange: syncChange,
    initialBlocks,
}: ZeditorInnerProps) {
    const {
        settings: {
            isRichText,
        },
    } = useSettings();
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
    const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
    const [blocks, setBlocks] = useState<Block[] | null>(null);
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

    useEffect(() => {
        setBlocks(initialBlocks)
    }, [initialBlocks])

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    useEffect(() => {
        const updateViewPortWidth = () => {
            const isNextSmallWidthViewport =
                CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

            if (isNextSmallWidthViewport !== isSmallWidthViewport) {
                setIsSmallWidthViewport(isNextSmallWidthViewport);
            }
        };
        updateViewPortWidth();
        window.addEventListener('resize', updateViewPortWidth);

        return () => {
            window.removeEventListener('resize', updateViewPortWidth);
        };
    }, [isSmallWidthViewport]);

    const onChange = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
        // console.log(editorState.toJSON())
    }
    return (
        <div className="editor-container">
            <ToolbarPlugin
                editor={editor}
                activeEditor={activeEditor}
                setActiveEditor={setActiveEditor}
                setIsLinkEditMode={setIsLinkEditMode}
            />
            <div className="editor-inner">
                {isRichText ? (
                    <>
                        <div className="editor-scroller">
                            <div className="editor" ref={onRef}>
                                <ContentEditable placeholder={placeholder} />
                            </div>
                        </div>
                        {floatingAnchorElem && !isSmallWidthViewport && (
                            <>
                                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} activeEditor={activeEditor} />

                                {/* <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                                        <TableHoverActionsV2Plugin anchorElem={floatingAnchorElem} />
                                        <FloatingTextFormatToolbarPlugin
                                            anchorElem={floatingAnchorElem}
                                            setIsLinkEditMode={setIsLinkEditMode}
                                        /> */}
                            </>
                        )}
                    </>

                ) : (
                    <ContentEditable placeholder={placeholder} />
                )}

                <OnChangePlugin onChange={onChange} />
                <BlockIdPlugin initialBlocks={blocks}>
                    {(idMapRef) => (
                        <BlockSyncPlugin
                            pageId={'122'}
                            idMapRef={idMapRef}
                            onChange={syncChange}
                        />
                    )}
                </BlockIdPlugin>
                {blocks?.length &&
                    <LoadBlocksPlugin blocks={blocks || []} />
                }
            </div>
        </div>
    );
}
