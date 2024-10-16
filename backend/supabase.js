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
      console.log('No game found with the given code');
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

let deleteAllGames = async function () {
  try {
    const { data, error } = await supabase.from('games').delete();
    if (error) {
      console.error('Error deleting all games:', error);
    } else {
      return data; 
    }
  } catch (err) {
    console.error('Error:', err);
  }
};


module.exports = {
  getData,
  insertGame,
  getGame,
  deleteGame,
  deleteAllGames,
};