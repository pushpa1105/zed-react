import type { NormalizePanas } from "@/lib/store/types";
import type { PanaType } from "@/types";

export const buildPana = (pana: PanaType): PanaType => ({
    ...pana,
    children: [],
    childrenIds: [],
    hasChildrenFetched: false,
    isOpen: false,
})

export const normalizePanas = (panas: PanaType[]): NormalizePanas => {
    const normalizedData: NormalizePanas = {}

    for (const pana of panas)
        normalizedData[pana._id] = buildPana(pana)

    return normalizedData
}

export const filterPanas = (panas: NormalizePanas, filterIds: string[]): PanaType[] => filterIds.map(panaId => panas[panaId]).filter(pana => !!pana)
export const getPanaById = (panas: NormalizePanas, panaId: string): PanaType => panas[panaId]