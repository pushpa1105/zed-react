import { withAsyncHandler } from '@/shared/utils';

import {
  createPana,
  deletePana,
  fetchPanasByWorkspace,
  updatePana,
} from '../api';
import type { PanaType } from '../types';

export const fetchPanas = async (workspaceId: string): Promise<PanaType[]> => {
  const res = await withAsyncHandler(() => fetchPanasByWorkspace(workspaceId));
  return (res?.data as PanaType[]) ?? [];
};

export const addNewPana = async (parentId?: string): Promise<PanaType> => {
  const res = await withAsyncHandler(() => createPana(undefined, parentId));
  return res?.data as PanaType;
};

export const removePana = async (panaId: string) => {
  const res = await withAsyncHandler(() => deletePana(panaId));
  return res?.data;
};

export const patchPana = async (panaId: string, data: Partial<PanaType>) => {
  const res = await withAsyncHandler(() => updatePana(panaId, data));
  return res?.data;
};
