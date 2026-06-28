import { $isCodeNode } from '@lexical/code';
import {
  $addUpdateTag,
  $findMatchingParent,
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  SKIP_SELECTION_FOCUS_TAG,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical';
import * as React from 'react';
import { useState } from 'react';

import { useDebounce } from '../../utils';
import DropDown, { DropDownItem } from '@/lib/zeditor/ui/DropDown'
import { useSettings, useToolbar } from '@/lib/zeditor/hooks';
import {
  getCodeLanguageOptions as getCodeLanguageOptionsShiki,
  getCodeThemeOptions as getCodeThemeOptionsShiki,
  normalizeCodeLanguage as normalizeCodeLanguageShiki,
} from '@lexical/code-shiki';

interface Props {
  editor: LexicalEditor;
  getCodeDOMNode: () => HTMLElement | null;
  onMenuOpenChange?: (open: boolean) => void;
  activeEditor: LexicalEditor;
  nodeKey: string;
  currentLanguage: string;
  currentTheme: string;
}

const CODE_LANGUAGE_OPTIONS_SHIKI: [string, string][] =
  getCodeLanguageOptionsShiki().filter(option =>
    [
      'c',
      'clike',
      'cpp',
      'css',
      'go',
      'html',
      'java',
      'js',
      'javascript',
      'markdown',
      'objc',
      'objective-c',
      'plain',
      'powershell',
      'py',
      'python',
      'rust',
      'sql',
      'typescript',
      'xml',
    ].includes(option[0]),
  );

const CODE_THEME_OPTIONS_SHIKI: [string, string][] =
  getCodeThemeOptionsShiki().filter(option =>
    [
      'catppuccin-latte',
      'everforest-light',
      'github-light',
      'gruvbox-light-medium',
      'kanagawa-lotus',
      'dark-plus',
      'light-plus',
      'material-theme-lighter',
      'min-light',
      'one-light',
      'rose-pine-dawn',
      'slack-ochin',
      'snazzy-light',
      'solarized-light',
      'vitesse-light',
    ].includes(option[0]),
  );

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active dropdown-item-active';
  } else {
    return '';
  }
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

export function LanguageSelection({ editor, getCodeDOMNode, onMenuOpenChange, activeEditor, nodeKey, currentLanguage, currentTheme }: Props) {

  const { toolbarState } = useToolbar()

  const {
    settings: { isCodeHighlighted, isCodeShiki },
  } = useSettings();

  const [isEditable,] = useState(() => editor.isEditable());
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  React.useEffect(() => {
    onMenuOpenChange?.(isLangOpen || isThemeOpen);
  }, [isLangOpen, isThemeOpen, onMenuOpenChange]);

  const onCodeLanguageSelect = React.useCallback(
    (value: string | null) => {
      activeEditor.update(() => {
        $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);

        const node = $getNodeByKey(nodeKey);
        if ($isCodeNode(node)) {
          node.setLanguage(value);
        }
      });
    },
    [activeEditor, nodeKey],
  );

  const onCodeThemeSelect = React.useCallback(
    (value: string) => {
      activeEditor.update(() => {

        const node = $getNodeByKey(nodeKey);
        if ($isCodeNode(node)) {
          node.setTheme(value);
        }
      });
    },
    [activeEditor, nodeKey],
  );

  return (
    <>
      {isCodeShiki && (
        <>
          <DropDown
            disabled={!isEditable}
            buttonClassName="toolbar-item code-language"
            onOpenChange={setIsLangOpen}
            buttonLabel={
              currentLanguage
                ? (CODE_LANGUAGE_OPTIONS_SHIKI.find(
                  opt =>
                    opt[0] ===
                    normalizeCodeLanguageShiki(currentLanguage),
                ) || ['', ''])[1]
                : '(No language)'
            }
            buttonAriaLabel="Select language">
            <DropDownItem
              className={`item ${dropDownActiveClass(
                !currentLanguage,
              )}`}
              onClick={() => onCodeLanguageSelect(null)}
              key="__no_language__">
              <span className="text">(No language)</span>
            </DropDownItem>
            {CODE_LANGUAGE_OPTIONS_SHIKI.map(([value, name]) => {
              return (
                <DropDownItem
                  className={`item ${dropDownActiveClass(
                    value === currentLanguage,
                  )}`}
                  onClick={() => onCodeLanguageSelect(value)}
                  key={value}>
                  <span className="text">{name}</span>
                </DropDownItem>
              );
            })}
          </DropDown>
          <DropDown
            disabled={!isEditable}
            buttonClassName="toolbar-item code-language"
            onOpenChange={setIsThemeOpen}
            buttonLabel={
              currentTheme ?
                (CODE_THEME_OPTIONS_SHIKI.find(
                  opt => opt[0] === currentTheme,
                ) || ['', ''])[1] : '(No Theme)'
            }
            buttonAriaLabel="Select theme">
            {CODE_THEME_OPTIONS_SHIKI.map(([value, name]) => {
              return (
                <DropDownItem
                  className={`item ${dropDownActiveClass(
                    value === currentTheme,
                  )}`}
                  onClick={() => onCodeThemeSelect(value)}
                  key={value}>
                  <span className="text">{name}</span>
                </DropDownItem>
              );
            })}
          </DropDown>
        </>
      )}
    </>
  );
}
