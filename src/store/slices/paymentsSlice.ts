import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Payment {
  id: string;
  studentId: string;
  classId: string;
  amount: number;
  month: string;
  year: string;
  status: 'paid' | 'unpaid';
  paymentDate: string | null;
  createdAt: string;
}

interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  payments: [],
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(
        (payment) => payment.id === action.payload.id
      );
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    updatePaymentStatus: (state, action: PayloadAction<{ id: string; status: 'paid' | 'unpaid', paymentDate: string | null }>) => {
      const index = state.payments.findIndex(
        (payment) => payment.id === action.payload.id
      );
      if (index !== -1) {
        state.payments[index].status = action.payload.status;
        state.payments[index].paymentDate = action.payload.paymentDate;
      }
    },
    deletePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter(
        (payment) => payment.id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setPayments,
  addPayment,
  updatePayment,
  updatePaymentStatus,
  deletePayment,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;