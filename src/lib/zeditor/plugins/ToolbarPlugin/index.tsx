import { blockTypeToBlockName, DEFAULT_FONT_SIZE, type rootTypeToRootName } from '@/lib/zeditor/constants';
import { useToolbar } from '@/lib/zeditor/hooks/toolbar';
import { SHORTCUTS } from '@/lib/zeditor/plugins/ShortcutsPlugin/shortcuts';
import { formatBulletList, formatCheckList, formatCode, formatHeading, formatNumberedList, formatParagraph, formatQuote } from '@/lib/zeditor/plugins/ToolbarPlugin/utils';
import DropDown, { DropDownItem } from '@/lib/zeditor/ui/DropDown';
import { getSelectedNode, isKeyboardInput } from '@/lib/zeditor/utils';
import { $isLinkNode } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isParentElementRTL, $getSelectionStyleValueForProperty } from '@lexical/selection';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import { $getNearestNodeOfType, $isEditorIsNestedEditor, mergeRegister } from '@lexical/utils';
import {
    $addUpdateTag,
    $findMatchingParent,
    $getSelection,
    $isElementNode,
    $isNodeSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    IS_APPLE,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    SKIP_DOM_SELECTION_TAG,
    UNDO_COMMAND,
    type CommandPayloadType,
    type LexicalCommand,
    type LexicalEditor,
    type LexicalNode,
    type NodeKey,
} from 'lexical';
import {
    getCodeLanguageOptions as getCodeLanguageOptionsPrism,
    normalizeCodeLanguage as normalizeCodeLanguagePrism,
} from '@lexical/code-prism';
import {
    getCodeLanguageOptions as getCodeLanguageOptionsShiki,
    getCodeThemeOptions as getCodeThemeOptionsShiki,
    normalizeCodeLanguage as normalizeCodeLanguageShiki,
} from '@lexical/code-shiki';
import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { useSettings } from '@/lib/zeditor/hooks';
import { $isCodeNode } from '@lexical/code';

function Divider() {
    return <div className="divider" />;
}

function dropDownActiveClass(active: boolean) {
    if (active) {
        return 'active dropdown-item-active';
    } else {
        return '';
    }
}

function BlockFormatDropDown({
    editor,
    blockType,
    rootType,
    disabled = false,
}: {
    blockType: keyof typeof blockTypeToBlockName;
    rootType: keyof typeof rootTypeToRootName;
    editor: LexicalEditor;
    disabled?: boolean;
}): JSX.Element {
    return (
        <DropDown
            disabled={disabled}
            buttonClassName="toolbar-item block-controls"
            buttonIconClassName={'icon block-type ' + blockType}
            buttonLabel={blockTypeToBlockName[blockType]}
            buttonAriaLabel="Formatting options for text style">
            <DropDownItem
                className={
                    'item wide ' + dropDownActiveClass(blockType === 'paragraph')
                }
                onClick={() => formatParagraph(editor)}>
                <div className="icon-text-container">
                    <i className="icon paragraph" />
                    <span className="text">Normal</span>
                </div>
                <span className="shortcut">{SHORTCUTS.NORMAL}</span>
            </DropDownItem>
            <DropDownItem
                className={'item wide ' + dropDownActiveClass(blockType === 'h1')}
                onClick={() => formatHeading(editor, blockType, 'h1')}>
                <div className="icon-text-container">
                    <i className="icon h1" />
                    <span className="text">Heading 1</span>
                </div>
                <span className="shortcut">{SHORTCUTS.HEADING1}</span>
            </DropDownItem>
            <DropDownItem
                className={'item wide ' + dropDownActiveClass(blockType === 'h2')}
                onClick={() => formatHeading(editor, blockType, 'h2')}>
                <div className="icon-text-container">
                    <i className="icon h2" />
                    <span className="text">Heading 2</span>
                </div>
                <span className="shortcut">{SHORTCUTS.HEADING2}</span>
            </DropDownItem>
            <DropDownItem
                className={'item wide ' + dropDownActiveClass(blockType === 'h3')}
                onClick={() => formatHeading(editor, blockType, 'h3')}>
                <div className="icon-text-container">
                    <i className="icon h3" />
                    <span className="text">Heading 3</span>
                </div>
                <span className="shortcut">{SHORTCUTS.HEADING3}</span>
            </DropDownItem>
            <DropDownItem
                className={'item wide ' + dropDownActiveClass(blockType === 'number')}
                onClick={() => formatNumberedList(editor, blockType)}>
                <div className="icon-text-container">
                    <i className="icon numbered-list" />
                    <span className="text">Numbered List</span>
                </div>
                <span className="shortcut">{SHORTCUTS.NUMBERED_LIST}</span>
            </DropDownItem>
            <DropDownItem
                className={'item wide ' + dropDownActiveClass(blockType === 'bullet')}
                onClick={() => formatBulletList(editor, blockType)}>
                <div className="icon-text-container">
                    <i className="icon bullet-list" />
                    <span className="text">Bullet List</span>
                </div>
                <span className="shortcut">{SHORTCUTS.BULLET_LIST}</span>
            </DropDownItem>
            <DropDownItem
                className={'item wide ' + dropDownActiveClass(blockType === 'check')}
                onClick={() => formatCheckList(editor, blockType)}>
                <div className="icon-text-container">
                    <i className="icon check-list" />
                    <span className="text">Check List</span>
                </div>
                <span className="shortcut">{SHORTCUTS.CHECK_LIST}</span>
            </DropDownItem>
            <DropDownItem
                className={'item wide ' + dropDownActiveClass(blockType === 'quote')}
                onClick={() => formatQuote(editor, blockType)}>
                <div className="icon-text-container">
                    <i className="icon quote" />
                    <span className="text">Quote</span>
                </div>
                <span className="shortcut">{SHORTCUTS.QUOTE}</span>
            </DropDownItem>
            <DropDownItem
                className={'item wide ' + dropDownActiveClass(blockType === 'code')}
                onClick={() => formatCode(editor, blockType)}>
                <div className="icon-text-container">
                    <i className="icon code" />
                    <span className="text">Code Block</span>
                </div>
                <span className="shortcut">{SHORTCUTS.CODE_BLOCK}</span>
            </DropDownItem>
        </DropDown>
    );
}

