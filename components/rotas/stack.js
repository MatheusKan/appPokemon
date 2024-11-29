import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../login';
import Entrar from '../cadastrar';
import Esqueceu from '../esqueceusenha';

const Stack = createStackNavigator();

export default function StackLogin() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Entrar" component={Entrar} />
            <Stack.Screen name="Esqueceu" component={Esqueceu} />
        </Stack.Navigator>
    );
}