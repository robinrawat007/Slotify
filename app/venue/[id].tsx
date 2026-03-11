import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Platform, StatusBar, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_VENUES } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function VenueDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const venue = MOCK_VENUES.find(v => v.id === id);

    if (!venue) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ color: theme.text }}>Venue not found</Text>
                <Pressable onPress={() => router.back()} style={styles.backBtnError}>
                    <Text style={{ color: theme.tint }}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${venue.name} on Slotify! It's a fantastic spot for ${venue.sports.join(', ')} located at ${venue.location}.`,
                title: venue.name,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView bounces={false} style={styles.container} contentContainerStyle={styles.scrollContent}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: venue.image }} style={styles.image} />
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <IconSymbol name="chevron.left" size={24} color="#000" />
                    </Pressable>
                    <Pressable
                        style={styles.shareButton}
                        onPress={handleShare}
                    >
                        <IconSymbol name="square.and.arrow.up" size={20} color="#000" />
                    </Pressable>
                </View>

                {/* Info Section */}
                <View style={[styles.infoSection, { backgroundColor: theme.background }]}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.name, { color: theme.text }]}>{venue.name}</Text>
                        <View style={styles.ratingBadge}>
                            <IconSymbol name="star.fill" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{venue.rating}</Text>
                            <Text style={styles.reviewsText}>({venue.reviews})</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <IconSymbol name="mappin.and.ellipse" size={18} color={theme.icon} />
                        <Text style={[styles.locationText, { color: theme.icon }]}>
                            {venue.location} • <Text style={{ color: theme.tint }}>{venue.distance}</Text>
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Sports</Text>
                    <View style={styles.sportsContainer}>
                        {venue.sports.map(sport => (
                            <View key={sport} style={[styles.sportTag, { backgroundColor: theme.tint + '20' }]}>
                                <Text style={[styles.sportTagText, { color: theme.tint }]}>{sport}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
                    <Text style={[styles.aboutText, { color: theme.text }]}>
                        Experience top-tier facilities at {venue.name}. Perfect for both casual games and competitive matches. Well-maintained turf, floodlights for night gameplay, and ample parking available.
                    </Text>

                    <View style={styles.divider} />

                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Ratings & Reviews</Text>
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?u=foo' }} style={styles.reviewerAvatar} />
                            <View>
                                <Text style={[styles.reviewerName, { color: theme.text }]}>Alex Johnson</Text>
                                <View style={styles.reviewStars}>
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <Text style={[styles.reviewDate, { color: theme.icon }]}> • 2 days ago</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.reviewText, { color: theme.text }]}>
                            Great venue, the turf is well maintained and the lighting at night is perfect. Definitely coming back.
                        </Text>
                    </View>

                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?u=bar' }} style={styles.reviewerAvatar} />
                            <View>
                                <Text style={[styles.reviewerName, { color: theme.text }]}>Sara Parker</Text>
                                <View style={styles.reviewStars}>
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <IconSymbol name="star.fill" size={12} color="#FFD700" />
                                    <IconSymbol name="star" size={12} color="#FFD700" />
                                    <Text style={[styles.reviewDate, { color: theme.icon }]}> • 1 week ago</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.reviewText, { color: theme.text }]}>
                            Good experience overall, but the parking was a bit quite crowded on the weekend.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { borderTopColor: theme.icon + '20', backgroundColor: theme.background }]}>
                <View>
                    <Text style={[styles.pricePrefix, { color: theme.icon }]}>Price per hour</Text>
                    <Text style={[styles.priceTag, { color: theme.text }]}>₹{venue.pricePerHour}</Text>
                </View>
                <Pressable
                    style={[styles.bookButton, { backgroundColor: theme.tint }]}
                    onPress={() => router.push({ pathname: '/venue/book/[id]', params: { id: venue.id } })}
                >
                    <Text style={styles.bookButtonText}>Book Slot</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtnError: {
        marginTop: 16,
        padding: 12,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoSection: {
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 12,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
        color: '#000',
    },
    reviewsText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 15,
        marginLeft: 8,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    sportsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    sportTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    sportTagText: {
        fontSize: 14,
        fontWeight: '600',
    },
    aboutText: {
        fontSize: 15,
        lineHeight: 24,
        opacity: 0.8,
    },
    bottomBar: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
    },
    pricePrefix: {
        fontSize: 12,
        marginBottom: 2,
    },
    priceTag: {
        fontSize: 22,
        fontWeight: '800',
    },
    bookButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 100,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    reviewCard: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#00000005',
        marginBottom: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    reviewStars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewDate: {
        fontSize: 12,
        marginLeft: 8,
    },
    reviewText: {
        fontSize: 14,
        lineHeight: 22,
        opacity: 0.8,
    },
});
