import api from "@/lib/api";

export const fetchActiveWorkspacePanas = async () => await api.get('/panas/current-workspace')
export const createPana = async (title?: string, parentId?: string) => await api.post('/panas/create', { title }, { params: { parentId } })
export const deletePana = async (id: string) => await api.delete(`/panas/${id}`)