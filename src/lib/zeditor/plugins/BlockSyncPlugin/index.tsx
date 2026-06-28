import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect, useRef } from "react";

export default function BlockSyncPlugin({
    pageId,
    idMapRef,
    onChange
}: {
    pageId: string,
    idMapRef: React.RefObject<Map<string, string>>,
    onChange: (_: any) => void
}
) {
    const [editor] = useLexicalComposerContext();
    const prevSnapshotRef = useRef(new Map()); // blockId -> serialized JSON string

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {

            editorState.read(() => {
                const root = $getRoot();
                const children = root.getChildren();

                const currentSnapshot = new Map();
                const changes = []; // { blockId, order, type, content, op: 'upsert' }

                function serializeNodeDeep(node: any): any {
                    const json = node.exportJSON();
                    if (typeof node.getChildren === 'function') {
                        json.children = node.getChildren().map(serializeNodeDeep);
                    }
                    return json;
                }

                children.forEach((node, index) => {
                    const nodeKey = node.getKey();
                    const blockId = idMapRef.current.get(nodeKey);
                    const json = JSON.stringify(serializeNodeDeep(node));
                    currentSnapshot.set(blockId, json);

                    if (prevSnapshotRef.current.get(blockId) !== json) {
                        changes.push({
                            blockId,
                            order: index, // swap for fractional index in real impl
                            type: node.getType(),
                            content: serializeNodeDeep(node),
                            op: 'upsert',
                        });
                    }
                });

                // detect deletions
                for (const oldId of prevSnapshotRef.current.keys()) {
                    if (!currentSnapshot.has(oldId)) {
                        changes.push({ blockId: oldId, op: 'delete' });
                    }
                }

                prevSnapshotRef.current = currentSnapshot;

                // call api here
                // if (changes.length) queueBlockSync(pageId, changes);

                if (changes.length) onChange(changes)
            });
        });
    }, [editor]);

    return null;
}