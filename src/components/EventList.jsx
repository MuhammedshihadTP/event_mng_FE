import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const EventList = ({ events, onDelete, onEdit }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Event Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Tasks</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events?.map((event) => (
            <TableRow key={event?._id}>
              <TableCell>
                <Link component={RouterLink} to={`/schedule/${event._id}`}>
                  {event.name}
                </Link>
              </TableCell>
              <TableCell>{event?.description}</TableCell>
              <TableCell>{new Date(event?.date).toLocaleString()}</TableCell>
              <TableCell>
                {event.tasks.length > 0
                  ? event.tasks.map((task) => task?.task?.description).join(', ')
                  : 'No tasks'}
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label="edit"
                  onClick={() => onEdit(event?._id)} 
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete(event?._id)} 
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventList;