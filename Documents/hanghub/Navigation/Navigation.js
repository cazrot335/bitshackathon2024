import { useEffect,useState } from "react";
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "../Screens/Home"
import Onboarding from "../Screens/Onboarding.js";
//import Signup from "../Screens/Signup";
//import Welcome from "../Screens/Welcome.js";
import Login from "../Screens/Login";





const Stack = createStackNavigator();

export function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding">
                <Stack.Screen name="Onboarding" options ={{headerShown:false}} component={Onboarding} />
                {/* <Stack.Screen name="Welcome" options ={{headerShown:false}} component={Welcome} /> */}
                {/* <Stack.Screen name="Signup" options ={{headerShown:false}} component={Signup} /> */}
                <Stack.Screen name="Login" options ={{headerShown:false}} component={Login} />
                <Stack.Screen name="Home" options ={{headerShown:false}} component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}