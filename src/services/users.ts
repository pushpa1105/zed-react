import api from "@/lib/api";

export const updateActiveWorkspace = async (workspaceId: string) => await api.patch(`/users/me/active-workspace`, { workspaceId })