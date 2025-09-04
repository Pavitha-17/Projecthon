import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Input from '../components/Input';
import { Lock, Mail, User } from 'lucide-react-native';
import Button from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';
function Signup() {
  const [isPressedlogin, setIsPressedlogin] = useState(false);
  return (
    <View style={styles.signupContainer}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#00C781', '#2D9CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.gradienttext}>AI</Text>
        </LinearGradient>
        <View style={styles.logoText}>
          <Text style={styles.create}>Create Account</Text>
          <Text>Join us and start your AI conversations</Text>
        </View>
      </View>
      <View style={styles.upcontainer}>
        <View style={styles.textContainer}>
          <Text style={styles.signup}>Sign Up</Text>
          {/* <Text>Enter Your credentials to access your account</Text> */}
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Enter your Name"
            label="User Name"
            icon={<User size={20} color="#6B7280" />}
          />
          <Input
            placeholder="Enter Your Email"
            label="Email"
            icon={<Mail size={20} color="#6B7280" />}
          />

          <Input
            placeholder="Create your password"
            label="Password"
            password
            icon={<Lock size={20} color="#6B7280" />}
          />
          <Input
            placeholder="Confirm your password"
            label="Confirm Password"
            password
            icon={<Lock size={20} color="#6B7280" />}
          />
        </View>
        <Button
          left="#02ac70ff"
          right="#1994ffff"
          left1="#00C781"
          right1="#2D9CFF"
          text={'Sign Up'}
        />
      </View>
      <View style={styles.login}>
        <Text>Have an account?</Text>
        <Pressable
          onPressIn={() => setIsPressedlogin(true)}
          onPressOut={() => setIsPressedlogin(false)}
        >
          <Text
            style={{
              color: isPressedlogin ? '#136be3' : '#288df8',
            }}
          >
            Log In
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Signup;

const styles = StyleSheet.create({
  signupContainer: {
    flex: 1,
    backgroundColor: '#ebfff8ff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  gradient: {
    height: 60,
    width: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradienttext: {
    fontWeight: 'bold',
    color: '#fff',
  },
  create: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  logoText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcontainer: {
    width: '90%',
    // padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingTop: 30,
    paddingBottom: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signup: {
    fontSize: 22,
    fontWeight: 400,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  login: {
    flexDirection: 'row',
  },
});
