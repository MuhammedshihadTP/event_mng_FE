import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../api/apiEndpoints';
import API from '../api/api';

const SchedulingResultsPage = () => {
    const { eventId } = useParams();
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [planStartDate, setPlanStartDate] = useState(null);
  const [planEndDate, setPlanEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEventDuration,setTotalEventDuration]=useState(null);
  const fetchScheduledTasks = async (eventId) => {
    try {
      const response = await API.get(API_ENDPOINTS.SCHEDULE.COMPUTE(eventId));
      return response.data;
    } catch (err) {
      console.error('Failed to fetch scheduled tasks:', err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchScheduledTasks(eventId);
        setScheduledTasks(data.scheduledTasks);
        setTotalEventDuration(data.totalEventDuration)
     
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Scheduling Results
        </Typography>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Scheduling Results
      </Typography>
    
      <Typography variant="h6" gutterBottom>
        Total Duration: {(totalEventDuration*24).toFixed(2)} hours
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell>duration</TableCell>
              <TableCell>Sub task Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduledTasks.map((task) => (
              <TableRow key={task.taskId}>
                <TableCell>{task?.description}</TableCell>
                <TableCell>{(task.duration * 24).toFixed(2)}</TableCell>
                <TableCell>{task?.subtaskCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SchedulingResultsPage;