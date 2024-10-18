import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initiateSocketConnection = () => {
  if (!socket) {
    socket = io('http://localhost:4000');

    socket.on('connect', () => {
      console.log('Socket connected successfully with ID:', socket!.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  } else {
    console.log('Socket already initialized');
  }

  return socket;
};

export const getSocket = () => {
  return socket;
};
