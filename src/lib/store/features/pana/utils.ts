import type { NormalizePanas } from "@/lib/store/types";
import type { PanaType } from "@/types";

export const buildPana = (pana: PanaType): PanaType => ({
    ...pana,
    children: [],
    childrenIds: [],
    hasChildrenAdded: false,
    isOpen: false,
})

export const normalizePanas = (panas: PanaType[]): { normalizedData: NormalizePanas, rootIds: string[] } => {
    const normalizedData: NormalizePanas = {}
    const rootIds: string[] = []

    for (const pana of panas) {
        normalizedData[pana._id] = buildPana(pana)

        if (pana?.parentId) {
            normalizedData[pana.parentId].childrenIds?.push(pana._id)
            continue
        }

        rootIds.push(pana._id)
    }

    return { normalizedData, rootIds }
}

export const filterPanas = (panas: NormalizePanas, filterIds: string[]): PanaType[] => filterIds.map(panaId => panas[panaId]).filter(pana => !!pana)
export const getPanaById = (panas: NormalizePanas, panaId: string): PanaType => panas[panaId]