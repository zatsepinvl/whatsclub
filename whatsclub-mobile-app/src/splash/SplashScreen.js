import * as React from 'react';
import {View, Text, StyleSheet} from "react-native";

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>WhatsClubb</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        textAlign: "center",
        color: "darkcyan",
        fontWeight: "400",
    }
});

export default SplashScreen;