import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatScreen } from '../Screens/ChatScreen';
import { SettingsScreen } from '../Screens/SettingsScreen';
import { SplashScreen } from '../Screens/SplashScreen';
import { MachineSelectionScreen } from '../Screens/MachineSelectionScreen';
import { UsageProcedureScreen } from '../Screens/UsageProcedureScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SplashScreen: undefined;
  MachineSelection: undefined;
  ChatScreen: undefined;
  SettingsScreen: undefined;
  UsageProcedureScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RouteNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='SplashScreen' component={SplashScreen} />
                <Stack.Screen name='ChatScreen' component={ChatScreen} />
                <Stack.Screen name='SettingsScreen' component={SettingsScreen} />
                <Stack.Screen name='MachineSelection' component={MachineSelectionScreen} />
                <Stack.Screen name='UsageProcedureScreen' component={UsageProcedureScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};