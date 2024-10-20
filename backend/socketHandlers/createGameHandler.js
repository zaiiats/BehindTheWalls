const { v4: uuidv4 } = require('uuid');
const os = require('os');
const { generateGameCode } = require('../utils/utils.js');
const { createEnvironment } = require('../utils/createEnvData.js');

const {
  insertGame,
  getGame,
} = require('../supabase.js');

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (let interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return 'localhost'; 
};

const handleCreateGame = (io, socket) => {
  socket.on('createGame', async (data) => {
    let code = generateGameCode(); 
    const { userData } = data;
    const userId = uuidv4();
    const userSocketId = socket.id;

    const user = {
      userData,
      userId,
      userSocketId,
    };

    while (await getGame(code)) {
      code = generateGameCode(); 
    }

    const envData = JSON.stringify(createEnvironment());
    const hostIp = getLocalIpAddress();
    let players = [`'${userData.username}'`];

    const game = {
      code,
      hostName: userData.username,
      hostIp,
      envData,
      players
    };
    
    console.log('Host hostIp Address:', hostIp);
    await insertGame(game);
    
    socket.join(hostIp);
    io.to(hostIp).emit('updatePlayers', {
      message: 'New player joined the game!',
      players,
    });

    console.log(
      `Game created with code: ${code}, ip is ${hostIp} and host: ${userData.username}`
    );
  });
};

module.exports = { handleCreateGame };
