import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinCampaign = (campaignId) => {
    if (socket && campaignId) {
      socket.emit('join-campaign', campaignId);
    }
  };

  const leaveCampaign = (campaignId) => {
    if (socket && campaignId) {
      socket.emit('leave-campaign', campaignId);
    }
  };

  const emitDiceRoll = (campaignId, roll) => {
    if (socket && campaignId) {
      socket.emit('dice-roll', { campaignId, roll });
    }
  };

  const value = {
    socket,
    connected,
    joinCampaign,
    leaveCampaign,
    emitDiceRoll
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
