import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tudo from './stack'; // Gerencia login, signin e forgot
import Rotas from './rotas'; // Gerencia Home, Register e Change

const Stack = createStackNavigator();

export default function AccessRoute() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Tudo} />
            <Stack.Screen name="Rotas" component={Rotas} />
        </Stack.Navigator>
    );
}