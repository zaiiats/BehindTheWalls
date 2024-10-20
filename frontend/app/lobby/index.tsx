import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../_layout';
import CustomButton from '@/components/CustomButton';

type LobbyScreenProp = StackNavigationProp<RootStackParamList, 'lobby/index'>;

function Lobby() {
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const navigation = useNavigation<LobbyScreenProp>();

  const socket = useSelector((state: any) => state.player.socket);
  const username = useSelector((state: any) => state.player.name);
  const code = useSelector((state: any) => state.player.code);

  useEffect(() => {
    if (!username || !socket) {
      navigation.replace('menu/index'); 
      return;
    }

    const handleUpdatePlayers = (data: { message: string; players: string[] }) => {
      setConnectedUsers(data.players); 
      console.log(data.message); 
    };

    socket.on('updatePlayers', handleUpdatePlayers);
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    return () => {
      socket.off('updatePlayers', handleUpdatePlayers);
    };
    
  }, [socket, username]);

  useEffect(() => {
    socket.emit('playerReady', { username });
  }, [isReady]);


  return (
    <View style={styles.screen}>
      <Text>Lobby</Text>
      <FlatList
        data={connectedUsers}
        keyExtractor={(item: any) => item.userId}
        renderItem={({ item }) => (
          <Text>{item?.userData?.username || 'Unknown User'}</Text>
        )}
      />
      <CustomButton callback={() => setIsReady(true)}>
        {isReady?'I am ready':'Ready?'}
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
});

export default Lobby;
