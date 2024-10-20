import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '../store/store';
import { createStackNavigator } from '@react-navigation/stack';
import { socketSet } from '@/store/slices/playerSlice';
import { io } from 'socket.io-client';

import Game from '@/app/game/index';
import Lobby from '@/app/lobby/index';
import Menu from '@/app/menu/index';

const Stack = createStackNavigator();

export type RootStackParamList = {
  'menu/index': undefined;
  'lobby/index': undefined;
  'game/index': undefined;
};

function RootLayout() {
  const dispatch = useDispatch(); 
  const socket = useSelector((state: any) => state.player.socket); 

  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://13.60.208.228:4000');
      console.log('Socket initialized:', newSocket.id);
      dispatch(socketSet(newSocket)); 
    }
    console.log(socket);
    

    return () => {
      if (socket) {
        socket.disconnect(); 
        dispatch(socketSet(null)); 
      }
    };
  }, [socket, dispatch]);

  return (
    <>
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
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  );
}
