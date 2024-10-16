const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { handleCreateGame } = require('./socketHandlers/createGameHandler.js');
const { handleJoinGame } = require('./socketHandlers/joinGameHandler.js');
const { handleReconnectUser } = require('./socketHandlers/reconnectUserHandler.js');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8081'],
    methods: ['GET', 'POST'],
  },
});

let connectedUsers = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  handleCreateGame(io, socket, connectedUsers);
  handleJoinGame(io, socket, connectedUsers)
  handleReconnectUser(io, socket, connectedUsers);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    connectedUsers = connectedUsers.filter((u) => u.userSocketId !== socket.id);
    console.log('Remaining users:', connectedUsers);

    io.emit('updateUsers', connectedUsers);
  });
});

const port = 4000;
server.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
});
