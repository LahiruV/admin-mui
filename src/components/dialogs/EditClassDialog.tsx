import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

import { classSchema } from '../../utils/validationSchemas';
import { updateClass as updateClassApi } from '../../services/api';
import { updateClass } from '../../store/slices/classesSlice';
import { Class } from '../../store/slices/classesSlice';

interface EditClassDialogProps {
  open: boolean;
  onClose: () => void;
  classData: Class;
}

const EditClassDialog = ({ open, onClose, classData }: EditClassDialogProps) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    fee: '',
    startDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        fee: classData.fee.toString(),
        startDate: classData.startDate,
      });
    }
  }, [classData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      const updatedClass = await updateClassApi(classData.id, {
        name: formData.name,
        fee: parseFloat(formData.fee),
        startDate: formData.startDate,
      });
      dispatch(updateClass(updatedClass));
      toast.success('Class updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating class:', error);
      toast.error('Failed to update class. Please try again.');
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
        <DialogTitle>Edit Class</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
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
            <Grid item xs={12}>
              <TextField
                label="Class Fee"
                name="fee"
                type="number"
                value={formData.fee}
                onChange={handleChange}
                fullWidth
                error={!!errors.fee}
                helperText={errors.fee}
                required
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
                InputLabelProps={{
                  shrink: true,
                }}
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

export default EditClassDialog;