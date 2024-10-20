const { getUsers } = require('../supabase.js');

const handleStartGame = (io, socket) => {
  socket.on('startGame',async (data) =>{

  })
};

module.exports = { handleStartGame };
