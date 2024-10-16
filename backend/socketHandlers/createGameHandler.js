const { v4: uuidv4 } = require('uuid');
const { generateGameCode } = require('..//utils/utils.js');

const handleCreateGame = (io, socket, connectedUsers) => {
  socket.on('createGame', (data, callback) => {
    const gameCode = generateGameCode();
    const { userData } = data;
    const userId = uuidv4();
    const userSocketId = socket.id;

    const user = {
      userData,
      userId,
      userSocketId,
    };

    const game = {
      code: gameCode,
      hostName: userData.username,
    };

    connectedUsers.push(user);
    io.emit('updateUsers', connectedUsers);

    console.log(
      `Game created with code: ${game.code} and host: ${game.hostName}`
    );
    callback({ success: true, userId });
  });
};

module.exports = { handleCreateGame };
