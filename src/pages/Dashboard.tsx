import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  School as SchoolIcon, 
  Person as PersonIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon 
} from '@mui/icons-material';

import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import StatsCard from '../components/common/StatsCard';
import { fetchClasses } from '../services/api';
import { fetchStudents } from '../services/api';
import { fetchPayments } from '../services/api';
import { RootState } from '../store';
import { setClasses } from '../store/slices/classesSlice';
import { setStudents } from '../store/slices/studentsSlice';
import { setPayments } from '../store/slices/paymentsSlice';
import { 
  formatCurrency, 
  calculateTotalAmount, 
  calculatePaymentStatusCounts,
  getMonthName
} from '../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useSelector((state: RootState) => state.classes.classes);
  const students = useSelector((state: RootState) => state.students.students);
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

  const isLoading = classesLoading || studentsLoading || paymentsLoading;

  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter(student => student.isActive).length;
  const totalClasses = classes.length;
  
  const totalFeesCollected = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPendingFees = payments
    .filter(payment => payment.status === 'unpaid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Group payments by month for chart
  const paymentsByMonth = payments.reduce((acc, payment) => {
    const key = `${payment.year}-${payment.month}`;
    const monthName = `${getMonthName(payment.month)} ${payment.year}`;
    
    if (!acc[key]) {
      acc[key] = { 
        month: monthName,
        paid: 0,
        unpaid: 0,
        total: 0
      };
    }
    
    acc[key].total += payment.amount;
    
    if (payment.status === 'paid') {
      acc[key].paid += payment.amount;
    } else {
      acc[key].unpaid += payment.amount;
    }
    
    return acc;
  }, {} as Record<string, { month: string; paid: number; unpaid: number; total: number }>);

  const monthlyData = Object.values(paymentsByMonth).sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  // Data for bar chart
  const barChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Paid',
        data: monthlyData.map(item => item.paid),
        backgroundColor: theme.palette.success.main,
      },
      {
        label: 'Unpaid',
        data: monthlyData.map(item => item.unpaid),
        backgroundColor: theme.palette.error.main,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  };

  // Data for pie chart
  const { paid, unpaid } = calculatePaymentStatusCounts(payments);
  const pieChartData = {
    labels: ['Paid', 'Unpaid'],
    datasets: [
      {
        data: [paid, unpaid],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.error.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Data for students per class
  const studentsPerClass = classes.map(cls => {
    const count = students.filter(student => student.classId === cls.id).length;
    return {
      name: cls.name,
      count,
    };
  });

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[
          { name: 'Home', link: '/' },
          { name: 'Dashboard' },
        ]}
      />

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Students"
            value={totalStudents}
            subtitle="Students enrolled"
            icon={<PersonIcon fontSize="large" />}
            iconColor={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Students"
            value={activeStudents}
            subtitle={`${Math.round((activeStudents / totalStudents) * 100)}% of total`}
            icon={<PersonIcon fontSize="large" />}
            iconColor={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Classes"
            value={totalClasses}
            subtitle="Classes offered"
            icon={<SchoolIcon fontSize="large" />}
            iconColor={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Fees Collected"
            value={formatCurrency(totalFeesCollected)}
            subtitle={`${formatCurrency(totalPendingFees)} pending`}
            icon={<PaymentIcon fontSize="large" />}
            iconColor={theme.palette.info.main}
          />
        </Grid>

        {/* Monthly Fee Analysis */}
        <Grid item xs={12} md={8}>
          <ContentCard 
            title="Monthly Fee Analysis" 
            subtitle="Overview of fees collected and pending by month"
          >
            {isLoading ? (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Loading data...</Typography>
              </Box>
            ) : (
              <Box sx={{ height: 300 }}>
                <Bar data={barChartData} options={barChartOptions} />
              </Box>
            )}
          </ContentCard>
        </Grid>

        {/* Payment Status */}
        <Grid item xs={12} md={4}>
          <ContentCard 
            title="Payment Status" 
            subtitle="Overview of current payment status"
          >
            {isLoading ? (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Loading data...</Typography>
              </Box>
            ) : (
              <Box sx={{ height: 300 }}>
                <Pie data={pieChartData} options={pieChartOptions} />
              </Box>
            )}
          </ContentCard>
        </Grid>

        {/* Students per Class */}
        <Grid item xs={12}>
          <ContentCard 
            title="Students per Class" 
            subtitle="Distribution of students across classes"
          >
            {isLoading ? (
              <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Loading data...</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {studentsPerClass.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.name}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon color="primary" />
                        <Typography>{item.name}</Typography>
                      </Box>
                      <Typography fontWeight="bold">{item.count} students</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;