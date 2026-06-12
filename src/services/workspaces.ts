import api from "@/lib/api";
import type { CreateWorkspaceType } from "@/types";

export const fetchMyWorkspacesWithPagination = async () => await api.get('/workspaces/my')
export const createWorkspace = async (data: CreateWorkspaceType) => await api.post('/workspaces/create', data)