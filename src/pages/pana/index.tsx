import { useDebouncedCallback } from "@/hooks/debounce";
import Zeditor from "@/lib/zeditor";
import type { Block } from "@/lib/zeditor/types";
import { fetchBlocksByPanaId, storeBlocks } from "@/services";
import { withAsyncHandler } from "@/utils/withAsyncHandler";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const Pana = () => {
    const { panaId } = useParams()
    const [blocks, setBlocks] = useState<Block[]>([])
    const pendingRef = useRef(new Map())

    useEffect(() => {
        if (!panaId) return
        withAsyncHandler(
            () => fetchBlocksByPanaId(panaId),
            {
                onSuccess: (res) => {
                    setBlocks(res?.data?.data)
                }
            }
        )
    }, [])

    const handleBlockStore = useDebouncedCallback(async () => {
        if (pendingRef.current.size === 0 || !panaId) return;
        const blocks: Block[] = Array.from(pendingRef.current.values());
        pendingRef.current.clear();

        withAsyncHandler(
            () => storeBlocks(panaId, { blocks }),
            {
                onSuccess: () => {
                    console.log('fdkjhfj')
                }
            }
        )

    }, 2000)

    const handleChange = useCallback((val: Block[]) => {
        const filteredBlocks = val?.filter((b) => b?.content?.children.length > 0) ?? []

        // if (filteredBlocks?.length) {
        //     filteredBlocks.forEach((fb) => pendingRef.current.set(fb?.blockId, fb))
        //     handleBlockStore()
        // }

    }, [handleBlockStore])

    return (
        <div>
            <Zeditor onChange={handleChange} initialBlocks={blocks} />
        </div>
    )
}

export default Pana;
