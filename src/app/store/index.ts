import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { panaSlice } from '@/features/pana/store/panaSlice';

const rootReducer = combineSlices(panaSlice);

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];

export * from './types';

export default store;
