import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Grid, 
  TextField, 
  Button,
  Typography,
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
import EditClassDialog from '../components/dialogs/EditClassDialog';
import { classSchema } from '../utils/validationSchemas';
import { fetchClasses, createClass } from '../services/api';
import { addClass } from '../store/slices/classesSlice';
import { formatDate, formatCurrency } from '../utils/helpers';

const CreateClass = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    fee: '',
    startDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const { data: classes = [], isLoading, refetch } = useQuery(['classes'], fetchClasses);

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

  const validateForm = () => {
    try {
      classSchema.parse({
        ...formData,
        fee: parseFloat(formData.fee),
      });
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
      const newClass = await createClass({
        name: formData.name,
        fee: parseFloat(formData.fee),
        startDate: formData.startDate,
      });

      dispatch(addClass(newClass));
      
      // Reset form
      setFormData({
        name: '',
        fee: '',
        startDate: '',
      });
      
      toast.success('Class created successfully!');
      refetch();
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Failed to create class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Create Class"
        breadcrumbs={[
          { name: 'Home', link: '/' },
          { name: 'Create Class' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ContentCard title="New Class">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Class Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Class Fee"
                    name="fee"
                    type="number"
                    value={formData.fee}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>$</Typography>,
                    }}
                    error={!!errors.fee}
                    helperText={errors.fee}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Create Class'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </ContentCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ContentCard title="Existing Classes">
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : classes.length === 0 ? (
              <Alert severity="info">No classes created yet.</Alert>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Class Name</TableCell>
                      <TableCell>Fee</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classes.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>{cls.name}</TableCell>
                        <TableCell>{formatCurrency(cls.fee)}</TableCell>
                        <TableCell>{formatDate(cls.startDate)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => setEditingClass(cls)}
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </ContentCard>
        </Grid>
      </Grid>
      {editingClass && (
        <EditClassDialog
          open={!!editingClass}
          onClose={() => setEditingClass(null)}
          classData={editingClass}
        />
      )}
    </Box>
  );
};

export default CreateClass;