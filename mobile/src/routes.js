import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/Login/index';
import Register from './pages/Register/index';
import Feed from './pages/Feed/index';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
