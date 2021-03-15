import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen, HOME_SCREEN_NAME} from "./home";
import {LoginStore} from "./login";

const Stack = createStackNavigator();
const LoginStoreContext = React.createContext<LoginStore>()

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name={HOME_SCREEN_NAME}
                    component={HomeScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;