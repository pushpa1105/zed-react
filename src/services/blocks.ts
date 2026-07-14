import api from "@/lib/api";

export const fetchBlocksByPanaId = async (panaId: string) => await api.get(`/${panaId}/blocks`)
export const addOrUpdateBlocks = async (panaId: string, updatedBlocks: unknown) => await api.post(`/${panaId}/blocks`, { blocks: updatedBlocks })
export const deleteBlocksById = async (panaId: string, blockIds: string[]) => await api.post(`/${panaId}/blocks/bulk-delete`, { blockIds })