import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../_layout';

type GameScreenProp = StackNavigationProp<RootStackParamList, 'game/index'>;

function Game() {
  const navigation = useNavigation<GameScreenProp>();

  const socket = useSelector((state: any) => state.player.socket);
  const username = useSelector((state: any) => state.player.name);

  useEffect(() => {
    if (!username || !socket) {
      navigation.replace('menu/index'); 
    }
  }, [socket, username, navigation]);

  return (
    <View style={styles.screen}>
      <Text>Game</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Game;
