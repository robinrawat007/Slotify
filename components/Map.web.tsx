import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Map({ venues, onMarkerPress }: any) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.webMapFallback}>
            <IconSymbol name="map.fill" size={64} color={theme.icon} />
            <Text style={[styles.webMapText, { color: theme.text }]}>
                Interactive Maps are only available on the mobile app.
            </Text>
            <Text style={{ color: theme.icon, marginTop: 8 }}>
                Download Slotify on iOS or Android to see venue locations.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    webMapFallback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#00000005',
        minHeight: 400,
    },
    webMapText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
    },
});
