const { v4: uuidv4 } = require('uuid');

const { getGame } = require('../supabase.js');

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


    
    socket.emit('joinSuccess', { message: 'You successfully joined the game!', gameData });

    // Perform additional actions if needed, e.g., add user to game room

    console.log('User joined the game:', userData.username);
    
    //connectedUsers.push(user);
    //io.emit('updateUsers', connectedUsers);
  });
};

module.exports = { handleJoinGame };
