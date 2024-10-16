import React, { useEffect, useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import CustomButton from './CustomButton';
import { gameTypeSet, nameSet } from '../store/slices/playerSlice';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '../constants/constants';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../app/_layout';
import { StackNavigationProp } from '@react-navigation/stack';

type HostModalNavigationProp = StackNavigationProp<RootStackParamList, 'lobby/index'>;

interface HostModalProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface HostModalFormValues {
  username: string;
}

let socket = io('http://localhost:4000');

const HostModal: React.FC<HostModalProps> = ({ setIsVisible }) => {
  const navigation = useNavigation<HostModalNavigationProp>();

  const dispatch = useDispatch();
  
  const [isConnected, setIsConnected] = useState(false);
  const username = useSelector((state: any) => state.player.name);
  const soundVolume = useSelector((state: any) => state.player.soundVolume);
  const musicVolume = useSelector((state: any) => state.player.musicVolume);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HostModalFormValues>();

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

  const onSubmit = (data: HostModalFormValues) => {
    if (!isConnected) {
      dispatch(nameSet(data.username));
      dispatch(gameTypeSet('host'));

      socket.emit(
        'createGame',
        {
          userData: {
            username: data.username,
            soundVolume,
            musicVolume,
          },
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
      navigation.navigate('lobby/index');
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
            placeholder='Enter name'
            value={value}
            onChangeText={onChange}
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

      <CustomButton callback={handleSubmit(onSubmit)}>Start Game</CustomButton>
    </View>
  );
};

export default HostModal;
