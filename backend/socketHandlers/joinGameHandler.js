const { v4: uuidv4 } = require('uuid');
const { getGame, addUser, getUser} = require('../supabase.js');

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
    console.log('code is ',code, data);
    
    const gameData = await getGame(code) 

    if (!gameData) {
      console.log('Invalid game code provided');
      socket.emit('invalidGameCode', {
        message: 'Invalid game code, please try again.',
      });
      return;
    }

    let usersData = await getUser(code,userData.username)
    
    
    if (usersData) {
      console.log('There is already a person with the same name');
      socket.emit('invalidName', {
        message: 'Invalid name, please try again.',
      });
      return;
    }
    
    socket.emit('joinSuccess', { message: 'You successfully joined the game!', gameData });

    addUser(code, userData.username).then((response) => {
      if (response) {
        console.log('Player added to game:', response);
      } else {
        console.log('Failed to add player.');
      }
    });
        
  });
};

module.exports = { handleJoinGame };
