import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Grid, 
  TextField, 
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';

import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { fetchClasses, fetchStudents, fetchPayments, updatePaymentStatus } from '../services/api';
import { setStudents } from '../store/slices/studentsSlice';
import { setClasses } from '../store/slices/classesSlice';
import { setPayments, updatePaymentStatus as updatePaymentStatusAction } from '../store/slices/paymentsSlice';
import { RootState } from '../store';
import { formatCurrency, formatDate, getMonthName } from '../utils/helpers';

const PaymentManagement = () => {
  const dispatch = useDispatch();
  const [classFilter, setClassFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUpdating, setIsUpdating] = useState(false);

  const students = useSelector((state: RootState) => state.students.students);
  const classes = useSelector((state: RootState) => state.classes.classes);
  const payments = useSelector((state: RootState) => state.payments.payments);

  const { data: classesData, isLoading: classesLoading } = useQuery(['classes'], fetchClasses);
  const { data: studentsData, isLoading: studentsLoading } = useQuery(['students'], fetchStudents);
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery(['payments'], fetchPayments);

  useEffect(() => {
    if (classesData) {
      dispatch(setClasses(classesData));
    }
  }, [classesData, dispatch]);

  useEffect(() => {
    if (studentsData) {
      dispatch(setStudents(studentsData));
    }
  }, [studentsData, dispatch]);

  useEffect(() => {
    if (paymentsData) {
      dispatch(setPayments(paymentsData));
    }
  }, [paymentsData, dispatch]);

  const handleStatusChange = async (paymentId: string, newStatus: 'paid' | 'unpaid') => {
    setIsUpdating(true);
    try {
      const updatedPayment = await updatePaymentStatus(paymentId, newStatus);
      dispatch(updatePaymentStatusAction({
        id: paymentId,
        status: newStatus,
        paymentDate: newStatus === 'paid' ? new Date().toISOString() : null,
      }));
      
      toast.success(`Payment marked as ${newStatus}!`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const isLoading = classesLoading || studentsLoading || paymentsLoading;

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: getMonthName(i + 1),
  }));

  // Generate year options (current year and past year)
  const currentYear = new Date().getFullYear();
  const years = [
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() },
  ];

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    if (classFilter && payment.classId !== classFilter) return false;
    if (monthFilter && payment.month !== monthFilter) return false;
    if (yearFilter && payment.year !== yearFilter) return false;
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    return true;
  });

  return (
    <Box>
      <PageHeader
        title="Payment Management"
        breadcrumbs={[
          { name: 'Home', link: '/' },
          { name: 'Payment Management' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ContentCard title="Filters">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Class"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">All Months</MenuItem>
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Year"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">All Years</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year.value} value={year.value}>
                      {year.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label="Payment Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setClassFilter('');
                    setMonthFilter('');
                    setYearFilter('');
                    setStatusFilter('all');
                  }}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </ContentCard>
        </Grid>

        <Grid item xs={12}>
          <ContentCard 
            title="Payment Records" 
            subtitle={`${filteredPayments.length} payments found`}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : filteredPayments.length === 0 ? (
              <Alert severity="info">No payments found with the selected filters.</Alert>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Month/Year</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((payment) => {
                      const student = students.find(s => s.id === payment.studentId);
                      const classObj = classes.find(c => c.id === payment.classId);
                      
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>{student?.name || 'Unknown'}</TableCell>
                          <TableCell>{classObj?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            {getMonthName(payment.month)} {payment.year}
                          </TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Chip
                              label={payment.status === 'paid' ? 'Paid' : 'Unpaid'}
                              color={payment.status === 'paid' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {payment.paymentDate
                              ? formatDate(payment.paymentDate)
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {payment.status === 'unpaid' ? (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleStatusChange(payment.id, 'paid')}
                                disabled={isUpdating}
                              >
                                Mark Paid
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<CancelIcon />}
                                onClick={() => handleStatusChange(payment.id, 'unpaid')}
                                disabled={isUpdating}
                              >
                                Mark Unpaid
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </ContentCard>
        </Grid>

        <Grid item xs={12}>
          <ContentCard title="Payment Summary">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {filteredPayments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Payments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {filteredPayments.filter(p => p.status === 'paid').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Paid Payments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {filteredPayments.filter(p => p.status === 'unpaid').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unpaid Payments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(
                      filteredPayments.reduce((sum, p) => 
                        p.status === 'unpaid' ? sum + p.amount : sum, 0
                      )
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Outstanding
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentManagement;