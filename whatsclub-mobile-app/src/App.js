/**
 * @format
 * @flow strict-local
 */
import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, SafeAreaView } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});


const App: () => React$Node = () => {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('https://reactnative.dev/movies.json')
            .then((response) => response.json())
            .then((json) => setData(json.movies))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={[styles.horizontal]}>
                <ActivityIndicator />
                <ActivityIndicator size="large" />
                <ActivityIndicator size="small" color="#000000" />
                <ActivityIndicator size="large" color="blue" />
            </View>
        </SafeAreaView>
    );
};

export default App;
