import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function TestScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Test Screen</Text>
            <Text>If you see this, the app is working!</Text>
            <Button mode="contained" onPress={() => console.log('Pressed')}>
                Test Button
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
