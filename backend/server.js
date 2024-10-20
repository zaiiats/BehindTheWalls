const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { handleCreateGame } = require('./socketHandlers/createGameHandler.js');
const { handleJoinGame } = require('./socketHandlers/joinGameHandler.js');
const { handleStartGame } = require('./socketHandlers/startGameHandler.js');
const {
  handleReconnectUser,
} = require('./socketHandlers/reconnectUserHandler.js');

const app = express();
const server = http.createServer(app);
const port = 5000; // Ensure this matches your frontend connection
const io = new Server(server, {
  cors: {
    origin: '*', // Use '*' for testing; restrict later for security
    methods: ['GET', 'POST'],
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  handleCreateGame(io, socket);
  handleJoinGame(io, socket);
  handleStartGame(io, socket);
});

// Start the server
server.listen(port, '0.0.0.0', () => {
  // Bind to all interfaces
  console.log(`Socket.IO server running on port ${port}`);
});
