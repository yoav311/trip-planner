import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { listService } from '../services/listService';
import TripEquipmentOrganizer from '../components/TripEquipmentOrganizer';

// In ListDetail.jsx
const ListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);

  useEffect(() => {
    const loadedList = listService.getList(id);
    if (!loadedList) {
      navigate('/');
      return;
    }
    setList(loadedList);
  }, [id, navigate]);

  const handleSave = (updatedItemsOrList) => {
    let updatedList;
    
    // Check if we're receiving items or the whole list
    if (Array.isArray(updatedItemsOrList)) {
        // If it's an array, it's items
        updatedList = {
            ...list,
            items: updatedItemsOrList
        };
    } else {
        // If it's an object, it's the whole list
        updatedList = updatedItemsOrList;
    }
    
    listService.saveList(updatedList);
    setList(updatedList);
};

  // Add this new handler
  const handleListUpdate = (updatedList) => {
    listService.saveList(updatedList);
    setList(updatedList);
  };

  if (!list) {
    return null;
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Lists
        </Button>
        <Typography variant="h4" component="h1" sx={{ color: 'black' }}>
          {list.name}
        </Typography>
      </Box>

      <TripEquipmentOrganizer
        items={list.items}
        onSave={handleSave}
        list={list}  // Add this prop
      />
    </Container>
  );
};

export default ListDetail;