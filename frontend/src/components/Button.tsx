import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function Button() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={styles.buttonContainer}
    >
      <LinearGradient
        colors={
          isPressed
            ? ['#a129d3', '#136be3']
            : ['#b145f4', '#288df8']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>Sign In</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    width:'90%'
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
