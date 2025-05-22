import { Paper, Box, Typography, BoxProps } from '@mui/material';

interface ContentCardProps extends BoxProps {
  title?: string;
  subtitle?: string;
  noPadding?: boolean;
  titleAction?: React.ReactNode;
}

const ContentCard = ({ 
  title, 
  subtitle, 
  children, 
  noPadding = false,
  titleAction,
  ...props 
}: ContentCardProps) => {
  return (
    <Box {...props}>
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          height: '100%',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 122, 204, 0.12)',
          },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {(title || subtitle) && (
          <Box 
            sx={{ 
              p: 3, 
              pb: subtitle ? 2 : 3,
              pt: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: subtitle ? 0 : '1px solid',
              borderColor: 'divider',
              gap: 2,
            }}
          >
            <Box>
              {title && (
                <Typography variant="h6" fontWeight="600" color="primary.main">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {titleAction && (
              <Box>
                {titleAction}
              </Box>
            )}
          </Box>
        )}
        <Box 
          sx={{ 
            p: noPadding ? 0 : 3,
            pt: (title || subtitle) && !noPadding ? 3 : (noPadding ? 0 : 4),
            pt: (title || subtitle) && !noPadding ? 2 : (noPadding ? 0 : 3),
            flexGrow: 1,
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default ContentCard;