import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

import { studentSchema } from '../../utils/validationSchemas';
import { updateStudent as updateStudentApi } from '../../services/api';
import { updateStudent } from '../../store/slices/studentsSlice';
import { Student } from '../../store/slices/studentsSlice';
import { Class } from '../../store/slices/classesSlice';

interface EditStudentDialogProps {
  open: boolean;
  onClose: () => void;
  student: Student;
  classes: Class[];
}

const EditStudentDialog = ({ open, onClose, student, classes }: EditStudentDialogProps) => {
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

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        parentName: student.parentName,
        phoneNumber: student.phoneNumber,
        isActive: student.isActive,
        classId: student.classId,
        classFee: student.classFee,
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'isActive') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'classId') {
      const selectedClass = classes.find((cls) => cls.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        classFee: selectedClass ? selectedClass.fee : 0,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      const updatedStudent = await updateStudentApi(student.id, formData);
      dispatch(updateStudent(updatedStudent));
      toast.success('Student updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
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
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name} - ${cls.fee}/month
                  </MenuItem>
                ))}
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
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditStudentDialog;