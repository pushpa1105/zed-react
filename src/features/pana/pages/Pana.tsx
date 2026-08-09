import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Block } from '@blocknote/core';
import { useParams } from 'react-router-dom';

import Zeditor from '@/shared/components/editor/DefaultEditor';
import { debounce, withAsyncHandler } from '@/shared/utils';

import {
  addOrUpdateBlocks,
  deleteBlocksById,
  fetchBlocksByPanaId,
} from '../api';
import type { BlockDocument, UpdatedBlockInterface } from '../types';
import {
  findBlockContext,
  flattenBlocks,
  getOrderForBlock,
  parseToZeditorFormat,
} from '../utils';

const Pana = () => {
  const { id: panaId } = useParams();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const orderMapRef = useRef(new Map()); // blockId -> order string, seeded from initialContent

  const prevFlatRef = useRef(flattenBlocks([], panaId!));

  const syncToBackend = useCallback(
    async (tree: Block[]) => {
      if (!panaId) return;

      const prevFlat = prevFlatRef.current;
      const prevMap = new Map(prevFlat.map((b) => [b.id, b]));

      const newFlat = flattenBlocks(tree, panaId);
      const newMap = new Map(newFlat.map((b) => [b.id, b]));

      const upserts: UpdatedBlockInterface[] = [];
      const deletes: string[] = [];

      for (const [id, block] of newMap) {
        const old = prevMap.get(id);
        const ctx = findBlockContext(tree, id);
        const newParentId = ctx?.parentId;

        const contentChanged =
          !old ||
          JSON.stringify(old.content) !== JSON.stringify(block.content) ||
          JSON.stringify(old.props) !== JSON.stringify(block.props);

        const parentChanged = old && old.parentId !== newParentId;

        // did its position among siblings change?
        const siblingIds = ctx?.siblings.map((b) => b.id);
        const oldSiblingIds = prevFlat
          .filter((b) => b.parentId === old?.parentId)
          .map((b) => b.id);
        const positionChanged =
          !old ||
          siblingIds?.indexOf(id) !== oldSiblingIds.indexOf(id) ||
          parentChanged;

        if (contentChanged || positionChanged) {
          const order = positionChanged
            ? getOrderForBlock(tree, id, orderMapRef.current)
            : orderMapRef.current.get(id);

          upserts.push({
            id,
            panaId,
            parentId: newParentId,
            order,
            type: block.type,
            content: block.content,
            props: block.props,
          });
        }
      }

      for (const id of prevMap.keys()) {
        if (!newMap.has(id)) {
          deletes.push(id);
          orderMapRef.current.delete(id);
        }
      }

      if (upserts.length) {
        await withAsyncHandler(() => addOrUpdateBlocks(panaId, upserts), {
          showSuccessToast: false,
        });
      }

      if (deletes.length) {
        await withAsyncHandler(() => deleteBlocksById(panaId, deletes), {
          showSuccessToast: false,
        });
      }

      prevFlatRef.current = newFlat;
    },
    [panaId]
  );

  const handleChange = useMemo(
    () =>
      debounce(
        // eslint-disable-next-line react-hooks/refs
        (updatedDocument: Block[]) => syncToBackend(updatedDocument),
        500
      ),
    [syncToBackend]
  );

  useEffect(() => {
    if (!panaId) return;
    withAsyncHandler(() => fetchBlocksByPanaId(panaId), {
      onSuccess: (res) => {
        const data = res?.data?.data as BlockDocument[];
        const parsedData = parseToZeditorFormat(data);
        setBlocks(parsedData);
        const newFlat = flattenBlocks(parsedData, panaId); // for content/type/props diffing
        prevFlatRef.current = newFlat;
        setIsFetching(false);
      },
    });
  }, [panaId]);

  if (isFetching) {
    return <div>fetching....</div>;
  }

  return (
    <div>
      <Zeditor initialContent={blocks} onChange={handleChange} />
    </div>
  );
};

export default Pana;
