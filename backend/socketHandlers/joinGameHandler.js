const { v4: uuidv4 } = require('uuid');

const handleJoinGame = (io, socket, connectedUsers) => {
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
    console.log('User joined the game:', userData.username);
    io.emit('updateUsers', connectedUsers);

    callback({ success: true, userId });
  });
};

module.exports = { handleJoinGame };
