import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from "./home";
import {WebAppQrLoginScreen} from "./webapp/WebAppQrLoginScreen";
import {StoreProvider, useAuth, useRootStore} from "./store/Stores";
import {HOME_SCREEN_NAME, LOGIN_SCREEN_NAME, WEBAPP_QRLOGIN_SCREEN_NAME} from "./navigation/NavigationConsts";
import LoginScreen from "./login/LoginScreen";
import {observer} from "mobx-react";
import {useEffect, useState} from "react";
import SplashScreen from "./splash/SplashScreen";

const Stack = createStackNavigator();

const App = () => {
    return (
        <StoreProvider>
            <AppComponent/>
        </StoreProvider>

    )
};

const AppComponent = observer(() => {
    const auth = useAuth();
    const rootStore = useRootStore();

    useEffect(() => {
        if (!rootStore.isStoresLoaded) {
            rootStore.loadStores();
        }
    });

    if (!rootStore.isStoresLoaded) {
        return (
            <SplashScreen/>
        );
    }

    return (
        <NavigationContainer>
            {!auth.isLoggedIn ? (
                <Stack.Navigator>
                    <Stack.Screen
                        name={LOGIN_SCREEN_NAME}
                        component={LoginScreen}
                        options={{title: "Login"}}
                    />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator initialRouteName={HOME_SCREEN_NAME}>
                    <Stack.Screen
                        name={HOME_SCREEN_NAME}
                        component={HomeScreen}
                        options={{title: "Home"}}
                    />
                    <Stack.Screen
                        name={WEBAPP_QRLOGIN_SCREEN_NAME}
                        component={WebAppQrLoginScreen}
                        options={{title: "Scan QR code"}}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
});

export {
    App,
};