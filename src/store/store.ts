import { configureStore } from '@reduxjs/toolkit';
import { tokenomicsApi } from './api/tokenomicsApi';

export const store = configureStore({
  reducer: {
    [tokenomicsApi.reducerPath]: tokenomicsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenomicsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 