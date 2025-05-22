import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Divider,
  useTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  AssignmentTurnedIn as AssignmentIcon,
} from '@mui/icons-material';
import { GraduationCap } from 'lucide-react';

export const drawerWidth = 240;
export const miniDrawerWidth = 72;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Create Student', path: '/create-student', icon: <PersonIcon /> },
  { text: 'Create Class', path: '/create-class', icon: <SchoolIcon /> },
  { text: 'Add Monthly Fee', path: '/add-monthly-fee', icon: <AssignmentIcon /> },
  { text: 'Payment Management', path: '/payment-management', icon: <PaymentIcon /> },
];

const Sidebar = ({ open, onClose, isMobile }: SidebarProps) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawer = (
    <>
      <Toolbar sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingY: 2,
        minHeight: 64,
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: open ? 1 : 0,
          justifyContent: 'center',
          width: '100%',
        }}>
          <GraduationCap size={32} color={theme.palette.primary.main} />
          <Typography 
            variant="subtitle1" 
            component="div" 
            fontWeight="bold"
            sx={{
              width: open ? 'auto' : 0,
              overflow: 'hidden',
              transition: theme.transitions.create(['width', 'opacity'], {
                duration: theme.transitions.duration.shortest,
              }),
              opacity: open ? 1 : 0,
            }}
          >
            ClassManager
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ mt: 2, px: 1.5 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: '8px',
                mb: 1,
                px: open ? 2 : 1.5,
                justifyContent: open ? 'initial' : 'center',
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light + '20',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light + '30',
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  }
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                minHeight: 48,
                transition: theme.transitions.create(['padding', 'min-width'], {
                  duration: theme.transitions.duration.shortest,
                })
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: open ? 40 : 'auto',
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  transition: theme.transitions.create(['margin-right', 'min-width'], {
                    duration: theme.transitions.duration.shortest,
                  }),
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  },
                  opacity: {
                    sm: open ? 1 : 0
                  },
                  transition: theme.transitions.create('opacity', {
                    duration: theme.transitions.duration.shortest,
                  }),
                  display: open ? 'block' : 'none',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: open ? drawerWidth : miniDrawerWidth },
        flexShrink: { md: 0 },
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        transition: theme.transitions.create('width', {
          duration: theme.transitions.duration.shortest,
        }),
      }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              position: 'fixed',
              width: drawerWidth,
              borderRadius: 0
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              position: 'fixed',
              width: open ? drawerWidth : miniDrawerWidth,
              borderRadius: 0,
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.shortest,
              }),
            },
            '& .MuiPaper-root': {
              position: 'fixed',
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              height: '100vh',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;