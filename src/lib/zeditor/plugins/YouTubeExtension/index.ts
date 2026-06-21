import { $createYouTubeNode, YouTubeNode } from '@/lib/zeditor/nodes';
import { defineImportRule, DOMImportExtension, sel } from '@lexical/html';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from 'lexical';

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> =
  createCommand('INSERT_YOUTUBE_COMMAND');

const YouTubeImportRule = defineImportRule({
  $import: ctx => [$createYouTubeNode(ctx.captures.id[0])],
  match: sel
    .tag('iframe')
    .attr('data-lexical-youtube', /^.+$/, { capture: 'id' }),
  name: '@lexical/playground/youtube',
});

export const YouTubeExtension = defineExtension({
  dependencies: [
    configExtension(DOMImportExtension, {
      rules: [YouTubeImportRule],
    }),
  ],
  name: '@lexical/playground/YouTube',
  nodes: [YouTubeNode],
  register: editor =>
    editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      payload => {
        const youTubeNode = $createYouTubeNode(payload);
        $insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
