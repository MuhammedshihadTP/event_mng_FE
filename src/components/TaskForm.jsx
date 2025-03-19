import React , { useState, useEffect } from 'react';
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
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import API_ENDPOINTS from '../api/apiEndpoints';
import API from '../api/api';

const TaskForm = ({ open, onClose, fetchTasks, initialValues }) => {
  console.log(initialValues,"1223");

   const [selectedTasks, setSelectedTasks] = useState([]);
   const [tasks, setTasks] = useState([]);

   const formik = useFormik({
    enableReinitialize: true,  
    initialValues: {
      description: initialValues?.description || '',
      duration: initialValues?.duration || '',
      type: initialValues?.type || 'private',
      dependencies: initialValues?.dependencies || [],
      timing: initialValues?.timing || 'before',
      offset: initialValues?.offset || 0,
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Required'),
      duration: Yup.number().required('Required').positive('Must be positive'),
      type: Yup.string().required('Required'),
      timing: Yup.string().required('Required').oneOf(['before', 'after'], 'Invalid timing'),
      offset: Yup.number().required('Required').min(0, 'Offset must be positive'),
    }),
    onSubmit: async (values) => {
      console.log(values, "Form Submitted");
      try {
        const url = initialValues?._id
          ? API_ENDPOINTS.TASKS.UPDATE(initialValues._id)
          : API_ENDPOINTS.TASKS.CREATE;
        const method = initialValues?._id ? 'put' : 'post';
  
        const payload = { ...values };
        if (values.dependencies?.length > 0) {
          payload.dependencies = values.dependencies;
        } else {
          delete payload.dependencies; 
        }
  
        await API[method](url, payload);
        toast.success(`Task ${initialValues?._id ? 'updated' : 'created'} successfully!`);
        fetchTasks();
        onClose();
      } catch (err) {
        toast.error(err.response?.data?.error || `Failed to ${initialValues?._id ? 'update' : 'create'} task`);
      }
    }
  });
  

    useEffect(() => {
      const fetchTasks = async () => {
        try {
  
          const response = await API.get(API_ENDPOINTS.TASKS.GET_ALL);
          setTasks(response.data);
        } catch (err) {
          toast.error(err.response?.data?.error || 'Failed to fetch tasks');
        }
      };
      fetchTasks();
    }, [initialValues]);

  const handleTaskSelection = (event) => {
    const selectedTaskIds = event.target.value;
    const selectedTasksData = tasks.filter((task) => selectedTaskIds.includes(task?._id));
    setSelectedTasks(selectedTasksData);
    formik.setFieldValue('dependencies', selectedTaskIds);
  };
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
            label="Offset (days )"
            type="number"
            name="offset"
            value={formik.values?.offset}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.offset && Boolean(formik.errors.offset)}
            helperText={formik.touched.offset && formik.errors.offset}
          />

          <FormControl fullWidth margin="normal">
                      <InputLabel>Tasks</InputLabel>
                      <Select
                        multiple
                        name="tasks"
                        value={selectedTasks?.map((task) => task?._id)}
                        onChange={handleTaskSelection}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected?.map((taskId) => {
                              const task = tasks?.find((t) => t?._id === taskId);
                              return <Chip key={taskId} label={task?.description} />;
                            })}
                          </Box>
                        )}
                      >
                        {tasks?.map((task) => (
                          <MenuItem key={task?._id} value={task?._id}>
                            {task?.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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