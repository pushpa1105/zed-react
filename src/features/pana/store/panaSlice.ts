import type { PayloadAction } from '@reduxjs/toolkit';

import { type StoreStatus } from '@/app/store';
import { createAppSlice } from '@/app/store/createAppSlice';

import type { NormalizePanas } from '../types';

import { addNewPana, fetchPanas, removePana } from './panaApi';
import { buildPana, normalizePanas } from './utils';

export interface panaSliceState {
  status: StoreStatus | null;
  panas: NormalizePanas;
  rootPanasIds: string[];
}

const initialState: panaSliceState = {
  status: null,
  panas: {},
  rootPanasIds: [],
};

export const panaSlice = createAppSlice({
  name: 'pana',
  initialState,
  reducers: (create) => ({
    fetchRootPanas: create.asyncThunk(async () => fetchPanas(), {
      pending: (state) => {
        state.status = 'loading';
      },
      fulfilled: (state, action) => {
        state.status = 'succeed';
        const { normalizedData, rootIds } = normalizePanas(action.payload);
        state.panas = {
          ...state.panas,
          ...normalizedData,
        };

        state.rootPanasIds = [...new Set([...state.rootPanasIds, ...rootIds])];
      },
      rejected: (state) => {
        state.status = 'failed';
      },
    }),
    togglePana: create.reducer((state, action: PayloadAction<string>) => {
      let activePana;
      let activePanaId: string = action.payload;
      do {
        activePana = state.panas[activePanaId];
        state.panas[activePanaId] = {
          ...state.panas[activePanaId],
          isOpen: !state?.panas?.[activePanaId]?.isOpen,
        };

        if (activePana?.parentId) activePanaId = activePana.parentId;
      } while (activePana?.parentId);
    }),
    addPana: create.asyncThunk(
      async (parentId?: string) => addNewPana(parentId),
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'succeed';
          const { payload, meta } = action;
          state.panas[payload._id] = buildPana(payload);

          if (meta.arg) {
            state.panas[meta.arg].childrenIds?.unshift(payload._id);
            state.panas[meta.arg].isOpen = true;
          } else {
            state.rootPanasIds = [
              ...new Set([...state.rootPanasIds, payload._id]),
            ];
          }
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
    deletePana: create.asyncThunk(
      async (panaId: string) => removePana(panaId),
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'succeed';
          const { meta } = action;

          if (meta.arg) delete state.panas[meta.arg];
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
  }),
});

export const { fetchRootPanas, togglePana, addPana, deletePana } =
  panaSlice.actions;

export default panaSlice.reducer;
