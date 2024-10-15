import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  callback: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({
  callback,
  children,
}) => {
  return (
    <Pressable onPress={callback}>
      <View style={styles.screen}>
        <Text>{children}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
});

export default CustomButton;
