import React, {useEffect, useState} from "react";
import {ActivityIndicator, StyleSheet, Text, View, SafeAreaView, Button} from "react-native";
import {useAuth} from "../UseStore";
import {WEBAPP_QRLOGIN_SCREEN_NAME} from "../webapp/WebAppQrLogin";

const HomeScreen = ({navigation}) => {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const auth = useAuth();


    useEffect(() => {
        auth.login().then(console.log);
    })

    const goToWebAppQrLogin = () => {
        navigation.navigate(WEBAPP_QRLOGIN_SCREEN_NAME);
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.vertical}>
                <Button title="WhatsClub Web" onPress={goToWebAppQrLogin}/>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    vertical: {
        flexDirection: "column",
        justifyContent: "space-around",
        padding: 10
    }
});

export default HomeScreen;