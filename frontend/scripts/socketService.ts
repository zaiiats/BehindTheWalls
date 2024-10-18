import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initiateSocketConnection = () => {
  if (!socket) {
    socket = io('http://localhost:4000'); 
    console.log('Socket initialized:', socket.id);
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};