import { z } from 'zod';

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  fee: z.number().min(0, 'Fee must be a positive number').or(
    z.string().min(1, 'Fee is required').transform((val) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        throw new Error('Fee must be a number');
      }
      return parsed;
    })
  ),
  startDate: z.string().min(1, 'Start date is required'),
});

export const studentSchema = z.object({
  name: z.string().min(1, 'Student name is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  isActive: z.boolean().default(true),
  classId: z.string().min(1, 'Class is required'),
});

export const monthlyFeeSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(1, 'Year is required'),
  studentIds: z.array(z.string()).min(1, 'At least one student must be selected'),
});

export const paymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  status: z.enum(['paid', 'unpaid']),
});