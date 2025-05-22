import { Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  breadcrumbs: { name: string; link?: string }[];
}

const PageHeader = ({ title, breadcrumbs }: PageHeaderProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 1 }}
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography key={breadcrumb.name} color="text.primary">
              {breadcrumb.name}
            </Typography>
          ) : (
            <Link
              key={breadcrumb.name}
              component={RouterLink}
              to={breadcrumb.link || '#'}
              underline="hover"
              color="inherit"
            >
              {breadcrumb.name}
            </Link>
          );
        })}
      </Breadcrumbs>
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight="bold"
        sx={{ 
          color: 'text.primary',
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default PageHeader;