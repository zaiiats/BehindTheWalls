const { v4: uuidv4 } = require('uuid');

const handleReconnectUser = (io, socket, connectedUsers) => {
  socket.on('reconnectUser', (data, callback) => {
    const { userId } = data;

    const user = connectedUsers.find((u) => u.userId === userId);
    if (user) {
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
}

module.exports = { handleReconnectUser };