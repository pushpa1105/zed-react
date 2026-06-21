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

const placeholder = 'Enter some rich text...';

export default function ZeditorInner() {
    const {
        settings: {
            isRichText,
        },
    } = useSettings();
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
    const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);

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
        console.log(editorState.toJSON())
    }
    return (
        <div className="editor-container">
            <ToolbarPlugin />
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
            </div>
        </div>
    );
}
