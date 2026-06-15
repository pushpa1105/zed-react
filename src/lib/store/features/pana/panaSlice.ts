import type { RootState } from "@/lib/store";
import { createAppSlice } from "@/lib/store/createAppSlice";
import { addNewPana, fetchPanas, removePana } from "@/lib/store/features/pana/panaApi";
import { buildPana, getPanaById, normalizePanas } from "@/lib/store/features/pana/utils";
import type { NormalizePanas, StoreStatus } from "@/lib/store/types";
import { createPana } from "@/services";

export interface panaSliceState {
    status: StoreStatus | null,
    panas: NormalizePanas,
    rootPanasIds: string[],
}

const initialState: panaSliceState = {
    status: null,
    panas: {},
    rootPanasIds: [],
}

export const panaSlice = createAppSlice({
    name: 'pana',
    initialState,
    reducers: (create) => ({
        fetchRootPanas: create.asyncThunk(
            async () => fetchPanas(),
            {
                pending: (state) => { state.status = 'loading' },
                fulfilled: (state, action) => {
                    state.status = 'succeed';
                    const data = normalizePanas(action.payload)
                    state.panas = {
                        ...state.panas,
                        ...data,
                    }

                    state.rootPanasIds = [
                        ...new Set([
                            ...state.rootPanasIds,
                            ...Object.keys(data),
                        ])
                    ]
                },
                rejected: (state) => { state.status = 'failed' },
            }
        ),
        togglePana: create.asyncThunk(
            async (id: string, { getState }) => {
                const panas = (getState() as RootState).pana.panas
                const pana = getPanaById(panas, id)

                if (pana.hasChildrenFetched) {
                    return { isRefetched: false, fetchedPanas: [] }
                }

                return { isRefetched: true, fetchedPanas: await fetchPanas({ parentId: id }) }
            },
            {
                pending: (state) => { state.status = 'loading' },
                fulfilled: (state, action) => {
                    state.status = 'succeed';
                    const { isRefetched, fetchedPanas } = action.payload

                    state.panas[action.meta.arg].isOpen = !state.panas[action.meta.arg].isOpen

                    if (!isRefetched) return

                    const data = normalizePanas(fetchedPanas)
                    state.panas = {
                        ...state.panas,
                        ...data,
                    }
                    state.panas[action.meta.arg].childrenIds = Object.keys(data)
                    state.panas[action.meta.arg].hasChildrenFetched = true
                },
                rejected: (state) => { state.status = 'failed' },
            }
        ),
        addPana: create.asyncThunk(
            async (parentId?: string) => addNewPana(parentId),
            {
                pending: (state) => { state.status = 'loading' },
                fulfilled: (state, action) => {
                    state.status = 'succeed';
                    const { payload, meta } = action
                    state.panas[payload._id] = buildPana(payload)

                    if (meta.arg) {
                        state.panas[meta.arg].childrenIds?.unshift(payload._id)
                        state.panas[meta.arg].isOpen = true
                    }
                },
                rejected: (state) => { state.status = 'failed' },
            }
        ),
        deletePana: create.asyncThunk(
            async (panaId: string) => removePana(panaId),
            {
                pending: (state) => { state.status = 'loading' },
                fulfilled: (state, action) => {
                    state.status = 'succeed';
                    const { meta } = action

                    if (meta.arg) delete state.panas[meta.arg]
                },
                rejected: (state) => { state.status = 'failed' },
            }
        )
    }),
});

export const {
    fetchRootPanas,
    togglePana,
    addPana,
    deletePana
} = panaSlice.actions;

export default panaSlice.reducer;
