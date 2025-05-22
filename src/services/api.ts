import { generateId, getCurrentMonthYear } from '../utils/helpers';
import { Class } from '../store/slices/classesSlice';
import { Student } from '../store/slices/studentsSlice';
import { Payment } from '../store/slices/paymentsSlice';

// Mock data for classes
const mockClasses: Class[] = [
  {
    id: 'class1',
    name: 'Mathematics',
    fee: 150,
    startDate: '2023-01-15',
    createdAt: '2023-01-01',
  },
  {
    id: 'class2',
    name: 'Science',
    fee: 180,
    startDate: '2023-01-20',
    createdAt: '2023-01-05',
  },
  {
    id: 'class3',
    name: 'English',
    fee: 120,
    startDate: '2023-01-10',
    createdAt: '2023-01-02',
  },
];

// Mock data for students
const mockStudents: Student[] = [
  {
    id: 'student1',
    name: 'John Doe',
    parentName: 'Robert Doe',
    phoneNumber: '1234567890',
    isActive: true,
    classId: 'class1',
    classFee: 150,
    createdAt: '2023-02-01',
  },
  {
    id: 'student2',
    name: 'Jane Smith',
    parentName: 'Mary Smith',
    phoneNumber: '9876543210',
    isActive: true,
    classId: 'class2',
    classFee: 180,
    createdAt: '2023-02-05',
  },
  {
    id: 'student3',
    name: 'Alex Johnson',
    parentName: 'David Johnson',
    phoneNumber: '5551234567',
    isActive: true,
    classId: 'class3',
    classFee: 120,
    createdAt: '2023-02-10',
  },
  {
    id: 'student4',
    name: 'Sophia Williams',
    parentName: 'James Williams',
    phoneNumber: '7778889999',
    isActive: false,
    classId: 'class1',
    classFee: 150,
    createdAt: '2023-02-15',
  },
];

// Mock data for payments
const { month, year } = getCurrentMonthYear();
const prevMonth = month === '1' ? '12' : (parseInt(month) - 1).toString();
const prevYear = month === '1' ? (parseInt(year) - 1).toString() : year;

const mockPayments: Payment[] = [
  {
    id: 'payment1',
    studentId: 'student1',
    classId: 'class1',
    amount: 150,
    month,
    year,
    status: 'paid',
    paymentDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'payment2',
    studentId: 'student2',
    classId: 'class2',
    amount: 180,
    month,
    year,
    status: 'unpaid',
    paymentDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'payment3',
    studentId: 'student3',
    classId: 'class3',
    amount: 120,
    month,
    year,
    status: 'paid',
    paymentDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'payment4',
    studentId: 'student4',
    classId: 'class1',
    amount: 150,
    month,
    year,
    status: 'unpaid',
    paymentDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'payment5',
    studentId: 'student1',
    classId: 'class1',
    amount: 150,
    month: prevMonth,
    year: prevYear,
    status: 'paid',
    paymentDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
  },
  {
    id: 'payment6',
    studentId: 'student2',
    classId: 'class2',
    amount: 180,
    month: prevMonth,
    year: prevYear,
    status: 'paid',
    paymentDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
  },
];

// API functions for classes
export const fetchClasses = async (): Promise<Class[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockClasses]);
    }, 500);
  });
};

export const createClass = async (classData: Omit<Class, 'id' | 'createdAt'>): Promise<Class> => {
  const newClass: Class = {
    ...classData,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      mockClasses.push(newClass);
      resolve(newClass);
    }, 500);
  });
};

// API functions for students
export const fetchStudents = async (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockStudents]);
    }, 500);
  });
};

export const createStudent = async (studentData: Omit<Student, 'id' | 'createdAt'>): Promise<Student> => {
  const newStudent: Student = {
    ...studentData,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      mockStudents.push(newStudent);
      resolve(newStudent);
    }, 500);
  });
};

export const updateStudent = async (
  studentId: string,
  studentData: Omit<Student, 'id' | 'createdAt'>
): Promise<Student> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const studentIndex = mockStudents.findIndex(s => s.id === studentId);
      
      if (studentIndex === -1) {
        reject(new Error('Student not found'));
        return;
      }
      
      const updatedStudent = {
        ...mockStudents[studentIndex],
        ...studentData,
      };
      
      mockStudents[studentIndex] = updatedStudent;
      resolve(updatedStudent);
    }, 500);
  });
};

export const updateClass = async (
  classId: string,
  classData: Omit<Class, 'id' | 'createdAt'>
): Promise<Class> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const classIndex = mockClasses.findIndex(c => c.id === classId);
      
      if (classIndex === -1) {
        reject(new Error('Class not found'));
        return;
      }
      
      const updatedClass = {
        ...mockClasses[classIndex],
        ...classData,
      };
      
      mockClasses[classIndex] = updatedClass;
      resolve(updatedClass);
    }, 500);
  });
};

// API functions for payments
export const fetchPayments = async (): Promise<Payment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockPayments]);
    }, 500);
  });
};

export const createPayments = async (paymentData: { 
  studentIds: string[]; 
  classId: string; 
  month: string; 
  year: string; 
}): Promise<Payment[]> => {
  const { studentIds, classId, month, year } = paymentData;
  const classObj = mockClasses.find(c => c.id === classId);
  
  if (!classObj) {
    throw new Error('Class not found');
  }

  const newPayments: Payment[] = studentIds.map(studentId => {
    const student = mockStudents.find(s => s.id === studentId);
    
    return {
      id: generateId(),
      studentId,
      classId,
      amount: student?.classFee || classObj.fee,
      month,
      year,
      status: 'unpaid',
      paymentDate: null,
      createdAt: new Date().toISOString(),
    };
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      mockPayments.push(...newPayments);
      resolve(newPayments);
    }, 500);
  });
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: 'paid' | 'unpaid'
): Promise<Payment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const paymentIndex = mockPayments.findIndex(p => p.id === paymentId);
      
      if (paymentIndex === -1) {
        reject(new Error('Payment not found'));
        return;
      }
      
      const updatedPayment = {
        ...mockPayments[paymentIndex],
        status,
        paymentDate: status === 'paid' ? new Date().toISOString() : null
      };
      
      mockPayments[paymentIndex] = updatedPayment;
      resolve(updatedPayment);
    }, 500);
  });
};