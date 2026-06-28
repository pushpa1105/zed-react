import type { JSX } from 'react';

import './index.css';

import { $isCodeNode, CodeNode } from '@lexical/code';
import { DEFAULT_CODE_LANGUAGE } from '@lexical/code-core';
import {
  getLanguageFriendlyName,
  normalizeCodeLanguage,
} from '@lexical/code-prism';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, type LexicalEditor } from 'lexical';
import * as React from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { CopyButton } from './components/CopyButton';
import { PrettierButton } from './components/PrettierButton';
import { canBePrettier } from './formatCodeWithPrettier';
import { LanguageSelection } from '@/lib/zeditor/plugins/CodeActionMenuPlugin/components/LanguageSelection';

const CODE_PADDING = 8;

interface Position {
  top: string;
  right: string;
}

function updateCodeGutter(node: HTMLElement, codeNode: CodeNode): void {
  const codeText = codeNode.getTextContent();
  const lines = codeText.split('\n');
  const gutter = lines.map((_, i) => String(i + 1)).join('\n');
  node.setAttribute('data-gutter', gutter);
}

/**
 * One action menu, permanently anchored to a single code block.
 * Renders nothing if its code block's DOM node can't be resolved
 * (e.g. it was just destroyed and we haven't been told yet).
 */
function CodeActionMenu({
  nodeKey,
  anchorElem,
  activeEditor,
}: {
  nodeKey: string;
  anchorElem: HTMLElement;
  activeEditor: LexicalEditor
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [lang, setLang] = useState('');
  const [theme, setTheme] = useState('');
  const [position, setPosition] = useState<Position | null>(null);
  const [codeDOMNode, setCodeDOMNode] = useState<HTMLElement | null>(null);

  const getCodeDOMNode = useCallback(
    (): HTMLElement | null => codeDOMNode,
    [codeDOMNode],
  );

  const recompute = useCallback(() => {
    const node = editor.getElementByKey(nodeKey);
    if (!node) {
      setPosition(null);
      setCodeDOMNode(null);
      return;
    }

    let _lang = '';
    let _theme = '';
    editor.read(() => {
      const codeNode = $getNodeByKey(nodeKey);
      if ($isCodeNode(codeNode)) {
        _lang = codeNode.getLanguage() || '';
        _theme = codeNode.getTheme() || ''
        updateCodeGutter(node, codeNode);
      }
    });

    const { y: editorElemY, right: editorElemRight } =
      anchorElem.getBoundingClientRect();
    const { y, right } = node.getBoundingClientRect();

    setCodeDOMNode(node);
    setLang(_lang);
    setTheme(_theme);
    setPosition({
      right: `${editorElemRight - right + CODE_PADDING}px`,
      top: `${y - editorElemY}px`,
    });
  }, [editor, nodeKey, anchorElem]);

  // Recompute on mount, and whenever this code block's own content
  // changes (height changes as lines are added/removed, language
  // changes via the dropdown, etc).
  useLayoutEffect(() => {
    // recompute();

    const node = editor.getElementByKey(nodeKey);
    if (!node) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => recompute());
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, [editor, nodeKey, recompute]);

  // Recompute on scroll/resize of the page, since position is
  // viewport-relative.
  useEffect(() => {
    const handle = () => recompute();
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
    };
  }, [recompute]);

  if (!position) {
    return null;
  }

  const normalizedLang = normalizeCodeLanguage(lang || DEFAULT_CODE_LANGUAGE);
  const codeFriendlyName = lang ? getLanguageFriendlyName(lang) : '(No language)';

  return (
    <div className="code-action-menu-container" style={{ ...position }}>
      {editor.isEditable() ?
        <LanguageSelection editor={editor} getCodeDOMNode={getCodeDOMNode} activeEditor={activeEditor}
          nodeKey={nodeKey}        // NEW
          currentLanguage={lang}   // NEW — replaces toolbarState.codeLanguage
          currentTheme={theme}
        /> :
        <div className="code-highlight-language">{codeFriendlyName}</div>
      }
      <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
      {canBePrettier(normalizedLang) ? (
        <PrettierButton
          editor={editor}
          getCodeDOMNode={getCodeDOMNode}
          lang={normalizedLang}
        />
      ) : null}
    </div>
  );
}

/**
 * Tracks the live set of CodeNode keys in the document and renders
 * one CodeActionMenu per block, each independently positioned.
 */
function CodeActionMenuContainer({
  anchorElem,
  activeEditor,
}: {
  anchorElem: HTMLElement;
  activeEditor: LexicalEditor
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [codeNodeKeys, setCodeNodeKeys] = useState<string[]>([]);

  useEffect(() => {
    return editor.registerMutationListener(
      CodeNode,
      mutations => {
        setCodeNodeKeys(prev => {
          const next = new Set(prev);
          for (const [key, type] of mutations) {
            if (type === 'destroyed') {
              next.delete(key);
            } else {
              // 'created' or 'updated'
              next.add(key);
            }
          }
          return Array.from(next);
        });
      },
      { skipInitialization: false },
    );
  }, [editor]);

  return (
    <>
      {codeNodeKeys.map(key => (
        <CodeActionMenu key={key} nodeKey={key} anchorElem={anchorElem} activeEditor={activeEditor} />
      ))}
    </>
  );
}

export default function CodeActionMenuPlugin({
  anchorElem = document.body,
  activeEditor
}: {
  anchorElem?: HTMLElement;
  activeEditor: LexicalEditor
}): React.ReactPortal | null {
  return createPortal(
    <CodeActionMenuContainer anchorElem={anchorElem} activeEditor={activeEditor} />,
    anchorElem,
  );
}