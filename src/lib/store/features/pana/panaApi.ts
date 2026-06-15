import { createPana, deletePana, fetchActiveWorkspacePanasWithPagination } from "@/services"
import type { PanaType } from "@/types"
import { withAsyncHandler } from "@/utils/withAsyncHandler"

interface FetchPanasAddons {
    parentId?: string
}

export const fetchPanas = async (addons?: FetchPanasAddons): Promise<PanaType[]> => {
    const resolvedAddons = {
        params: addons
    }
    const res = await withAsyncHandler(() => fetchActiveWorkspacePanasWithPagination(resolvedAddons))
    return res?.data?.data
}

export const addNewPana = async (parentId?: string) => {
    const res = await withAsyncHandler(() => createPana(undefined, parentId))
    return res?.data
}

export const removePana = async (panaId: string) => {
    const res = await withAsyncHandler(() => deletePana(panaId))
    return res?.data
}