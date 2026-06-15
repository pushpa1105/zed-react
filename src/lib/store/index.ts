import { panaSlice } from '@/lib/store/features/pana/panaSlice';
import { configureStore, combineSlices } from '@reduxjs/toolkit'

const rootReducer = combineSlices(
    panaSlice
);

export type RootState = ReturnType<typeof rootReducer>;


const store = configureStore({
    reducer: rootReducer,
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]

export default store;