import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Class {
  id: string;
  name: string;
  fee: number;
  startDate: string;
  createdAt: string;
}

interface ClassesState {
  classes: Class[];
  loading: boolean;
  error: string | null;
}

const initialState: ClassesState = {
  classes: [],
  loading: false,
  error: null,
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setClasses: (state, action: PayloadAction<Class[]>) => {
      state.classes = action.payload;
    },
    addClass: (state, action: PayloadAction<Class>) => {
      state.classes.push(action.payload);
    },
    updateClass: (state, action: PayloadAction<Class>) => {
      const index = state.classes.findIndex(
        (cls) => cls.id === action.payload.id
      );
      if (index !== -1) {
        state.classes[index] = action.payload;
      }
    },
    deleteClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter(
        (cls) => cls.id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setClasses,
  addClass,
  updateClass,
  deleteClass,
} = classesSlice.actions;

export default classesSlice.reducer;