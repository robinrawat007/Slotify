import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = {
    name: string;
    avatarUrl?: string | null;
    size?: number;
};

/**
 * Avatar — shows profile picture if available, otherwise
 * displays a coloured circle with the user's initials.
 */
export const Avatar = memo(function Avatar({ name, avatarUrl, size = 56 }: Props) {
    const initials = name
        .split(' ')
        .map(w => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Generate a consistent hue from the name string
    const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    const bg = `hsl(${hue}, 55%, 45%)`;
    const fontSize = size * 0.38;

    if (avatarUrl) {
        return (
            <Image
                source={{ uri: avatarUrl }}
                style={[styles.img, { width: size, height: size, borderRadius: size / 2 }]}
                contentFit="cover"
            />
        );
    }

    return (
        <View style={[styles.initials, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
            <Text style={[styles.text, { fontSize }]}>{initials}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    img: {
        backgroundColor: '#ccc',
    },
    initials: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: '700',
        letterSpacing: 1,
    },
});
