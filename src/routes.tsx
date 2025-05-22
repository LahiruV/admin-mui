import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CreateStudent from './pages/CreateStudent';
import CreateClass from './pages/CreateClass';
import AddMonthlyClassFee from './pages/AddMonthlyClassFee';
import PaymentManagement from './pages/PaymentManagement';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-student" element={<CreateStudent />} />
        <Route path="create-class" element={<CreateClass />} />
        <Route path="add-monthly-fee" element={<AddMonthlyClassFee />} />
        <Route path="payment-management" element={<PaymentManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;