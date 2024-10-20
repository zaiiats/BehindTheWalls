import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { nameSet, gameTypeSet, codeSet, socketSet } from '@/store/slices/playerSlice';
import CustomButton from './CustomButton';
import {
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  CODE_LENGTH,
} from '@/constants/constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../app/_layout';

interface JoinModalProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
type JoinModalNavigationProp = StackNavigationProp<
  RootStackParamList,
  'lobby/index'
>;

const JoinModal: React.FC<JoinModalProps> = ({ setIsVisible }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<JoinModalNavigationProp>();
  const username = useSelector((store: any) => store.player.name);
  const gameCode = useSelector((store: any) => store.player.code);
  const soundVolume = useSelector((state: any) => state.player.soundVolume);
  const musicVolume = useSelector((state: any) => state.player.musicVolume);
  const socket = useSelector((state: any) => state.player.socket);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    if (socket) {
      setError('');
      dispatch(codeSet(data.gameCode));
      dispatch(nameSet(data.username));
      dispatch(gameTypeSet('join'));

      socket.emit('joinGame', {
        userData: {
          username: data.username,
          gameCode: data.gameCode,
          soundVolume,
          musicVolume,
        }
      });

      socket.on('joinSuccess', (response: any) => {
        console.log(response.message);
        navigation.push('lobby/index');
        setIsVisible(false);
      });

      socket.on('invalidGameCode', (error: any) => {
        console.error(error.message);
        dispatch(codeSet(''));
        setError(error.message);
      });

      socket.on('invalidName', (error: any) => {
        console.error(error.message);
        dispatch(codeSet(''));
        setError(error.message);
      });
    } else {
      console.error('Socket not initialized');
    }
  };

  return (
    <>
      {error ? (
        <View>
          <Text>Error:</Text>
          <Text>{error}</Text>
        </View>
      ) : (
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
                onChangeText={(text) => {
                  onChange(text);
                  dispatch(nameSet(text));
                }}
                placeholder='Enter name'
                style={{
                  borderColor: errors.username ? 'red' : 'black',
                  borderWidth: 1,
                }}
              />
            )}
          />
          {errors.username && (
            <Text style={{ color: 'red' }}>
              {typeof errors.username.message === 'string'
                ? errors.username.message
                : 'Invalid input'}
            </Text>
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
                onChangeText={(value) => {
                  onChange(value);
                  dispatch(codeSet(value));
                }}
                placeholder='Enter game code'
                style={{
                  borderColor: errors.gameCode ? 'red' : 'black',
                  borderWidth: 1,
                }}
              />
            )}
          />
          {errors.gameCode && (
            <Text style={{ color: 'red' }}>
              {typeof errors.gameCode.message === 'string'
                ? errors.gameCode.message
                : 'Invalid input'}
            </Text>
          )}

          <CustomButton callback={handleSubmit(onSubmit)}>
            Join Game
          </CustomButton>
        </View>
      )}
    </>
  );
};

export default JoinModal;
