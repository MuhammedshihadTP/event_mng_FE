import React from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import API_ENDPOINTS from '../api/apiEndpoints';
import API from '../api/api';

const TaskForm = ({ open, onClose, fetchTasks, initialValues }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      description: '',
      duration: '',
      type: 'private',
      dependencies: [],
      timing: 'before',
      offset: 0,
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Required'),
      duration: Yup.number().required('Required').positive('Must be positive'),
      type: Yup.string().required('Required'),
      timing: Yup.string().required('Required').oneOf(['before', 'after'], 'Invalid timing'),
      offset: Yup.number().required('Required').min(0, 'Offset must be positive'),
    }),
    onSubmit: async (values) => {
      try {
       

        const url = initialValues?._id
        ? API_ENDPOINTS.TASKS.UPDATE(initialValues?._id)
        : API_ENDPOINTS.TASKS.CREATE;
      const method = initialValues?._id ? 'put' : 'post';

        await API[method](
          url,
          {
            ...values,
            dependencies: values.dependencies || [],
          },
        
        );
        toast.success(`Task ${initialValues?._id ? 'updated' : 'created'} successfully!`);
        fetchTasks();
        onClose();
      } catch (err) {
        toast.error(err.response?.data?.error || `Failed to ${initialValues?._id ? 'update' : 'create'} task`);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialValues?._id ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formik.values?.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Duration (hours)"
            type="number"
            name="duration"
            value={formik.values?.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched?.duration && Boolean(formik.errors?.duration)}
            helperText={formik.touched.duration && formik.errors.duration}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="global">Global</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Timing</InputLabel>
            <Select
              name="timing"
              value={formik.values?.timing}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.timing && Boolean(formik.errors.timing)}
            >
              <MenuItem value="before">Before</MenuItem>
              <MenuItem value="after">After</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Offset (days or hours)"
            type="number"
            name="offset"
            value={formik.values?.offset}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.offset && Boolean(formik.errors.offset)}
            helperText={formik.touched.offset && formik.errors.offset}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={formik.handleSubmit} variant="contained" color="primary">
          {initialValues?._id ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;