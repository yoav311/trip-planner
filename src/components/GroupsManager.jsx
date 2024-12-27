import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const GroupsManager = ({ groups, selectedGroup, onGroupChange, onGroupsUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      const value = newGroupName.toLowerCase().replace(/\s+/g, '-');
      const newGroup = {
        value,
        label: newGroupName.trim()
      };
      const updatedGroups = [...groups, newGroup];
      onGroupsUpdate(updatedGroups);
      setNewGroupName('');
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setNewGroupName(group.label);
  };

  const handleUpdateGroup = () => {
    if (newGroupName.trim() && editingGroup) {
      const updatedGroups = groups.map(g => {
        if (g.value === editingGroup.value) {
          return {
            ...g,
            label: newGroupName.trim()
          };
        }
        return g;
      });
      onGroupsUpdate(updatedGroups);
      setEditingGroup(null);
      setNewGroupName('');
    }
  };

  const handleDeleteGroup = (groupToDelete) => {
    const updatedGroups = groups.filter(g => g.value !== groupToDelete.value);
    onGroupsUpdate(updatedGroups);
    if (selectedGroup === groupToDelete.value) {
      onGroupChange(updatedGroups[0]?.value || '');
    }
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Group</InputLabel>
        <Select
          value={selectedGroup}
          onChange={(e) => onGroupChange(e.target.value)}
          label="Group"
        >
          {groups.map(group => (
            <MenuItem key={group.value} value={group.value}>
              {group.label}
            </MenuItem>
          ))}
        </Select>
        <IconButton 
          size="small" 
          onClick={() => setIsDialogOpen(true)}
          sx={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)' }}
        >
          <SettingsIcon />
        </IconButton>
      </FormControl>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Groups</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <TextField
              fullWidth
              label={editingGroup ? "Edit Group Name" : "New Group Name"}
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              size="small"
            />
            <Button
              onClick={editingGroup ? handleUpdateGroup : handleAddGroup}
              variant="contained"
              sx={{ mt: 1 }}
              fullWidth
            >
              {editingGroup ? "Update Group" : "Add New Group"}
            </Button>
          </Box>
          <List>
            {groups.map(group => (
              <ListItem key={group.value}>
                <ListItemText primary={group.label} />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleEditGroup(group)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeleteGroup(group)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupsManager;