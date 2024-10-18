const { v4: uuidv4 } = require('uuid');
const { generateGameCode } = require('../utils/utils.js');
const { createEnvironment } = require('../utils/createEnvData.js');

const {
  insertGame,
  getGame,
  addUser,
  addEnvData 
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

    console.log(
      `Game created with code: ${game.code} and host: ${game.hostName}`
    );

    await addUser(game.code, game.hostName)

    const envData = JSON.stringify(createEnvironment());
    await addEnvData(game.code, envData)
    //connectedUsers.push(user);
    //io.emit('updateUsers', connectedUsers);
  });
};

module.exports = { handleCreateGame };
