import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ModalScreen from '@/components/ModalScreen';
import JoinModal from '@/components/JoinModal';
import HostModal from '@/components/HostModal';
import SettingModal from '@/components/SettingModal';
import CustomButton from '@/components/CustomButton';
import {
  initiateSocketConnection,
  getSocket,
} from '../../scripts/socketService';
import { useSelector } from 'react-redux';

function Main() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalLabel, setModalLabel] = useState('');

  const { name, code, gameType, soundVolume, musicVolume } = useSelector(
    (state: any) => state.player
  );

  useEffect(() => {
    const socket = initiateSocketConnection();
    return () => {
      socket.disconnect();
    };
  }, []);

  const openJoinModal = () => {
    setModalLabel('Join a Game');
    setModalContent(
      <JoinModal
        socket={getSocket()}
        setIsVisible={setIsModalVisible}
      />
    );
    setIsModalVisible(true);
  };

  const openHostModal = () => {
    setModalLabel('Create Game');
    setModalContent(
      <HostModal
        socket={getSocket()}
        setIsVisible={setIsModalVisible}
      />
    );
    setIsModalVisible(true);
  };

  const openSettingsModal = () => {
    setModalLabel('Settings');
    setModalContent(<SettingModal />);
    setIsModalVisible(true);
  };

  return (
    <>
      <StatusBar hidden={true} />
      <ModalScreen
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        label={modalLabel}
      >
        {modalContent}
      </ModalScreen>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Pressable>
            <Text>Per6</Text>
          </Pressable>
          <Pressable onPress={openSettingsModal}>
            <Text>Settings</Text>
          </Pressable>
        </View>

        <View style={styles.main}>
          <Text>Main</Text>
          <Text>
            {`${name} ${code} ${gameType} ${soundVolume} ${musicVolume}`}
          </Text>
        </View>

        <View style={styles.buttons}>
          <CustomButton callback={openHostModal}>Host</CustomButton>
          <CustomButton callback={openJoinModal}>Join</CustomButton>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
  },
  header: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  main: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  buttons: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    margin: 10,
  },
});

export default Main;
