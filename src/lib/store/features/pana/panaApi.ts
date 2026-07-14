import { createPana, deletePana, fetchActiveWorkspacePanas } from "@/services"
import type { PanaType } from "@/types"
import { withAsyncHandler } from "@/utils/withAsyncHandler"

export const fetchPanas = async (): Promise<PanaType[]> => {
    const res = await withAsyncHandler(fetchActiveWorkspacePanas)
    return res?.data
}

export const addNewPana = async (parentId?: string) => {
    const res = await withAsyncHandler(() => createPana(undefined, parentId))
    return res?.data
}

export const removePana = async (panaId: string) => {
    const res = await withAsyncHandler(() => deletePana(panaId))
    return res?.data
}