import { Paper, Box, Typography, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sx?: SxProps<Theme>;
}

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconColor = 'primary.main',
  trend,
  sx = {}
}: StatsCardProps) => {
  return (
    <Paper 
      elevation={0} 
      sx={{
        p: 4,
        height: '100%',
        display: 'flex',
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 122, 204, 0.12)',
        },
        ...sx
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          sx={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            my: 2,
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          {value}
        </Typography>
        {(subtitle || trend) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            {trend && (
              <Typography
                variant="body2"
                sx={{
                  color: trend.isPositive ? 'success.main' : 'error.main',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </Typography>
            )}
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: '500' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      {icon && (
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'flex-start',
            color: iconColor,
            fontSize: '2rem',
            ml: 3,
          }}
        >
          {icon}
        </Box>
      )}
    </Paper>
  );
};

export default StatsCard;