import { withAsyncHandler } from '@/shared/utils';

import { createPana, deletePana, fetchActiveWorkspacePanas } from '../api';
import type { PanaType } from '../types';

export const fetchPanas = async (): Promise<PanaType[]> => {
  const res = await withAsyncHandler(fetchActiveWorkspacePanas);
  return res?.data;
};

export const addNewPana = async (parentId?: string) => {
  const res = await withAsyncHandler(() => createPana(undefined, parentId));
  return res?.data;
};

export const removePana = async (panaId: string) => {
  const res = await withAsyncHandler(() => deletePana(panaId));
  return res?.data;
};
