import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {RNCamera} from "react-native-camera";
import {useWebapp} from "../Stores";

const WEBAPP_QRLOGIN_SCREEN_NAME = "WebAppQRLogin";

function WebAppQrLogin({navigation}) {
    const webappStore = useWebapp();
    const onBarCodeRead = async (qrCode) => {
        const data = JSON.parse(qrCode.data);
        await webappStore.acceptWebappQrLogin(data.sessionId)
            .then(console.log);
        navigation.goBack();
    }
    return (
        <>
            <RNCamera
                style={styles.camera}
                type={RNCamera.Constants.Type.back}
                onBarCodeRead={onBarCodeRead}
                onGoogleVisionBarcodesDetected={({barcodes}) => {
                }}
            />
            {/*{qrCode &&
            <View style={{
                borderWidth: 2,
                borderRadius: 10,
                position: 'absolute',
                borderColor: '#F00',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: 10,
                width: qrCode.bounds.width,
                height: qrCode.bounds.height,
                left: qrCode.bounds.origin[2].x,
                top: qrCode.bounds.origin[2].y,
            }}
            >
                <Text style={{
                    color: '#F00',
                    flex: 1,
                    position: 'absolute',
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                }}>{qrCode.data}</Text>
            </View>
            }*/}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    camera: {
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