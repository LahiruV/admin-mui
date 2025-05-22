import { format } from 'date-fns';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Format date to a readable format
export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get month name from month number
export const getMonthName = (month: string | number): string => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthIndex = typeof month === 'string' ? parseInt(month, 10) - 1 : month - 1;
  return monthNames[monthIndex];
};

// Get current month and year
export const getCurrentMonthYear = (): { month: string; year: string } => {
  const now = new Date();
  return {
    month: (now.getMonth() + 1).toString(),
    year: now.getFullYear().toString(),
  };
};

// Group payments by month and year
export const groupPaymentsByMonth = (payments: any[]) => {
  return payments.reduce((acc, payment) => {
    const key = `${payment.year}-${payment.month}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(payment);
    return acc;
  }, {});
};

// Calculate total amount from payments
export const calculateTotalAmount = (payments: any[]): number => {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
};

// Calculate payment status counts
export const calculatePaymentStatusCounts = (payments: any[]) => {
  return payments.reduce(
    (acc, payment) => {
      if (payment.status === 'paid') {
        acc.paid += 1;
      } else {
        acc.unpaid += 1;
      }
      return acc;
    },
    { paid: 0, unpaid: 0 }
  );
};