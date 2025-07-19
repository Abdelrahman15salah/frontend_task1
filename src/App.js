import React from 'react';
import { Container, Typography, Box, Paper, Grid, Fade, CircularProgress } from '@mui/material';
import './App.css';
import UserList from './components/UserList';
import ClaimButton from './components/ClaimButton';
import Leaderboard from './components/Leaderboard';
import History from './components/History';
import { getUsers, addUser, claimPoints, getClaimHistory } from './api';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [adding, setAdding] = useState(false);
  const [lastClaimPoints, setLastClaimPoints] = useState(null);
  const socketRef = useRef(null);

  // Fetch users and history
  const fetchAll = async () => {
    try {
      const [usersData, historyData] = await Promise.all([
        getUsers(),
        getClaimHistory()
      ]);
      setUsers(usersData);
      setHistory(historyData);
    } catch (err) {
      setError(err.message || 'Error loading data');
    }
  };

  useEffect(() => {
    fetchAll();
    socketRef.current = io('http://localhost:3000');
    socketRef.current.on('leaderboardUpdate', () => {
      fetchAll();
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
    // eslint-disable-next-line
  }, []);

  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
    setLastClaimPoints(null);
  };

  const handleAddUser = async (name) => {
    setAdding(true);
    setError('');
    // Optimistically add user
    const tempId = Date.now().toString();
    setUsers((prev) => [...prev, { id: tempId, name, totalPoints: 0 }]);
    try {
      await addUser(name);
      // Let socket event update the real data
    } catch (err) {
      setError(err.message || 'Failed to add user');
      // Revert optimistic update
      setUsers((prev) => prev.filter((u) => u.id !== tempId));
    }
    setAdding(false);
  };

  const handleClaim = async (userId) => {
    setClaiming(true);
    setError('');
    // Optimistically update points
    setUsers((prev) => prev.map((u) =>
      u.id === userId || u._id === userId ? { ...u, totalPoints: (u.totalPoints || 0) + 1 } : u
    ));
    try {
      const res = await claimPoints(userId);
      setLastClaimPoints(res.points);
      // Let socket event update the real data
    } catch (err) {
      setError(err.message || 'Failed to claim points');
      // Revert optimistic update (refetch real data)
      fetchAll();
    }
    setClaiming(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              🏆 Points Leaderboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
              Claim points and compete for the top spot!
            </Typography>
          </Box>
          
          {error && (
            <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
          
          <Grid container spacing={4}>
            <Grid item xs={12} lg={4}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #fff5f5 0%, #f0f9ff 100%)',
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                height: 'fit-content',
                position: { lg: 'sticky' },
                top: { lg: 20 }
              }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                  👤 User Management
                </Typography>
                <UserList
                  users={users}
                  selectedUser={selectedUser}
                  onSelectUser={handleSelectUser}
                  onAddUser={handleAddUser}
                  adding={adding}
                />
                <Box sx={{ mt: 3 }}>
                  <ClaimButton
                    userId={selectedUser}
                    onClaim={handleClaim}
                    disabled={!selectedUser || claiming}
                  />
                  {claiming && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Claiming points...
                      </Typography>
                    </Box>
                  )}
                  <Fade in={lastClaimPoints !== null} timeout={{ enter: 500, exit: 500 }} unmountOnExit>
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'success.light', 
                      color: 'success.contrastText',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" fontWeight={600}>
                        🎉 You claimed {lastClaimPoints} points!
                      </Typography>
                    </Box>
                  </Fade>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <Box sx={{ mb: { xs: 3, md: 0 } }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      🏅 Leaderboard
                    </Typography>
                    <Leaderboard users={users} />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6} lg={6}>
                  <History history={history} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
