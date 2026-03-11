import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

export function SplashScreenOverlay({ onFinish }: SplashScreenProps) {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
        // Fade + scale in
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Hold for 800ms, then fade out
            setTimeout(() => {
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(onFinish);
            }, 800);
        });
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <Animated.Image
                source={require('@/assets/images/logo.png')}
                style={[
                    styles.logo,
                    { transform: [{ scale }] }
                ]}
                resizeMode="contain"
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        width,
        height,
    },
    logo: {
        width: 240,
        height: 240,
    },
});
