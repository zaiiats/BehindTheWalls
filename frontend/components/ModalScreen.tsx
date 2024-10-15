import { View, Text, StyleSheet,Modal, Pressable } from 'react-native';
import React, { ReactNode } from 'react';

interface ModalProps {
  setIsModalVisible: (visible: boolean) => void;
  isModalVisible:boolean;
  children: ReactNode;
  label: string;
}

const ModalScreen: React.FC<ModalProps> = ({
  setIsModalVisible,
  isModalVisible,
  children,
  label,
}) => {
  return (
    <Modal
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.label}>
            {label && <Text style={styles.modalLabel}>{label}</Text>}
            <Pressable
              style={styles.button}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.buttonText}>x</Text>
            </Pressable>
          </View>
          <View>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cool overlay effect
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 2, 
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 1,
    padding: 5,
    elevation: 2,
    backgroundColor: '#2196F3', 
  },
  label:{
    flexDirection:'row'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalLabel: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Cool dark text color for the label
  },
});

export default ModalScreen;
