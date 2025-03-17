import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import API from '../api/api';
import API_ENDPOINTS from '../api/apiEndpoints';

const EventForm = ({ open, onClose, fetchEvents, event }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);


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
  }, []);


  useEffect(() => {
    if (event) {

      formik.setValues({
        name: event?.name,
        description: event?.description,
        date: new Date(event?.date).toISOString().slice(0, 16),
        tasks: event?.tasks?.map((task) => task?.task?._id),
      });


      setSelectedTasks(event?.tasks?.map((task) => task?.task));
    } else {
      formik.resetForm();
      setSelectedTasks([]);
    }
  }, [event]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      date: '',
      tasks: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      date: Yup.string().required('Required'),
      tasks: Yup.array().min(1, 'At least one task is required'),
    }),
    onSubmit: async (values) => {
      try {


        const url = event
          ? API_ENDPOINTS.EVENTS.UPDATE(event?._id)
          : API_ENDPOINTS.EVENTS.CREATE;
        const method = event ? 'put' : 'post';

        await API[method](
          url,
          {
            ...values,
            tasks: selectedTasks?.map((task) => ({
              task: task?._id,
              duration: task?.duration,
              dependencies: task?.dependencies,
            })),
          },
        );
        toast.success(`Event ${event ? 'updated' : 'created'} successfully!`);
        fetchEvents();
        onClose();
      } catch (err) {
        toast.error(err.response?.data?.error || `Failed to ${event ? 'update' : 'create'} event`);
      }
    },
  });

  const handleTaskSelection = (event) => {
    const selectedTaskIds = event.target.value;
    const selectedTasksData = tasks.filter((task) => selectedTaskIds.includes(task?._id));
    setSelectedTasks(selectedTasksData);
    formik.setFieldValue('tasks', selectedTaskIds);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" gutterBottom>
          {event ? 'Edit Event' : 'Create Event'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Event Name"
            name="name"
            value={formik.values?.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
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
            label="Event Date"
            type="datetime-local"
            name="date"
            value={formik.values?.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            InputLabelProps={{
              shrink: true,
            }}
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
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;