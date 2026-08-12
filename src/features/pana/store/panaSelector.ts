import { createSelector } from '@reduxjs/toolkit';

import { filterPanas, getPanaById } from '@/features/pana/store/utils';
import type { PanaType } from '@/features/pana/types';

import type { RootState } from '@/app/store';

const _selectPanaState = (state: RootState) => state.pana;

export const selectPanas = (state: RootState) => _selectPanaState(state).panas;
export const selectRootIds = (state: RootState) =>
  _selectPanaState(state).rootPanasIds;
export const selectChildrenIds = (state: RootState, parentId: string) =>
  getPanaById(_selectPanaState(state).panas, parentId).childrenIds ?? [];
export const selectStatus = (state: RootState) =>
  _selectPanaState(state).status;

export const selectRootPanas = createSelector(
  [selectPanas, selectRootIds],
  (panas, rootPanasIds) => filterPanas(panas, rootPanasIds)
);

export const selectChildPanasById = (parentId: string) =>
  createSelector(
    [selectPanas, (state: RootState) => selectChildrenIds(state, parentId)],
    (panas, filterIds) => filterPanas(panas, filterIds)
  );

export const selectPanaBreadCrumbs = (panaId?: string) =>
  createSelector([selectPanas], (panas) => {
    if (!panaId) return [];
    let current = getPanaById(panas, panaId) as PanaType | null;
    const crumbs: PanaType[] = [];
    while (current) {
      crumbs.unshift(current);
      current = current.parentId
        ? (getPanaById(panas, current.parentId) as PanaType | null)
        : null;
    }

    return crumbs;
  });
