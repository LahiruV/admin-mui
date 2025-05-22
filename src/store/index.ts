import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './slices/studentsSlice';
import classesReducer from './slices/classesSlice';
import paymentsReducer from './slices/paymentsSlice';

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    classes: classesReducer,
    payments: paymentsReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;