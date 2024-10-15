import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';

import { musicVolumeSet, soundVolumeSet } from '@/store/slices/playerSlice'; 

const JoinModal: React.FC = () => {
  const dispatch = useDispatch();

  const soundVolume = useSelector((state: any) => state.player.soundVolume);
  const musicVolume = useSelector((state: any) => state.player.musicVolume);

  const handleMusicVolumeChange = (value: number) => {
    dispatch(musicVolumeSet(value)); 
    console.log('Music Volume updated:', value);
  };

  const handleSoundVolumeChange = (value: number) => {
    dispatch(soundVolumeSet(value)); 
    console.log('Sound Volume updated:', value);
  };

  return (
    <View>
      <Text>Sound volume:</Text>
      <Slider
        value={soundVolume}
        onValueChange={handleSoundVolumeChange}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
      />

      <Text>Music volume:</Text>
      <Slider
        value={musicVolume}
        onValueChange={handleMusicVolumeChange}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
      />

      <Text>Terms of service</Text>
      <Text>Make a donation!</Text>
    </View>
  );
};

export default JoinModal;
