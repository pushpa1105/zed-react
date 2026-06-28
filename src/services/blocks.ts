import api from "@/lib/api";
import type { Block } from "@/lib/zeditor/types";

export const fetchBlocksByPanaId = async (panaId: string) => await api.get(`/${panaId}/blocks`);
export const storeBlocks = async (panaId: string, data: { blocks: Block[] }) => await api.post(`/${panaId}/blocks`, data);