import { $createFigmaNode, FigmaNode } from '@/lib/zeditor/nodes';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from 'lexical';

export const INSERT_FIGMA_COMMAND: LexicalCommand<string> =
  createCommand('INSERT_FIGMA_COMMAND');

export const FigmaExtension = defineExtension({
  name: '@lexical/playground/Figma',
  nodes: [FigmaNode],
  register: editor =>
    editor.registerCommand<string>(
      INSERT_FIGMA_COMMAND,
      payload => {
        const figmaNode = $createFigmaNode(payload);
        $insertNodeToNearestRoot(figmaNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
