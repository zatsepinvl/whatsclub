import React, {useState} from "react";
import {View, TextInput, StyleSheet, Button, Text} from "react-native";
import {loginService} from "./index";

const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                value={username}
                placeholder="Username"
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                value={password}
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <View style={styles.button}>
                <Button
                    title="Login"
                    onPress={() => {
                        loginService.login(username, password)
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 40,
        flex: 1,
        justifyContent: "center"
    },
    title: {
        fontSize: 22
    },
    input: {
        height: 40,
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 2
    },
    button: {
        marginTop: 20,
    }
});

export default LoginScreen;