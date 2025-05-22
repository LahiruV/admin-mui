import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar, { drawerWidth, miniDrawerWidth } from './Sidebar';
import Header from './Header';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleDrawerToggle}
        isMobile={isMobile}
      />
      <Box 
        component="main" 
        sx={{ 
          marginLeft: { xs: 0, md: sidebarOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px` },
          flexGrow: 1, 
          p: 3, 
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }), 
        }}
      >
        <Header 
          onMenuClick={handleDrawerToggle} 
          sidebarOpen={sidebarOpen}
        />
        <Box sx={{ mt: 10, px: { xs: 1, sm: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;