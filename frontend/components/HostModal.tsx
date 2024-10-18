import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { gameTypeSet, nameSet } from '../store/slices/playerSlice';
import CustomButton from './CustomButton';
import { 
  MAX_NAME_LENGTH, 
  MIN_NAME_LENGTH
} from '../constants/constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../app/_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HostModalProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  socket: any;
}

type HostModalNavigationProp = StackNavigationProp<
  RootStackParamList,
  'lobby/index'
>;

const HostModal: React.FC<HostModalProps> = ({
  setIsVisible,
  socket
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<HostModalNavigationProp>();
  const username = useSelector((state: any) => state.player.name);
  const soundVolume = useSelector((state: any) => state.player.soundVolume);
  const musicVolume = useSelector((state: any) => state.player.musicVolume);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    if (socket) {
      dispatch(nameSet(data.username));
      dispatch(gameTypeSet('host'));
  
      socket.emit(
        'createGame',
        {
          userData: {
            username: data.username,
            soundVolume,
            musicVolume,
          }
        }
      )
      navigation.push('lobby/index');
      setIsVisible(false);
    } else {
      console.error('Socket not initialized');
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
        <Text style={{ color: 'red' }}>
          {typeof errors.username.message === 'string'
            ? errors.username.message
            : 'Invalid input'}
        </Text>
      )}

      <CustomButton callback={handleSubmit(onSubmit)}>Create Game</CustomButton>
    </View>
  );
};

export default HostModal;
