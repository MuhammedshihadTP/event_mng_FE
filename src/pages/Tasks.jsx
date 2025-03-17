import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button } from '@mui/material';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { toast } from 'react-toastify';
import API from '../api/api';
import API_ENDPOINTS from '../api/apiEndpoints';
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [openForm, setOpenForm] = useState(false); 
  const [selectedTask, setSelectedTask] = useState(null); 
  const [user, setUser] = useState(null); 
 
  useEffect(() => {
    fetchUser(); 
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
    
      const response = await API.get(API_ENDPOINTS.TASKS.GET_ALL);
      
      setTasks(response.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch tasks');
    }
  };

  const fetchUser = async () => {
    try {
      console.log("Fetching user...")
      const response = await API.get(API_ENDPOINTS.AUTHENTICATION.GET_ME);
      console.log("User response:", response); 
      setUser(response.data);
    } catch (err) {
      toast.error('Failed to fetch user');
    }
  };

  const handleCreate = () => {
    setSelectedTask(null); 
    setOpenForm(true); 
  };

  const handleEdit = (task) => {
    setSelectedTask(task); 
    setOpenForm(true); 
  };

  const handleDelete = async (taskId) => {
    try {
      await API.delete(API_ENDPOINTS.TASKS.DELETE(taskId));
      toast.success('Task deleted successfully!');
      fetchTasks(); 
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false); 
    setSelectedTask(null); 
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Tasks
        </Typography>
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mb: 2 }}>
          Create Task
        </Button>
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete} 
          loggedInUserId={user?._id}
        />
        <TaskForm
          open={openForm}
          onClose={handleCloseForm}
          fetchTasks={fetchTasks}
          initialValues={selectedTask}
        />
      </Box>
    </Container>
  );
};

export default Tasks;