import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen, HOME_SCREEN_NAME} from "./home";
import {StoreProvider} from "./UseStore";
import {WEBAPP_QRLOGIN_SCREEN_NAME, WebAppQrLogin} from "./webapp/WebAppQrLogin";

const Stack = createStackNavigator();

const App = () => {
    return (
        <StoreProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={HOME_SCREEN_NAME}>
                    <Stack.Screen name={HOME_SCREEN_NAME} component={HomeScreen}/>
                    <Stack.Screen name={WEBAPP_QRLOGIN_SCREEN_NAME} component={WebAppQrLogin}/>
                </Stack.Navigator>
            </NavigationContainer>
        </StoreProvider>
    );
};

export default App;