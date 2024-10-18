const { v4: uuidv4 } = require('uuid');
const { generateGameCode } = require('../utils/utils.js');

const {
  insertGame,
  getGame,
} = require('../supabase.js');

const handleCreateGame = (io, socket) => {
  socket.on('createGame', async (data) => {
    let gameCode = generateGameCode(); 
    const { userData } = data;
    const userId = uuidv4();
    const userSocketId = socket.id;

    const user = {
      userData,
      userId,
      userSocketId,
    };

    while (await getGame(gameCode)) {
      gameCode = generateGameCode(); 
    }

    const game = {
      code: gameCode,
      hostName: userData.username,
    };


    await insertGame(game);

    socket.emit('joinSuccess', {
      message: 'You successfully joined the game!',
      gameData,
    });

    console.log(
      `Game created with code: ${game.code} and host: ${game.hostName}`
    );

    //connectedUsers.push(user);
    //io.emit('updateUsers', connectedUsers);
  });
};

module.exports = { handleCreateGame };
