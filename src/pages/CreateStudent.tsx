import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Grid, 
  TextField, 
  Button,
  FormControlLabel,
  Switch,
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
  IconButton
} from '@mui/material';
import { toast } from 'sonner';
import { z } from 'zod';
import { Edit as EditIcon } from '@mui/icons-material';

import PageHeader from '../components/common/PageHeader';
import ContentCard from '../components/common/ContentCard';
import EditStudentDialog from '../components/dialogs/EditStudentDialog';
import { studentSchema } from '../utils/validationSchemas';
import { fetchClasses, fetchStudents, createStudent } from '../services/api';
import { addStudent } from '../store/slices/studentsSlice';
import { formatDate } from '../utils/helpers';

const CreateStudent = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    phoneNumber: '',
    isActive: true,
    classId: '',
    classFee: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { data: classes = [], isLoading: classesLoading } = useQuery(['classes'], fetchClasses);
  const { data: students = [], isLoading: studentsLoading, refetch } = useQuery(['students'], fetchStudents);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'isActive') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === 'classId') {
      const selectedClass = classes.find((cls) => cls.id === value);
      setFormData({
        ...formData,
        [name]: value,
        classFee: selectedClass ? selectedClass.fee : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    try {
      studentSchema.parse(formData);
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
      const newStudent = await createStudent(formData);
      dispatch(addStudent(newStudent));
      
      // Reset form
      setFormData({
        name: '',
        parentName: '',
        phoneNumber: '',
        isActive: true,
        classId: '',
        classFee: 0,
      });
      
      toast.success('Student created successfully!');
      refetch();
    } catch (error) {
      console.error('Error creating student:', error);
      toast.error('Failed to create student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = classesLoading || studentsLoading;

  return (
    <Box>
      <PageHeader
        title="Create Student"
        breadcrumbs={[
          { name: 'Home', link: '/' },
          { name: 'Create Student' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ContentCard title="New Student">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Student Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Parent Name"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.parentName}
                    helperText={errors.parentName}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber || 'Format: 10 digits only'}
                    required
                  />
                </Grid>
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
                          {cls.name} - ${cls.fee}/month
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
                {formData.classId && formData.classFee > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      Student will be charged ${formData.classFee} per month.
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleChange}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label="Active Student"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitting || classesLoading || classes.length === 0}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Create Student'}
                  </Button>
                  {classes.length === 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Please create at least one class before adding students.
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </form>
          </ContentCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ContentCard title="Existing Students">
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : students.length === 0 ? (
              <Alert severity="info">No students created yet.</Alert>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Parent Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => {
                      const studentClass = classes.find(
                        (cls) => cls.id === student.classId
                      );
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.parentName}</TableCell>
                          <TableCell>{student.phoneNumber}</TableCell>
                          <TableCell>{studentClass?.name || 'Unknown'}</TableCell>
                          <TableCell align="center">
                            {student.isActive ? (
                              <Box
                                sx={{
                                  bgcolor: 'success.main',
                                  color: 'white',
                                  py: 0.5,
                                  px: 1.5,
                                  borderRadius: 1,
                                  display: 'inline-block',
                                  fontSize: '0.75rem',
                                }}
                              >
                                Active
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  py: 0.5,
                                  px: 1.5,
                                  borderRadius: 1,
                                  display: 'inline-block',
                                  fontSize: '0.75rem',
                                }}
                              >
                                Inactive
                              </Box>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => setEditingStudent(student)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'primary.dark',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
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
      </Grid>
      {editingStudent && (
        <EditStudentDialog
          open={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          student={editingStudent}
          classes={classes}
        />
      )}
    </Box>
  );
};

export default CreateStudent;