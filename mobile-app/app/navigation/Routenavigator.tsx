import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type RootStackParamList } from '../types/type';
import { ChatScreen } from '../Screens/ChatScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RouteNavigator = () => {
    return (
        
        <NavigationContainer>
            <Stack.Navigator initialRouteName='ChatScreen' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='ChatScreen' component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};