function $findTopLevelElement(node: LexicalNode) {
    let topLevelElement =
        node.getKey() === 'root'
            ? node
            : $findMatchingParent(node, e => {
                const parent = e.getParent();
                return parent !== null && $isRootOrShadowRoot(parent);
            });

    if (topLevelElement === null) {
        topLevelElement = node.getTopLevelElementOrThrow();
    }
    return topLevelElement;
}

export default function ToolbarPlugin() {
    const {
        settings: { isCodeHighlighted, isCodeShiki },
    } = useSettings();
    const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
        null,
    )
    const { toolbarState, updateToolbarState } = useToolbar()
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);

    const $handleHeadingNode = useCallback(
        (selectedElement: LexicalNode) => {
            const type = $isHeadingNode(selectedElement)
                ? selectedElement.getTag()
                : selectedElement.getType();

            if (type in blockTypeToBlockName) {
                updateToolbarState(
                    'blockType',
                    type as keyof typeof blockTypeToBlockName,
                );
            }
        },
        [updateToolbarState],
    );

    const dispatchCommand = <T extends LexicalCommand<unknown>>(
        command: T,
        payload: CommandPayloadType<T> | undefined = undefined,
        skipRefocus: boolean = false,
    ) => {
        editor.update(() => {
            if (skipRefocus) {
                $addUpdateTag(SKIP_DOM_SELECTION_TAG);
            }

            // Re-assert on Type so that payload can have a default param
            editor.dispatchCommand(command, payload as CommandPayloadType<T>);
        });
    };

    const $handleCodeNode = useCallback(
        (element: LexicalNode) => {
            if ($isCodeNode(element)) {
                const language = element.getLanguage();
                updateToolbarState(
                    'codeLanguage',
                    language
                        ? (isCodeHighlighted &&
                            (isCodeShiki
                                ? normalizeCodeLanguageShiki(language)
                                : normalizeCodeLanguagePrism(language))) ||
                        language
                        : '',
                );
                const theme = element.getTheme();
                updateToolbarState('codeTheme', theme || '');
                return;
            }
        },
        [updateToolbarState, isCodeHighlighted, isCodeShiki],
    );

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            if (editor !== editor && $isEditorIsNestedEditor(editor)) {
                const rootElement = editor.getRootElement();
                updateToolbarState(
                    'isImageCaption',
                    !!rootElement?.parentElement?.classList.contains(
                        'image-caption-container',
                    ),
                );
            } else {
                updateToolbarState('isImageCaption', false);
            }

            const anchorNode = selection.anchor.getNode();
            const element = $findTopLevelElement(anchorNode);
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);

            updateToolbarState('isRTL', $isParentElementRTL(selection));

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            const isLink = $isLinkNode(parent) || $isLinkNode(node);
            updateToolbarState('isLink', isLink);

            const tableNode = $findMatchingParent(node, $isTableNode);
            if ($isTableNode(tableNode)) {
                updateToolbarState('rootType', 'table');
            } else {
                updateToolbarState('rootType', 'root');
            }

            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType<ListNode>(
                        anchorNode,
                        ListNode,
                    );
                    const type = parentList
                        ? parentList.getListType()
                        : element.getListType();

                    updateToolbarState('blockType', type);
                } else {
                    $handleHeadingNode(element);
                    $handleCodeNode(element);
                }
            }

            // Handle buttons
            updateToolbarState(
                'fontColor',
                $getSelectionStyleValueForProperty(selection, 'color', '#000'),
            );
            updateToolbarState(
                'bgColor',
                $getSelectionStyleValueForProperty(
                    selection,
                    'background-color',
                    '#fff',
                ),
            );
            updateToolbarState(
                'fontFamily',
                $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
            );
            let matchingParent;
            if ($isLinkNode(parent)) {
                // If node is a link, we need to fetch the parent paragraph node to set format
                matchingParent = $findMatchingParent(
                    node,
                    parentNode => $isElementNode(parentNode) && !parentNode.isInline(),
                );
            }

            // If matchingParent is a valid node, pass it's format type
            updateToolbarState(
                'elementFormat',
                $isElementNode(matchingParent)
                    ? matchingParent.getFormatType()
                    : $isElementNode(node)
                        ? node.getFormatType()
                        : parent?.getFormatType() || 'left',
            );
        }
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
            // Update text format
            updateToolbarState('isBold', selection.hasFormat('bold'));
            updateToolbarState('isItalic', selection.hasFormat('italic'));
            updateToolbarState('isUnderline', selection.hasFormat('underline'));
            updateToolbarState(
                'isStrikethrough',
                selection.hasFormat('strikethrough'),
            );
            updateToolbarState('isSubscript', selection.hasFormat('subscript'));
            updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
            updateToolbarState('isHighlight', selection.hasFormat('highlight'));
            updateToolbarState('isCode', selection.hasFormat('code'));
            updateToolbarState(
                'fontSize',
                $getSelectionStyleValueForProperty(
                    selection,
                    'font-size',
                    `${DEFAULT_FONT_SIZE}px`,
                ),
            );
            updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
            updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
            updateToolbarState('isCapitalize', selection.hasFormat('capitalize'));
        }
        if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            for (const selectedNode of nodes) {
                const parentList = $getNearestNodeOfType<ListNode>(
                    selectedNode,
                    ListNode,
                );
                if (parentList) {
                    const type = parentList.getListType();
                    updateToolbarState('blockType', type);
                } else {
                    const selectedElement = $findTopLevelElement(selectedNode);
                    $handleHeadingNode(selectedElement);
                    // Update elementFormat for node selection (e.g., images)
                    if ($isElementNode(selectedElement)) {
                        updateToolbarState(
                            'elementFormat',
                            selectedElement.getFormatType(),
                        );
                    }
                }
            }
        }
    }, [
        editor,
        updateToolbarState,
        $handleHeadingNode,
        $handleCodeNode,
    ]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(
                    () => {
                        $updateToolbar();
                    },
                    { editor },
                );
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                payload => {
                    updateToolbarState('canUndo', payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                payload => {
                    updateToolbarState('canRedo', payload);

                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
        );
    }, [editor, $updateToolbar]);

    return (
        <div className="toolbar" ref={toolbarRef}>
            <button
                disabled={!toolbarState.canUndo}
                onClick={(e) => {
                    dispatchCommand(UNDO_COMMAND, undefined, isKeyboardInput(e));
                }}
                type='button'
                title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
                className="toolbar-item spaced"
                aria-label="Undo">
                <i className="format undo" />
            </button>
            <button
                disabled={!toolbarState.canRedo}
                title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
                type='button'
                onClick={(e) => {
                    dispatchCommand(REDO_COMMAND, undefined, isKeyboardInput(e));
                }}
                className="toolbar-item"
                aria-label="Redo">
                <i className="format redo" />
            </button>
            <Divider />
            {toolbarState.blockType in blockTypeToBlockName && (
                <>
                    <BlockFormatDropDown
                        blockType={toolbarState.blockType}
                        rootType={toolbarState.rootType}
                        editor={editor}
                    />
                    <Divider />
                </>
            )}
            <button
                onClick={() => {
                    dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                className={'toolbar-item spaced ' + (toolbarState.isBold ? 'active' : '')}
                aria-label="Format Bold">
                <i className="format bold" />
            </button>
            <button
                onClick={() => {
                    dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                className={'toolbar-item spaced ' + (toolbarState.isItalic ? 'active' : '')}
                aria-label="Format Italics">
                <i className="format italic" />
            </button>
            <button
                onClick={() => {
                    dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                className={'toolbar-item spaced ' + (toolbarState.isUnderline ? 'active' : '')}
                aria-label="Format Underline">
                <i className="format underline" />
            </button>
            <button
                onClick={() => {
                    dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
                className={'toolbar-item spaced ' + (toolbarState.isStrikethrough ? 'active' : '')}
                aria-label="Format Strikethrough">
                <i className="format strikethrough" />
            </button>
            <Divider />
            <button
                onClick={() => {
                    dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
                className="toolbar-item spaced"
                aria-label="Left Align">
                <i className="format left-align" />
            </button>
            <button
                onClick={() => {
                    dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
                className="toolbar-item spaced"
                aria-label="Center Align">
                <i className="format center-align" />
            </button>
            <button
                onClick={() => {
                    dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
                className="toolbar-item spaced"
                aria-label="Right Align">
                <i className="format right-align" />
            </button>
            <button
                onClick={() => {
                    dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                }}
                className="toolbar-item"
                aria-label="Justify Align">
                <i className="format justify-align" />
            </button>{' '}
        </div>
    );
}
