import type { RootState } from "@/lib/store";
import { filterPanas, getPanaById } from "@/lib/store/features/pana/utils";
import { createSelector } from "@reduxjs/toolkit";

const _selectPanaState = (state: RootState) => state.pana;

export const selectPanas = (state: RootState) => _selectPanaState(state).panas;
export const selectRootIds = (state: RootState) => _selectPanaState(state).rootPanasIds;
export const selectChildrenIds = (state: RootState, parentId: string) => getPanaById(_selectPanaState(state).panas, parentId).childrenIds ?? [];
export const selectStatus = (state: RootState) => _selectPanaState(state).status;

export const selectRootPanas = createSelector(
    [selectPanas, selectRootIds],
    (panas, rootPanasIds) => filterPanas(panas, rootPanasIds)
);

export const selectChildPanasById = (parentId: string) => createSelector(
    [selectPanas, (state: RootState) => selectChildrenIds(state, parentId)],
    (panas, filterIds) => filterPanas(panas, filterIds)
);
