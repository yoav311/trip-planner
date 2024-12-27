import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ListDetail from './pages/ListDetail';
import CreateList from './pages/CreateList';

const DRAWER_WIDTH = 280;

// Create a custom theme
const theme = createTheme({
  // ... rest of your theme configuration
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
          position: 'relative'
        }}>
          {/* Fixed width sidebar */}
          <Box sx={{ 
            width: DRAWER_WIDTH,
            flexShrink: 0,
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 1200
          }}>
            <Navbar />
          </Box>

          {/* Main content area with fixed left margin */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minHeight: '100vh',
              ml: `${DRAWER_WIDTH}px`,
              width: `calc(100% - ${DRAWER_WIDTH}px)`,
              position: 'relative'
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/list/:id" element={<ListDetail />} />
              <Route path="/create" element={<CreateList />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;