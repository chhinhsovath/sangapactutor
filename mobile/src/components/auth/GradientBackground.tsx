import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface GradientBackgroundProps {
    children: React.ReactNode;
}

export default function GradientBackground({ children }: GradientBackgroundProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Decorative circles */}
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
                <View style={[styles.circle, styles.circle3]} />
                
                {children}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        position: 'relative',
    },
    circle: {
        position: 'absolute',
        borderRadius: 9999,
        opacity: 0.1,
        backgroundColor: '#ffffff',
    },
    circle1: {
        width: width * 0.7,
        height: width * 0.7,
        top: -width * 0.3,
        right: -width * 0.2,
    },
    circle2: {
        width: width * 0.5,
        height: width * 0.5,
        bottom: -width * 0.15,
        left: -width * 0.15,
    },
    circle3: {
        width: width * 0.4,
        height: width * 0.4,
        top: height * 0.4,
        left: -width * 0.1,
    },
});
