import { $createTweetNode, TweetNode } from '@/lib/zeditor/nodes';
import { defineImportRule, DOMImportExtension, sel } from '@lexical/html';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from 'lexical';

export const INSERT_TWEET_COMMAND: LexicalCommand<string> =
  createCommand('INSERT_TWEET_COMMAND');

const TweetImportRule = defineImportRule({
  $import: ctx => [$createTweetNode(ctx.captures.id[0])],
  match: sel.tag('div').attr('data-lexical-tweet-id', /^.+$/, { capture: 'id' }),
  name: '@lexical/playground/tweet',
});

export const TwitterExtension = defineExtension({
  dependencies: [
    configExtension(DOMImportExtension, {
      rules: [TweetImportRule],
    }),
  ],
  name: '@lexical/playground/Twitter',
  nodes: [TweetNode],
  register: editor =>
    editor.registerCommand<string>(
      INSERT_TWEET_COMMAND,
      payload => {
        const tweetNode = $createTweetNode(payload);
        $insertNodeToNearestRoot(tweetNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
