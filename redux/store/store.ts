import { configureStore } from '@reduxjs/toolkit';
import navItemReducer from '../slices/navItemSlice';

export const store = configureStore({
  reducer: {
    navItem: navItemReducer,
    // add more slices here later...
  },
 
});

// Inferred types for the whole app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
