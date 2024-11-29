import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../home';
import Registro from '../registropokemon';
import Atualizar from '../atualizarpokemon';

const Stack = createStackNavigator();

export default function Rotas() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Registro" component={Registro} />
            <Stack.Screen name="Atualizar" component={Atualizar} />
        </Stack.Navigator>
    );
}