import api from "@/lib/api";

export const fetchActiveWorkspacePanasWithPagination = async (addons?: any) => await api.get('/panas/current-workspace', addons)
export const createPana = async (title?: string, parentId?: string) => await api.post('/panas/create', { title }, { params: { parentId } })
export const deletePana = async (id: string) => await api.delete(`/panas/${id}`)