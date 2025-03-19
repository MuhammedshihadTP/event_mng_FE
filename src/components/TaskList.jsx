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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskList = ({ tasks, onEdit, onDelete, loggedInUserId }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Duration (hours)</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Timing</TableCell>
            <TableCell>Offset (Days)</TableCell>
            <TableCell>Dependencies</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => {
            const isPrivateTask = task.type === 'private';
            const canModify = !isPrivateTask || task.user === loggedInUserId;

            return (
              <TableRow key={task._id}>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.duration}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.timing}</TableCell>
                <TableCell>{task.offset}</TableCell>
                <TableCell>
                {task.dependencies.length > 0
                    ? task.dependencies.map(dep => dep.task?.description).join(', ')
                    : 'No dependencies'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(task)} disabled={!canModify}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(task._id)} disabled={!canModify}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskList;
