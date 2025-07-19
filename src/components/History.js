import React from 'react';
import { 
  Fade, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Person as UserIcon
} from '@mui/icons-material';

const History = ({ history }) => {
  const theme = useTheme();

  const getRandomColor = (name) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F'
    ];
    return colors[name.length % colors.length];
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: 3,
      p: 2,
      boxShadow: 3,
      height: 'fit-content',
      minHeight: 400
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
        📜 Recent Claims
      </Typography>
      
      {history.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 200,
          color: theme.palette.text.secondary
        }}>
          <TrophyIcon sx={{ fontSize: 40, mb: 2, opacity: 0.5 }} />
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            No claims yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {history.map((item, idx) => (
            <Fade in timeout={400 + (idx * 50)} key={idx}>
              <Card 
                sx={{ 
                  mb: 1.5, 
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-1px)',
                    boxShadow: 4,
                    background: 'rgba(255, 255, 255, 0.95)'
                  }
                }}
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getRandomColor(item.userName),
                          width: 32,
                          height: 32,
                          fontSize: 14
                        }}
                      >
                        <UserIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {item.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {new Date(item.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={`+${item.points}`}
                      color="primary"
                      size="small"
                      sx={{ 
                        fontWeight: 600,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        color: 'white'
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default History; 