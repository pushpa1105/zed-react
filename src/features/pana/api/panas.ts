import type { PanaType } from '@/features/pana/types';

import api from '@/shared/lib/api';

export const fetchPanasByWorkspace = async (workspaceId: string) =>
  await api.get(`/workspaces/${workspaceId}/panas`);

export const createPana = async (title?: string, parentId?: string) =>
  await api.post('/panas/create', { title }, { params: { parentId } });

export const deletePana = async (id: string) =>
  await api.delete(`/panas/${id}`);

export const updatePana = async (id: string, data: Partial<PanaType>) =>
  await api.patch(`/panas/${id}`, data);
