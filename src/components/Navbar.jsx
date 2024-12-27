import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Backpack } from 'lucide-react';

const DRAWER_WIDTH = 280;

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'My Lists', icon: <HomeIcon /> },
    { path: '/create', label: 'Create New List', icon: <AddIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.02)'
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        {/* Logo Section */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Backpack size={32} color="#2196f3" />
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: '1.5rem'
            }}
          >
            Trip Planner
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, mb: 2 }} />

        {/* Navigation Links */}
        <List sx={{ px: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mx: 2, my: 2 }} />

        {/* Settings Section */}
        <List sx={{ px: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                borderRadius: 2,
                color: 'text.secondary',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Settings"
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Navbar;