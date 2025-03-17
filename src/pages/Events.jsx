import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button } from '@mui/material';
import EventForm from '../components/EventForm';
import EventList from '../components/EventList';
import { toast } from 'react-toastify';
import API from '../api/api';
import API_ENDPOINTS from '../api/apiEndpoints';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState(null); 


  const fetchEvents = async () => {
    try {
    
       const response = await API.get(API_ENDPOINTS.EVENTS.GET_ALL);
      setEvents(response.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  const handleDelete = async (eventId) => {
    try {
    
       await API.delete(API_ENDPOINTS.EVENTS.DELETE(eventId));
      fetchEvents(); 
      toast.success('Event deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete event');
    }
  };


  const handleEdit = (eventId) => {
    const eventToEdit = events.find((event) => event._id === eventId);
    setSelectedEvent(eventToEdit);
    setOpenModal(true); 
  };


  const handleCreate = () => {
    setSelectedEvent(null); 
    setOpenModal(true); 
  };


  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null); 
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Events
        </Typography>
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mb: 2 }}>
          Create Event
        </Button>
        <EventList
          events={events}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <EventForm
          open={openModal}
          onClose={handleCloseModal}
          fetchEvents={fetchEvents}
          event={selectedEvent} 
        />
      </Box>
    </Container>
  );
};

export default Events;