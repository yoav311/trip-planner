import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Divider,
  Badge,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Inventory as InventoryIcon,
  CheckCircleOutline as CheckedIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { listService } from '../services/listService';
import { format } from 'date-fns';

const HomePage = () => {
  const [lists, setLists] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = () => {
    const allLists = listService.getAllLists();
    setLists(allLists);
  };

  const handleMenuOpen = (event, list) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedList(list);
  };

  const handleMenuClose = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setMenuAnchor(null);
    setSelectedList(null);
  };

  const handleDelete = (event) => {
    if (selectedList) {
      event.preventDefault();
      event.stopPropagation();
      listService.deleteList(selectedList.id);
      loadLists();
      handleMenuClose();
    }
  };

  const handleDuplicate = (event) => {
    if (selectedList) {
      event.preventDefault();
      event.stopPropagation();
      listService.duplicateList(selectedList.id);
      loadLists();
      handleMenuClose();
    }
  };

  const getListStats = (list) => {
    const totalItems = list.items?.length || 0;
    const packedItems = list.items?.filter(item => item.status === 'packed').length || 0;
    const progress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;
    return { totalItems, packedItems, progress };
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '800px', // Force minimum width
        maxWidth: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Header Section */}
      <Box 
        sx={{ 
          flexShrink: 0,
          width: '100%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Box
          sx={{
            pt: 4,
            pb: 6,
            px: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
          }}>
            <Box>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  mb: 1,
                  fontWeight: 800,
                  letterSpacing: '-0.5px'
                }}
              >
                My Trip Lists
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 'normal',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                Organize your travel essentials
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/create"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                },
                py: 1.5,
                px: 3,
                borderRadius: 2,
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Create New List
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Box 
        sx={{ 
          flexGrow: 1,
          width: '100%',
          px: 4,
          pb: 4,
          position: 'relative',
          marginTop: '-24px', // Overlap with header
        }}
      >
        {lists.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3,
              bgcolor: 'background.paper',
              borderRadius: 4,
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid rgba(0,0,0,0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              No Lists Yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Start planning your trip by creating your first packing list. Stay organized and never forget essential items!
            </Typography>
            <Button
              component={Link}
              to="/create"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{ 
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Create Your First List
            </Button>
          </Paper>
        ) : (
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '100%',
            }}
          >
            <Grid 
              container 
              spacing={3}
              sx={{
                width: '100%',
                m: 0,
              }}
            >
              {lists.map(list => {
                const { totalItems, packedItems, progress } = getListStats(list);
                return (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    lg={4} 
                    xl={3} 
                    key={list.id}
                    sx={{
                      width: '100%',
                    }}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 3,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
                        },
                        border: '1px solid rgba(0,0,0,0.05)',
                        background: 'linear-gradient(180deg, #fff 0%, #f8f9fa 100%)'
                      }}
                    >
                      <CardContent sx={{ p: 3, position: 'relative' }}>
                        <IconButton 
                          size="small"
                          onClick={(e) => handleMenuOpen(e, list)}
                          sx={{ 
                            position: 'absolute',
                            right: 12,
                            top: 12,
                            zIndex: 2,
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.04)'
                            }
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>

                        <Box
                          component={Link}
                          to={`/list/${list.id}`}
                          sx={{ 
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'block'
                          }}
                        >
                          <Box sx={{ pr: 4 }}>
                            <Typography 
                              variant="h6" 
                              component="h2" 
                              noWrap
                              sx={{ fontWeight: 600 }}
                            >
                              {list.name}
                            </Typography>
                          </Box>

                          {list.description && (
                            <Typography 
                              color="text.secondary" 
                              sx={{ 
                                mb: 2,
                                mt: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '40px'
                              }}
                            >
                              {list.description}
                            </Typography>
                          )}

                          <Box sx={{ mb: 2 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={progress} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: 'rgba(0,0,0,0.04)',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)',
                                  backgroundSize: '1rem 1rem',
                                  animation: 'progress-stripes 1s linear infinite',
                                }
                              }}
                            />
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              mt: 1,
                              alignItems: 'center'
                            }}>
                              <Typography variant="body2" color="text.secondary">
                                Packing Progress
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: progress === 100 ? 'success.main' : 'text.secondary',
                                  fontWeight: 600
                                }}
                              >
                                {Math.round(progress)}%
                              </Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Tooltip title="Total Items">
                                <Badge 
                                  badgeContent={totalItems} 
                                  color="primary"
                                  sx={{ 
                                    '& .MuiBadge-badge': { 
                                      fontSize: '0.8rem',
                                      fontWeight: 600
                                    }
                                  }}
                                >
                                  <InventoryIcon color="action" />
                                </Badge>
                              </Tooltip>
                              <Tooltip title="Packed Items">
                                <Badge 
                                  badgeContent={packedItems} 
                                  color="success"
                                  sx={{ 
                                    '& .MuiBadge-badge': { 
                                      fontSize: '0.8rem',
                                      fontWeight: 600
                                    }
                                  }}
                                >
                                  <CheckedIcon color="action" />
                                </Badge>
                              </Tooltip>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              color: 'text.secondary'
                            }}>
                              <CalendarIcon fontSize="small" />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                  opacity: 0.8
                                }}
                              >
                                {format(new Date(list.createdAt), 'MMM d, yyyy')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        elevation={3}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)'
          }
        }}
      >
        <MenuItem 
          onClick={handleDuplicate}
          sx={{
            py: 1.5,
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <CopyIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Duplicate
        </MenuItem>
        <MenuItem 
          onClick={handleDelete} 
          sx={{
            color: 'error.main',
            py: 1.5,
            '&:hover': {
              bgcolor: 'error.lighter'
            }
          }}
        >
          <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Add keyframes for progress bar animation */}
      <style>
        {`
          @keyframes progress-stripes {
            0% {background-position: 0 0;
          }
          100% {
            background-position: 1rem 0;
          }
        }
        `}
      </style>
    </Box>
  );
};

export default HomePage;