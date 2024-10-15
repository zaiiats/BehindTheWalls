import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from '../store/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Game from '@/app/game/index'
import Lobby from '@/app/lobby/index'
import Menu from '@/app/menu/index'

const Stack = createStackNavigator();

export type RootStackParamList = {
  'menu/index': undefined;
  'lobby/index': undefined;
  'game/index': undefined;
};

function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar barStyle={'light-content'} />
      <Stack.Navigator>
        <Stack.Screen
          name='menu/index'
          component={Menu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={Lobby}
          name='lobby/index'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={Game}
          name='game/index'
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </Provider>
  );
}

export default RootLayout;
