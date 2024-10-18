import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function index() {
   const [connectedUsers, setConnectedUsers] = useState([]);

   useEffect(() => {
     socket.on('updateUsers', (users) => {
       setConnectedUsers(users);
     });

     return () => {
       socket.off('updateUsers'); 
       socket.disconnect(); 
     };
   }, []);

  return (
    <View style={style.screen}>
      <Text>
        Lobby
      </Text>
      <Text>
        <FlatList
          data={connectedUsers}
          keyExtractor={(item:any) => item.userId}
          renderItem={({ item }) => (
            <Text>{item.userData.username}</Text> 
          )}
        />
      </Text>
      <View>

      </View>
    </View>
  );
}

const style = StyleSheet.create({
  screen:{
    flex:1
  }
})

export default index
