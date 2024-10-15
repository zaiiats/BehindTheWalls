// store.ts
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
});

// Define the RootState type based on the store
export type RootState = ReturnType<typeof store.getState>;

export default store;
