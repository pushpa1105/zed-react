import { useCallback } from 'react';
import type { Block } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';

interface ZeditorProps {
  initialContent: Block[];
  onChange?: (_: Block[]) => void;
}

export default function Zeditor({ initialContent, onChange }: ZeditorProps) {
  const editor = useCreateBlockNote({
    initialContent:
      initialContent && initialContent.length > 0
        ? initialContent
        : [
            {
              type: 'paragraph',
              content: [],
            },
          ],
  });

  const handleDocumentUpdate = useCallback(() => {
    onChange?.(editor.document);
  }, [editor, onChange]);

  return (
    <>
      <BlockNoteView
        editor={editor}
        shadCNComponents={
          {
            // Pass modified ShadCN components from your project here.
            // Otherwise, the default ShadCN components will be used.
          }
        }
        onChange={handleDocumentUpdate}
        theme="light"
      />
    </>
  );
}
