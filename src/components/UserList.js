import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import { PersonAdd as AddIcon, Person as UserIcon } from '@mui/icons-material';

const UserList = ({ users, selectedUser, onSelectUser, onAddUser, adding }) => {
  const [newUser, setNewUser] = React.useState('');

  const handleAddUser = () => {
    if (newUser.trim()) {
      onAddUser(newUser.trim());
      setNewUser('');
    }
  };

  const getSelectedUser = () => {
    return users.find(user => (user._id || user.id) === selectedUser);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="user-select-label">Select a User</InputLabel>
        <Select
          labelId="user-select-label"
          value={selectedUser || ''}
          label="Select a User"
          onChange={e => onSelectUser(e.target.value)}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          {users.map(user => (
            <MenuItem key={user._id || user.id} value={user._id || user.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.totalPoints || 0} points
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedUser && getSelectedUser() && (
        <Box sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ width: 48, height: 48, fontSize: 20 }}>
            {getSelectedUser().name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {getSelectedUser().name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Current Points: {getSelectedUser().totalPoints || 0}
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon fontSize="small" />
          Add New User
        </Typography>
        <Box display="flex" gap={1}>
          <TextField
            label="User Name"
            value={newUser}
            onChange={e => setNewUser(e.target.value)}
            size="small"
            fullWidth
            placeholder="Enter user name..."
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={!newUser.trim() || adding}
            startIcon={<AddIcon />}
            sx={{ minWidth: 100 }}
          >
            {adding ? 'Adding...' : 'Add'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserList; 