import React, { useEffect, useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { nameSet, codeSet, gameTypeSet } from '@/store/slices/playerSlice';
import CustomButton from './CustomButton';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH, CODE_LENGTH } from '@/constants/constants';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../app/_layout';
import { StackNavigationProp } from '@react-navigation/stack';

type HostModalNavigationProp = StackNavigationProp<RootStackParamList,'lobby/index'>;

interface JoinModalProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface JoinModalFormValues {
  username: string;
  gameCode: string;
}

let socket = io('http://localhost:4000');

const JoinModal: React.FC<JoinModalProps> = ({ setIsVisible }) => {
  const navigation = useNavigation<HostModalNavigationProp>();

  const dispatch = useDispatch();

  const [isConnected, setIsConnected] = useState(false);
  const username = useSelector((store: any) => store.player.name); 
  const gameCode = useSelector((store: any) => store.player.code); 
  const soundVolume = useSelector((state: any) => state.player.soundVolume);
  const musicVolume = useSelector((state: any) => state.player.musicVolume);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinModalFormValues>();

  useEffect(() => {
    const checkForReconnection = async () => {
      const savedUserId = await AsyncStorage.getItem('userId');
      if (savedUserId) {
        socket.emit(
          'reconnectUser',
          { userId: savedUserId },
          (response: any) => {
            if (response.success) {
              console.log('Reconnected with previous session');
              setIsConnected(true);
            } else {
              console.log('Failed to reconnect, starting new session');
            }
          }
        );
      }
    };

    socket.on('connect', () => {
      console.log('Connected to the server:', socket.id);
      checkForReconnection();
    });
  }, []);

  const onSubmit = (data: JoinModalFormValues) => {
     if (!isConnected) {
      dispatch(nameSet(data.username));
      dispatch(gameTypeSet('host'));

      socket.emit(
        'joinGame',
        { 
          userData: {
            username: data.username, 
            gameCode, 
            soundVolume, 
            musicVolume
          } 
        },
        async (response: any) => {
          if (response.success) {
            console.log('Connected to the game!');
            setIsConnected(true);
            await AsyncStorage.setItem('userId', response.userId);
          } else {
            console.log('Error or already in the game');
          }
        }
      );
      navigation.push('lobby/index');
      setIsVisible(false);
    } else {
      console.log('You are already connected to the game.');
    }
  };

  return (
    <View>
      <Text>Your name:</Text>
      <Controller
        control={control}
        name='username'
        defaultValue={username}
        rules={{
          required: 'Name is required',
          minLength: {
            value: MIN_NAME_LENGTH,
            message: `Name must be at least ${MIN_NAME_LENGTH} characters long`,
          },
          maxLength: {
            value: MAX_NAME_LENGTH,
            message: `Name must be less than ${MAX_NAME_LENGTH} characters long`,
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder='Enter name'
            style={{
              borderColor: errors.username ? 'red' : 'black',
              borderWidth: 1,
            }}
          />
        )}
      />
      {errors.username && (
        <Text style={{ color: 'red' }}>{errors.username.message}</Text>
      )}

      <Text>Enter the game code to join the lobby:</Text>
      <Controller
        control={control}
        name='gameCode'
        defaultValue={gameCode}
        rules={{
          required: 'Game code is required',
          minLength: {
            value: CODE_LENGTH,
            message: `Game code must be ${CODE_LENGTH} characters long`,
          },
          maxLength: {
            value: CODE_LENGTH,
            message: `Game code must be ${CODE_LENGTH} characters long`,
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder='Enter game code'
            style={{
              borderColor: errors.gameCode ? 'red' : 'black',
              borderWidth: 1,
            }}
          />
        )}
      />
      {errors.gameCode && (
        <Text style={{ color: 'red' }}>{errors.gameCode.message}</Text>
      )}

      <CustomButton callback={handleSubmit(onSubmit)}>Join Game</CustomButton>
    </View>
  );
};

export default JoinModal;
