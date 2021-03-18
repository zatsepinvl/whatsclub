import React, {PureComponent} from "react";
import {AppRegistry, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {RNCamera} from "react-native-camera";

const WEBAPP_QRLOGIN_SCREEN_NAME = "WebAppQRLogin";

function WebAppQrLogin() {
    const onBarCodeRead = (event) => {
       /* if (type !== "QR_CODE") {
            return;
        }*/
        console.log(event);
        //console.log("data", data);
    }
    return (
        <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
                title: "Permission to use camera",
                message: "We need your permission to use your camera",
                buttonPositive: "Ok",
                buttonNegative: "Cancel",
            }}
            androidRecordAudioPermissionOptions={{
                title: "Permission to use audio recording",
                message: "We need your permission to use your audio",
                buttonPositive: "Ok",
                buttonNegative: "Cancel",
            }}
            onBarCodeRead={onBarCodeRead}
            onGoogleVisionBarcodesDetected={({barcodes}) => {
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});

export {
    WebAppQrLogin,
    WEBAPP_QRLOGIN_SCREEN_NAME
}