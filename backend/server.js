const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // For generating unique user IDs

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8081'],
    methods: ['GET', 'POST'],
  },
});

let connectedUsers = []; // Store connected users

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle new game creation
  socket.on('createGame', (data, callback) => {
    const { userData } = data;
    const userId = uuidv4(); 
    const userSocketId = socket.id;

    const user = {
      userData,
      userId,
      userSocketId,
    };

    connectedUsers.push(user);
    console.log('User created the game:', user);

    callback({ success: true, userId });
  });

  socket.on('joinGame', (data, callback) => {
    const { userData } = data;
    const userId = uuidv4();
    const userSocketId = socket.id;

    const user = {
      userData,
      userId,
      userSocketId,
    };

    connectedUsers.push(user);
    console.log('User joined the game:', user);

    callback({ success: true, userId }); 
  });

  // Handle reconnection attempts
  socket.on('reconnectUser', (data, callback) => {
    const { userId } = data;

    const user = connectedUsers.find((u) => u.userId === userId);
    if (user) {
      // Update the user's socket ID after reconnection
      user.userSocketId = socket.id;
      console.log(
        `User ${user.userData} reconnected with new socket ID: ${socket.id}`
      );
      callback({ success: true });
    } else {
      console.log('Reconnection failed: user not found');
      callback({ success: false });
    }
  });

  // Handle user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    connectedUsers = connectedUsers.filter((u) => u.userSocketId !== socket.id);
    console.log('Remaining users:', connectedUsers);
  });
});

const port = 4000;
server.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
});
