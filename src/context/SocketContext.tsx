import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  dashboardData: any;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  dashboardData: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Create socket connection with consistent configuration
    const socketInstance = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      forceNew: true,
      timeout: 20000
    });

    // Socket event handlers
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      socketInstance.emit('getTrafficStats');
      socketInstance.emit('getSystemStats');
      socketInstance.emit('getActiveConnections');
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('dashboardData', (data) => {
      setDashboardData(data);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      // Attempt to reconnect with polling if WebSocket fails
      if (socketInstance.io.opts.transports.includes('websocket')) {
        console.log('Falling back to polling transport');
        socketInstance.io.opts.transports = ['polling'];
      }
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, dashboardData }}>
      {children}
    </SocketContext.Provider>
  );
};