const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vcvchhndvjdeqcxeoigs.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdmNoaG5kdmpkZXFjeGVvaWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMjQwMzMsImV4cCI6MjA0NDYwMDAzM30.8vME5o51UU787WxL94dO3UxeosKnUKdB8OJEX_6GktE';
const supabase = createClient(supabaseUrl, supabaseKey);


let getData = async function () {
  try {
    let { data: games, error } = await supabase.from('games').select('*');
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      return games;
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

let insertGame = async function (gameData) {
  try {
    const { data, error } = await supabase.from('games').insert([gameData]);
    if (error) {
      console.error('Error inserting game:', error);
    } else {
      return data;
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

let getGame = async function (code) {
  try {
    let { data: games, error } = await supabase
      .from('games')
      .select('*')
      .eq('code', code);

    if (error) {
      console.error('Error fetching data:', error);
      return null;
    } else if (games.length === 0) {
      console.log('No game found with the given code', code);
      return null;
    } else {
      return games[0]; 
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

let getSocket = async function (code) {
  try {
    let { data: games, error } = await supabase
      .from('games')
      .select('hostIp')
      .eq('code', code);

    if (error) {
      console.error('Error getting ip:', error);
      return null;
    } else if (games.length === 0) {
      console.log('No game found with the given code', code);
      return null;
    } else {
      return games[0]; 
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

let deleteGame = async function (code) {
  try {
    const { data, error } = await supabase
      .from('games')
      .delete()
      .eq('code', code);
    if (error) {
      console.error('Error deleting game:', error);
    } else {
      return data; 
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

let addUser = async function (code, name) {
  try {
    const { data: gameData, error: fetchError } = await supabase
      .from('games')
      .select('players')
      .eq('code', code)
      .single();

    if (fetchError || !gameData) {
      console.error('Error fetching game data:', fetchError);
      return null;
    }

    const currentPlayers = gameData.players || [];
    const updatedPlayers = [...currentPlayers, name];

    const { error: updateError } = await supabase
      .from('games')
      .update({ players: updatedPlayers })
      .eq('code', code);

    if (updateError) {
      console.error('Error updating players:', updateError);
      return null;
    } else {
      console.log('User added successfully');
      return true;
    }
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
};

let removeUser = async function (code, name) {
  try {
    const { data, error } = await supabase
      .from('games') 
      .delete()
      .eq('code', code)
      .eq('players', name);

    if (error) {
      console.error('Error removing user:', error);
      return null;
    } else {
      console.log('User removed successfully:', data);
      return data;
    }
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
};

let addEnvData = async function (code, envData) {
  try {
    const { data, error } = await supabase
      .from('games') 
      .update({ envData: envData })
      .eq('code', code); 

    if (error) {
      console.error('Error setting env data:', error);
      return null;
    } else {
      console.log('Env data set successfully:', data);
      return data;
    }
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
};

let getUser = async function (code, username) {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('players')
      .eq('code', code);

    if (error) {
      console.error('Error fetching players:', error);
      return null;
    }

    if (data && data.length > 0) {
      const players = data[0].players;

      if (Array.isArray(players)) {
        const userExists = players.some((player) => player === username);

        if (userExists) {
          console.log('User with the same name exists');
          return true; 
        } else {
          console.log('Username available');
          return false; 
        }
      } else {
        console.log('Players is not an array or is undefined.');
        return false;
      }
    }

    console.log('No game found with the provided code.');
    return null; 
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
};

let getUsers = async function (code) {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('players')
      .eq('code', code)
      .single(); 

    if (error || !data) {
      console.log('Error occurred while getting users:', error);
      return null;
    }

    return data.players || [];
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
};




module.exports = {
  getData,
  insertGame,
  getGame,
  deleteGame,
  addUser,
  removeUser,
  addEnvData,
  getUser,
  getUsers,
  getSocket
};