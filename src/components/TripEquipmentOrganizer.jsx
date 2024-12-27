import React, { useState, useEffect } from 'react';
import GroupsManager from './GroupsManager';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip, 
  Box,
  Paper,
  IconButton,
  Grid,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Add as PlusIcon,
  Delete as TrashIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  LocalOffer as TagIcon
} from '@mui/icons-material';
import Papa from 'papaparse';

const DEFAULT_GROUPS = [
    { value: 'essentials', label: 'Essentials' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'hygiene', label: 'Hygiene' },
    { value: 'first-aid', label: 'First Aid' },
    { value: 'misc', label: 'Miscellaneous' }
  ];

  const EditItemDialog = ({ open, onClose, item, onSave, groups }) => {
    const [editedItem, setEditedItem] = useState(null);
  
    useEffect(() => {
      if (item) {
        setEditedItem(item);
      }
    }, [item]);
  
    const handleSave = () => {
      if (editedItem) {
        onSave(editedItem);
        onClose();
      }
    };
  
    const statuses = [
      { value: 'needed', label: 'Needed' },
      { value: 'packed', label: 'Packed' },
      { value: 'optional', label: 'Optional' }
    ];
  
    const priorities = [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ];
  
    if (!editedItem) return null;
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Item Name"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={editedItem.weight}
              onChange={(e) => setEditedItem({ ...editedItem, weight: Math.max(0, parseFloat(e.target.value) || 0) })}
              required
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              inputProps={{ min: 1 }}
              value={editedItem.quantity}
              onChange={(e) => setEditedItem({ ...editedItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
            />
            <FormControl fullWidth>
              <InputLabel>Group</InputLabel>
              <Select
                value={editedItem.group}
                onChange={(e) => setEditedItem({ ...editedItem, group: e.target.value })}
                label="Group"
              >
                {groups.map(group => (
                  <MenuItem key={group.value} value={group.value}>
                    {group.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Rest of the dialog content remains the same */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={!editedItem.name.trim() || editedItem.weight < 0}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const TripEquipmentOrganizer = ({ items: initialItems = [], onSave, list }) => {
  const [newItem, setNewItem] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('essentials');
  const [selectedStatus, setSelectedStatus] = useState('needed');
  const [totalWeight, setTotalWeight] = useState(0);
  const [itemWeight, setItemWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('group');
  const [draggedItem, setDraggedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [items, setItems] = useState(Array.isArray(initialItems) ? initialItems : []);

  const groups = [
    { value: 'essentials', label: 'Essentials' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'hygiene', label: 'Hygiene' },
    { value: 'first-aid', label: 'First Aid' },
    { value: 'misc', label: 'Miscellaneous' }
  ];

  const statuses = [
    { value: 'needed', label: 'Needed' },
    { value: 'packed', label: 'Packed' },
    { value: 'optional', label: 'Optional' }
  ];

  const priorities = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  useEffect(() => {
    calculateTotalWeight();
  }, [items]);

  const calculateTotalWeight = () => {
    const total = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    setTotalWeight(total);
  };

  const addItem = () => {
    if (newItem.trim() && !isNaN(parseFloat(itemWeight)) && parseFloat(itemWeight) >= 0) {
      const weight = parseFloat(itemWeight);
      const qty = Math.max(1, parseInt(quantity) || 1);
      
      const newItemData = {
        id: Date.now(),
        name: newItem.trim(),
        group: selectedGroup,
        status: selectedStatus,
        weight: weight,
        quantity: qty,
        priority,
        notes: notes.trim(),
        order: items.length
      };
      
      const newItems = [...items, newItemData];
      
      // Create updated list with new items
      const updatedList = {
        ...list,
        items: newItems
      };
      
      setItems(newItems);
      onSave(updatedList);
      resetForm();
      
      setSnackbar({
        open: true,
        message: `${newItem} has been added to your list`,
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Please enter a valid item name and weight',
        severity: 'error'
      });
    }
  };

  const resetForm = () => {
    setNewItem('');
    setItemWeight(0);
    setQuantity(1);
    setPriority('medium');
    setNotes('');
  };

  const removeItem = (id) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    onSave(newItems);
    
    setSnackbar({
      open: true,
      message: 'Item has been removed',
      severity: 'warning'
    });
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newItems = [...items];
    const draggedIndex = items.findIndex(i => i.id === draggedItem.id);
    const targetIndex = items.findIndex(i => i.id === targetItem.id);

    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems.map((item, index) => ({ ...item, order: index })));
  };

  const exportToCSV = () => {
    const data = items.map(item => ({
      Name: item.name,
      Group: groups.find(g => g.value === item.group)?.label,
      Status: item.status,
      Weight: item.weight,
      Quantity: item.quantity,
      'Total Weight': item.weight * item.quantity,
      Priority: item.priority,
      Notes: item.notes
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'packing_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "List Exported",
      description: "Your packing list has been exported as CSV.",
    });
  };

  const shareList = () => {
    const shareData = {
      title: 'Trip Equipment List',
      text: JSON.stringify(items),
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(JSON.stringify(items, null, 2));
      alert('List copied to clipboard!');
    }
  };

  const getSortedAndFilteredItems = () => {
    // Ensure we're working with an array
    const currentItems = Array.isArray(items) ? items : [];
    
    let filteredItems = currentItems.filter(item => {
        const groupMatch = filterGroup === 'all' || item.group === filterGroup;
        const statusMatch = filterStatus === 'all' || item.status === filterStatus;
        return groupMatch && statusMatch;
    });

    return filteredItems.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'priority':
                return priorities.findIndex(p => p.value === b.priority) - 
                       priorities.findIndex(p => p.value === a.priority);
            case 'weight':
                return (b.weight * b.quantity) - (a.weight * a.quantity);
            case 'order':
                return a.order - b.order;
            default:
                return a.group.localeCompare(b.group);
        }
    });
};

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'primary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'packed':
        return 'success';
      case 'needed':
        return 'warning';
      case 'optional':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = (updatedItem) => {
    const newItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(newItems);
    onSave(newItems);
    setSnackbar({
      open: true,
      message: 'Item updated successfully',
      severity: 'success'
    });
  };
  

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Add New Item</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip 
                label={`Total Weight: ${totalWeight.toFixed(2)} kg`}
                color="primary"
                variant="outlined"
              />
              <Button 
                startIcon={<DownloadIcon />}
                variant="outlined"
                size="small"
                onClick={exportToCSV}
              >
                Export
              </Button>
              <Button
                startIcon={<ShareIcon />}
                variant="outlined"
                size="small"
                onClick={shareList}
              >
                Share
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={itemWeight}
                onChange={(e) => setItemWeight(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
            <GroupsManager
            groups={list?.groups || DEFAULT_GROUPS}
            selectedGroup={selectedGroup}
            onGroupChange={(newGroup) => setSelectedGroup(newGroup)}
            onGroupsUpdate={(updatedGroups) => {
                // Create updated list with new groups
                const updatedList = {
                ...list,
                groups: updatedGroups,
                items: list.items  // Make sure to keep the items
                };
                
                // Call the parent's onSave with the entire updated list
                onSave(updatedList);
            }}
            />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                >
                  {statuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  label="Priority"
                >
                  {priorities.map(p => (
                    <MenuItem key={p.value} value={p.value}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PlusIcon />}
                onClick={addItem}
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filter Group</InputLabel>
            <Select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                label="Filter Group"
            >
                <MenuItem value="all">All Groups</MenuItem>
                {(list?.groups || DEFAULT_GROUPS).map(group => (
                <MenuItem key={group.value} value={group.value}>
                    {group.label}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Filter Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {statuses.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="group">Group</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="weight">Weight</MenuItem>
                <MenuItem value="order">Custom Order</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {Object.entries(
            getSortedAndFilteredItems().reduce((acc, item) => {
              if (!acc[item.group]) {
                acc[item.group] = [];
              }
              acc[item.group].push(item);
              return acc;
            }, {})
          ).map(([group, groupItems]) => (
            <Paper key={group} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TagIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                {(list?.groups || DEFAULT_GROUPS).find(g => g.value === group)?.label}
                </Typography>
                <Chip 
                  label={`${groupItems.length} items`}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
              
              {groupItems.map(item => (
  <Paper
    key={item.id}
    elevation={1}
    sx={{ p: 2, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}
    draggable
    onDragStart={(e) => handleDragStart(e, item)}
    onDragEnd={handleDragEnd}
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, item)}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="subtitle1">
          {item.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip 
            label={`${item.weight} kg × ${item.quantity}`}
            size="small"
            variant="outlined"
          />
          <Chip 
            label={item.priority}
            size="small"
            color={getPriorityColor(item.priority)}
          />
          <Chip 
            label={item.status}
            size="small"
            color={getStatusColor(item.status)}
          />
        </Box>
        {item.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item.notes}
          </Typography>
        )}
      </Box>
      {/* Replace this entire Box with the new code: */}
      <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton
            size="small"
            onClick={() => handleEditItem(item)}
        >
            <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            const newItems = items.map(i => 
              i.id === item.id
                ? { ...i, status: i.status === 'packed' ? 'needed' : 'packed' }
                : i
            );
            setItems(newItems);
            onSave(newItems);
          }}
        >
          {item.status === 'packed' ? 
            <XCircleIcon /> : 
            <CheckCircleIcon />
          }
        </IconButton>
        <IconButton
          size="small"
          onClick={() => removeItem(item.id)}
          color="error"
        >
          <TrashIcon />
        </IconButton>
      </Box>
      {/* Replace the above Box with your new code */}
    </Box>
  </Paper>
))}
            </Paper>
          ))}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <EditItemDialog
      open={editDialogOpen}
      onClose={() => {
        setEditDialogOpen(false);
        setEditingItem(null);
      }}
      item={editingItem}
      onSave={handleSaveEdit}
      groups={list.groups}
    />
    </Box>
    
  );
};

export default TripEquipmentOrganizer;