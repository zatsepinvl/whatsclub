import React, {useState} from "react";
import {View, Text, StyleSheet, Vibration, Alert} from "react-native";
import {RNCamera} from "react-native-camera";
import {useWebapp} from "../store/Stores";

function WebAppQrLoginScreen({navigation}) {
    const webappStore = useWebapp();
    const [handled, setHandled] = useState();

    const onBarCodeRead = async (qrCode) => {
        if (handled) return;
        if (!qrCode.data) return;
        let data;
        try {
            data = JSON.parse(qrCode.data);
        } catch (e) {
            Alert.alert("Error", "Unsupported read QR code");
            return;
        }
        if (data.action !== "login:qr") {
            Alert.alert("Error", `Unknown action: ${data.action}`);
            return;
        }
        await webappStore.acceptWebappQrLogin(data.sessionId);
        Vibration.vibrate(600);
        setHandled(true);
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>To use WhatsClubb Web, go to web.whatsclubb.com on you computer</Text>
            </View>
            <RNCamera
                style={styles.camera}
                type={RNCamera.Constants.Type.back}
                onBarCodeRead={onBarCodeRead}
                captureAudio={false}
            >
                <View style={{flex: 1, flexDirection: "column"}}>
                    <View style={[{flex: 0.6}, styles.captureBlur]}/>
                    <View style={{flex: 2, flexDirection: "row"}}>
                        <View style={[{flex: 1}, styles.captureBlur]}/>
                        <View style={[{flex: 5}, styles.captureBox]}/>
                        <View style={[{flex: 1}, styles.captureBlur]}/>
                    </View>
                    <View style={[{flex: 1.4}, styles.captureBlur]}/>
                </View>
            </RNCamera>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 100,
        padding: 10,
        paddingTop: 22
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "200",
    },
    camera: {
        flex: 1,
    },
    captureBlur: {
        backgroundColor: "white",
        opacity: 0.6
    },
    captureBox: {
        borderColor: "darkcyan",
        borderRadius: 2,
        borderWidth: 2,
        zIndex: 9,
        margin: -2,
    }
});

export {
    WebAppQrLoginScreen
}