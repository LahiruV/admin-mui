import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Grid, 
  TextField, 
  Button,
  MenuItem,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';
import { z } from 'zod';

import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import { monthlyFeeSchema } from '../utils/validationSchemas';
import { fetchClasses, fetchStudents, createPayments } from '../services/api';
import { setStudents } from '../store/slices/studentsSlice';
import { setClasses } from '../store/slices/classesSlice';
import { addPayment } from '../store/slices/paymentsSlice';
import { RootState } from '../store';
import { formatCurrency, getMonthName } from '../utils/helpers';

const AddMonthlyClassFee = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    classId: '',
    month: new Date().getMonth() + 1 + '',
    year: new Date().getFullYear() + '',
    studentIds: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const students = useSelector((state: RootState) => state.students.students);
  const classes = useSelector((state: RootState) => state.classes.classes);

  const { data: classesData, isLoading: classesLoading } = useQuery(['classes'], fetchClasses);
  const { data: studentsData, isLoading: studentsLoading } = useQuery(['students'], fetchStudents);

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
    if (formData.classId) {
      const filteredStudents = students.filter(
        (student) => student.classId === formData.classId && student.isActive
      );
      setSelectedStudents(filteredStudents);
      setSelectAll(false);
      setFormData({
        ...formData,
        studentIds: [],
      });
    }
  }, [formData.classId, students]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      setFormData({
        ...formData,
        studentIds: selectedStudents.map((student) => student.id),
      });
    } else {
      setFormData({
        ...formData,
        studentIds: [],
      });
    }
  };

  const handleCheckboxChange = (studentId: string) => {
    const newStudentIds = [...formData.studentIds];
    const index = newStudentIds.indexOf(studentId);
    
    if (index === -1) {
      newStudentIds.push(studentId);
    } else {
      newStudentIds.splice(index, 1);
    }
    
    setFormData({
      ...formData,
      studentIds: newStudentIds,
    });
    
    // Update selectAll state
    setSelectAll(newStudentIds.length === selectedStudents.length);
  };

  const validateForm = () => {
    try {
      monthlyFeeSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newPayments = await createPayments(formData);
      newPayments.forEach((payment) => {
        dispatch(addPayment(payment));
      });
      
      // Reset selected students
      setFormData({
        ...formData,
        studentIds: [],
      });
      setSelectAll(false);
      
      toast.success(`Monthly fee added for ${newPayments.length} students!`);
    } catch (error) {
      console.error('Error adding monthly fee:', error);
      toast.error('Failed to add monthly fee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = classesLoading || studentsLoading;
  const selectedClass = classes.find((cls) => cls.id === formData.classId);

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: getMonthName(i + 1),
  }));

  // Generate year options (current year and next year)
  const currentYear = new Date().getFullYear();
  const years = [
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() },
  ];

  return (
    <Box>
      <PageHeader
        title="Add Monthly Class Fee"
        breadcrumbs={[
          { name: 'Home', link: '/' },
          { name: 'Add Monthly Class Fee' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ContentCard title="Select Class and Period">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Select Class"
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.classId}
                    helperText={errors.classId}
                    required
                  >
                    {classesLoading ? (
                      <MenuItem disabled>Loading classes...</MenuItem>
                    ) : classes.length === 0 ? (
                      <MenuItem disabled>No classes available</MenuItem>
                    ) : (
                      classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.month}
                    helperText={errors.month}
                    required
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.year}
                    helperText={errors.year}
                    required
                  >
                    {years.map((year) => (
                      <MenuItem key={year.value} value={year.value}>
                        {year.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {selectedClass && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      Monthly fee: {formatCurrency(selectedClass.fee)} per student
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={
                      isSubmitting || 
                      isLoading || 
                      formData.studentIds.length === 0 ||
                      !formData.classId
                    }
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Add Monthly Fee'}
                  </Button>
                  {formData.studentIds.length === 0 && formData.classId && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Please select at least one student.
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </form>
          </ContentCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <ContentCard 
            title="Select Students" 
            subtitle={formData.classId 
              ? `${selectedStudents.length} active students in ${classes.find(c => c.id === formData.classId)?.name || 'selected class'}`
              : "Select a class to see students"
            }
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : !formData.classId ? (
              <Alert severity="info">Please select a class to view students.</Alert>
            ) : selectedStudents.length === 0 ? (
              <Alert severity="warning">No active students in this class.</Alert>
            ) : (
              <>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    color="primary"
                  />
                  <Typography variant="body2">
                    {selectAll ? 'Deselect All' : 'Select All'} Students
                  </Typography>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Parent Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Fee</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedStudents.map((student) => (
                        <TableRow 
                          key={student.id}
                          hover
                          onClick={() => handleCheckboxChange(student.id)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={formData.studentIds.includes(student.id)}
                              onChange={() => handleCheckboxChange(student.id)}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.parentName}</TableCell>
                          <TableCell>{student.phoneNumber}</TableCell>
                          <TableCell>{formatCurrency(student.classFee)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </ContentCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddMonthlyClassFee;