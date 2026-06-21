import { $isCodeNode } from '@lexical/code';
import {
    $defaultShouldInsertAfter,
    AutoFocusExtension,
    ClearEditorExtension,
    ClickAfterLastBlockExtension,
    DecoratorTextExtension,
    SelectionAlwaysOnDisplayExtension,
} from '@lexical/extension';
import { HashtagExtension } from '@lexical/hashtag';
import { HistoryExtension } from '@lexical/history';
import {
    ClickableLinkExtension,
    LinkExtension,
} from '@lexical/link';
import {
    CheckListExtension,
    ListExtension,
} from '@lexical/list';
import { PlainTextExtension } from '@lexical/plain-text';
import { LexicalCollaboration } from '@lexical/react/LexicalCollaborationContext';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import {
    RichTextExtension,
} from '@lexical/rich-text';
import {
    configExtension,
    defineExtension,
} from 'lexical';
import { type JSX, useMemo } from 'react';

import { useSettings } from '@/lib/zeditor/hooks';
import { ToolbarProvider } from '@/lib/zeditor/context/Toolbar/ToolbarProvider';
import ZeditorTheme from '@/lib/zeditor/themes/ZeditorTheme';
import ZeditorInner from '@/lib/zeditor/ZeditorInner';
import { ZeditorNodes } from '@/lib/zeditor/nodes';
import { validateUrl } from '@/lib/zeditor/utils'

// These are only enabled for rich-text mode
const PlaygroundRichTextExtension = defineExtension({
    dependencies: [
        configExtension(RichTextExtension, {
            escapeFormatTriggers: {
                code: { arrow: true, click: true, enter: true, onlyAtBoundary: true },
            },
        }),
        // Each node extension below registers its own DOM-import rules — the
        // framework nodes (rich-text, list, table, code) and the playground block
        // hosts (Card, PullQuote, Review) alike — so the rich-text importer set
        // tracks this node set automatically (kept out of the always-on
        // PlaygroundImportExtension so plain-text mode doesn't pull in
        // RichTextExtension, which conflicts with PlainTextExtension).

        configExtension(ListExtension, {
            shouldPreserveNumbering: false,
        }),
        CheckListExtension,
    ],
    name: '@lexical/playground/RichText',
});

const ZeditorExtension = defineExtension({
    dependencies: [
        AutoFocusExtension,
        ClearEditorExtension,
        DecoratorTextExtension,
        // Exposes editor.isEditable() as a signal; consumed by
        // registerSettingsSynchronization to drive ClickableLinkExtension.
        HistoryExtension,
        HashtagExtension,
        configExtension(LinkExtension, { validateUrl }),
        ClickableLinkExtension,
        SelectionAlwaysOnDisplayExtension,
        //  configExtension(SelectBlockExtension, {
        //   cascadeSelection: true,
        // }),
        configExtension(ClickAfterLastBlockExtension, {
            $shouldInsertAfter: node =>
                $defaultShouldInsertAfter(node) || $isCodeNode(node),
        }),
    ],
    name: 'Zeditor',
    namespace: 'Playground',
    nodes: ZeditorNodes,
    theme: ZeditorTheme,
});

/**
 * The *only* settings that require tearing down and rebuilding the editor,
 * because they change the set of extensions in use (and therefore the initial
 * editor state). Building a dynamic extension from settings at all is an
 * anti-pattern — extensions should be as static as possible — and is tolerated
 * here only because the playground builds fundamentally different editors from
 * the query string.
 *
 * IMPORTANT: Do NOT add a setting here unless changing it genuinely requires a
 * different extension graph. Anything a live editor can react to through an
 * extension's config signals — table behavior toggles, link attributes,
 * character limits, autocomplete, etc. — MUST instead be synced with
 * `useSyncExtensionSignal` in `Editor.tsx`. Adding such a setting here forces a
 * full editor rebuild (discarding content, selection, and history) on every
 * toggle, which is exactly the bug that moving the table settings out of here
 * fixed.
 */
interface DynamicSettings {
    isCollab: boolean;
    emptyEditor: boolean;
    isRichText: boolean;
}

function buildExtensionFromSettings(settings: DynamicSettings) {
    const { isCollab, isRichText } = settings;
    return defineExtension({
        dependencies: [
            ZeditorExtension,
            configExtension(HistoryExtension, { disabled: isCollab }),
            isRichText ? PlaygroundRichTextExtension : PlainTextExtension,
        ],
        name: '@zeditor/playground/dynamic-config',
    });
}

export default function Zeditor(): JSX.Element {
    const {
        settings: { isCollab, emptyEditor, isRichText },
    } = useSettings();

    // Only the editor-recreating settings belong in this memo's deps. Table
    // behavior toggles (and other live-reconfigurable settings) are applied
    // reactively in Editor.tsx via useSyncExtensionSignal, so they must NOT
    // appear here or they would rebuild the whole editor on every change.
    const app = useMemo(
        () => buildExtensionFromSettings({ emptyEditor, isCollab, isRichText }),
        [emptyEditor, isCollab, isRichText],
    );

    return (
        <LexicalCollaboration>
            <LexicalExtensionComposer extension={app} contentEditable={null}>
                <ToolbarProvider>
                    <div className="editor-shell">
                        <ZeditorInner />
                    </div>
                </ToolbarProvider>
            </LexicalExtensionComposer>
        </LexicalCollaboration>
    );
}
