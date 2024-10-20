const { v4: uuidv4 } = require('uuid');
const { getGame, addUser, getUser, getUsers, getSocket} = require('../supabase.js');

const handleJoinGame = (io, socket) => {
  socket.on('joinGame', async (data) => {
    const { userData } = data;
    const userId = uuidv4();
    const userSocketId = socket.id;

    const user = {
      userData,
      userId,
      userSocketId,
    };

    const code = userData.gameCode
    
    const gameData = await getGame(code) 
    if (!gameData) {
      console.log('Invalid game code provided');
      socket.emit('invalidGameCode', {
        message: 'Invalid game code, please try again.',
      });
      return;
    }

    let existingUser = await getUser(code, userData.username);
    if (existingUser) {
      console.log('There is already a person with the same name');
      socket.emit('invalidName', {
        message: 'Invalid name, please try again.',
      });
      return;
    }

    console.log(gameData.hostIp);
    socket.join(gameData.hostIp);

    await addUser(code, userData.username);
    const users = await getUsers(code)
    

    io.to(gameData.hostIp).emit('updatePlayers', {
      message: 'New player joined the game!',
      players: users,
    });

    socket.emit('joinSuccess', {
      message: 'Successfully joined the game!',
      ip: gameData.hostIp,
    });
        
  });
};

module.exports = { handleJoinGame };
