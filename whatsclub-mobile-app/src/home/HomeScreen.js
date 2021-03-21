import React, {useEffect} from "react";
import {Text, StyleSheet, View, Button} from "react-native";
import {useAuth} from "../store/Stores";
import {WEBAPP_QRLOGIN_SCREEN_NAME} from "../navigation/NavigationConsts";

const HomeScreen = ({navigation}) => {
    const auth = useAuth();

    const goToWebAppQrLogin = () => {
        navigation.navigate(WEBAPP_QRLOGIN_SCREEN_NAME);
    }

    const logout = () => {
        auth.logout();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Welcome, {auth.user.username}!
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="WhatsClubb Web"
                    color="darkcyan"
                    onPress={goToWebAppQrLogin}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Logout"
                    color="darkcyan"
                    onPress={logout}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
        padding: 10
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "300",
    },
    buttonContainer: {
        marginTop: 40
    },
});

export default HomeScreen;