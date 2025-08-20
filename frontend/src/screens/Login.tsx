import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Input from '../components/Input';
import { Lock, Mail } from 'lucide-react-native';
import Button from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';

function Login() {
  return (
    <View style={styles.Logincontainer}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors= {['#a129d3', '#136be3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.gradienttext}>AI</Text>
        </LinearGradient>
        <View style={styles.logoText}>
        <Text style={styles.chatbot}>CHAT BOT</Text>
        <Text>Sign in to start your conversation</Text></View>
      </View>
      <View style={styles.signinContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.signin}>SIGN IN</Text>
        <Text>Enter Your credentials to access your account</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Enter the Email"
          label="Email"
          icon={<Mail size={20} color="#6B7280" />}
        />

        <Input
          placeholder="Enter your password"
          label="Password"
          password
          icon={<Lock size={20} color="#6B7280" />}
        />
        <Button />
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Logincontainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 24,
    fontWeight: 400,
  },
  gradient:{
    height:60,
    width:60,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },
  gradienttext:{
    fontWeight:'bold',
    color:'#fff'
  },
  logoContainer:{
    justifyContent:'center',
    alignItems:'center',
    gap:15
  },
  chatbot:{
    fontSize:30,
    fontWeight:'bold',
  },
  logoText:{
    justifyContent:'center',
    alignItems:'center'
  },
  signinContainer:{
    width:'90%',
    padding:10,
    justifyContent:'center',
    alignItems:'center',
    gap:20,
    borderWidth:1,
    borderColor:'lightgrey',
    paddingTop:30,
    paddingBottom:30,
    borderRadius:15
  }

});

export default Login;
