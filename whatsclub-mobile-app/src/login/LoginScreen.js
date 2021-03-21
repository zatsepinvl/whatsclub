import React, {useEffect, useState} from "react";
import {View, TextInput, StyleSheet, Button, Text, Alert} from "react-native";
import {useAuth} from "../store/Stores";
import {observer} from "mobx-react";

const LoginScreen = observer(() => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const auth = useAuth();

    const handleError = (e) => {
        console.warn(e);
        Alert.alert("Error", "Something went wrong, try again later.");
    }
    const loginPassword = async () => {
        try {
            const result = await auth.mfaLoginPassword(username, password);
            if (result.status === "invalid") {
                Alert.alert("Error", "Invalid username or password");
            }
        } catch (e) {
            handleError(e);
        }
    }

    // !!!For test only
    useEffect(() => {
        setUsername("user@mail.com");
        setPassword("password");
        setOtp("4332");
    })

    const loginOtp = async () => {
        try {
            const result = await auth.mfaLoginOtp(otp);
            if (result.status === "invalid") {
                Alert.alert("Error", "Invalid OTP");
            }
        } catch (e) {
            handleError(e);
        }
    }

    const renderPasswordLogin = () => {
        return (
            <>
                <Text style={styles.title}>Enter username and password:</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    placeholder="Username"
                    autoCompleteType="username"
                    keyboardType="email-address"
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    placeholder="Password"
                    autoCompleteType="password"
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <View style={styles.button}>
                    <Button
                        color="darkcyan"
                        title="Login"
                        onPress={loginPassword}
                    />
                </View>
            </>
        );
    }

    const renderOtpLogin = () => {
        return (
            <>
                <Text style={styles.title}>Enter OTP sent to your email:</Text>
                <TextInput
                    style={styles.input}
                    value={otp}
                    keyboardType="number-pad"
                    onChangeText={setOtp}
                    secureTextEntry={true}
                />
                <View style={styles.button}>
                    <Button
                        color="darkcyan"
                        title="Login"
                        onPress={loginOtp}
                    />
                </View>
            </>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {!auth.loginSessionToken ?
                    renderPasswordLogin()
                    :
                    renderOtpLogin()
                }
            </View>
        </View>
    )

});

const styles = StyleSheet.create({
    container: {
        padding: 40,
        flex: 1,
        justifyContent: "center"
    },
    card: {
        padding: 20,
        borderRadius: 4,

        backgroundColor: "white"
    },
    title: {
        fontSize: 16
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