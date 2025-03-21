import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './pages/login'
import Register from './pages/register'

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
