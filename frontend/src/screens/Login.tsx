import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native';
import Input from '../components/Input';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react-native';
import Button from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
type NavigationProp = StackNavigationProp<RootStackParamList>;

function Login() {
  const navigation = useNavigation<NavigationProp>();
  const [isPressedforget, setIsPressedforget] = useState(false);
  const [isPressedsignup, setIsPressedsignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(validateEmail(text));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(validatePassword(text));
  };

  return (
    <View style={styles.Logincontainer}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#a129d3', '#136be3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.gradienttext}>AI</Text>
        </LinearGradient>
        <View style={styles.logoText}>
          <Text style={styles.chatbot}>CHAT BOT</Text>
          <Text>Sign in to start your conversation</Text>
        </View>
      </View>
      <View style={styles.signinContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.signin}>Sign In</Text>
          {/* <Text>Enter Your credentials to access your account</Text> */}
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Enter the Email"
            label="Email"
            icon={<Mail size={20} color="#6B7280" />}
            value={email}
            onChangeText={handleEmailChange}
            error={emailError}
          />
          <Input
            placeholder="Enter your password"
            label="Password"
            password={!showPassword}
            icon={<Lock size={20} color="#6B7280" />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
              </TouchableOpacity>
            }
            value={password}
            onChangeText={handlePasswordChange}
            error={passwordError}
          />
          <Pressable
            onPressIn={() => setIsPressedforget(true)}
            onPressOut={() => setIsPressedforget(false)}
          >
            <Text
              style={{
                color: isPressedforget ? '#94969cff' : '#6B7280',
                marginLeft: 150,
              }}
            >
              Forget Password ?
            </Text>
          </Pressable>
          <Button
            left="#a129d3"
            right="#136be3"
            left1="#b145f4"
            right1="#288df8"
            text={'Log In'}
            onPress={() => navigation.navigate('Home')}
          />
      </View>
        </View>

          <View style={styles.signup}>
            <Text>Don't have an account?</Text>
            <Pressable
              onPressIn={() => setIsPressedsignup(true)}
              onPressOut={() => setIsPressedsignup(false)}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text
                style={{
                  color: isPressedsignup ? '#136be3' : '#288df8',
                }}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Logincontainer: {
    flex: 1,
    backgroundColor: '#fff4ffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signin: {
    fontSize: 22,
    fontWeight: 400,
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
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  chatbot: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  logoText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinContainer: {
    backgroundColor: '#fff',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingTop: 30,
    paddingBottom: 30,
    borderRadius: 15,
  },
  signup: {
    flexDirection: 'row',
  },
});

export default Login;
