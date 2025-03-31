import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Login from './pages/Login'
import Register from './pages/register'

import Feed from './pages/feed/index'

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Feed />
    // <Stack.Navigator initialRouteName="Login">
    //   <Stack.Screen 
    //     name="Login" 
    //     component={Login} 
    //     options={{headerShown: false}}
    //   />
    //   <Stack.Screen 
    //     name="Register" 
    //     component={Register} 
    //     options={{headerShown: false}}
    //   />
    // </Stack.Navigator>
  );
}
