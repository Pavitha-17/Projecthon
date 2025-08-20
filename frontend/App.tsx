import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Your screens
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
