import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Venue } from '@/constants/types';

interface VenueCardProps {
    venue: Venue;
    onPress: () => void;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400';

export const VenueCard = memo(function VenueCard({ venue, onPress }: VenueCardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [imgError, setImgError] = useState(false);

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: theme.background },
                pressed && { opacity: 0.9 }
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Book ${venue.name}, rated ${venue.rating} stars`}
        >
            <Image
                source={{ uri: imgError ? PLACEHOLDER_IMAGE : venue.image }}
                style={styles.image}
                onError={() => setImgError(true)}
            />
            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{venue.name}</Text>
                    <View style={styles.ratingContainer}>
                        <IconSymbol name="star.fill" size={14} color="#FFD700" />
                        <Text style={[styles.ratingText, { color: theme.text }]}>{venue.rating}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <IconSymbol name="mappin.circle.fill" size={14} color={theme.icon} />
                    <Text style={[styles.locationText, { color: theme.icon }]} numberOfLines={1}>
                        {venue.location} • {venue.distance}
                    </Text>
                </View>

                <View style={styles.footerRow}>
                    <Text style={[styles.price, { color: theme.tint }]}>₹{venue.pricePerHour} <Text style={styles.priceUnit}>/ hr</Text></Text>
                    <View style={styles.sportsContainer}>
                        {venue.sports.slice(0, 2).map((sport: string) => (
                            <View key={sport} style={[styles.sportBadge, { backgroundColor: theme.icon + '20' }]}>
                                <Text style={[styles.sportText, { color: theme.text }]}>{sport}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Pressable>
    );
});



const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#eee',
    },
    infoContainer: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD70020',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationText: {
        fontSize: 14,
        marginLeft: 4,
        flex: 1,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    priceUnit: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#888',
    },
    sportsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    sportBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sportText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
