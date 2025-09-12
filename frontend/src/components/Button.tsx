import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, TextInputProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type InputProps = TextInputProps & {
  left: string;
  right: string;
  left1: string;
  right1: string;
  text: string; // Fixed typo: String -> string
  onPress?: () => void; // Add onPress to the type definition
};

export default function Button({ left, right, text, left1, right1, onPress }: InputProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress} // Add onPress here to trigger the passed function
      style={styles.buttonContainer}
    >
      <LinearGradient
        colors={isPressed ? [left, right] : [left1, right1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '90%',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});