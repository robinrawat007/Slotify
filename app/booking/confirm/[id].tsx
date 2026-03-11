import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVenue } from '@/hooks/use-venues';
import { useBookings } from '@/hooks/use-bookings';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function BookingConfirmScreen() {
    const { id, slots, date } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const { venue, loading: venueLoading } = useVenue(id as string);
    const { createBooking } = useBookings();
    const [isBooking, setIsBooking] = useState(false);

    const selectedSlots = typeof slots === 'string' ? slots.split(',') : [];

    if (venueLoading) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    if (!venue || selectedSlots.length === 0) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Invalid booking details</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
                    <Text style={{ color: theme.tint }}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const dateObj = new Date(typeof date === 'string' ? date : Date.now());
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    // Find slot times from fetched venue data
    const slotTimes = selectedSlots.map(sId => {
        const s = venue.slots.find(x => x.id === sId);
        return s ? s.time : sId;
    });

    const totalAmount = selectedSlots.length * venue.pricePerHour;
    const totalPayable = totalAmount + 20;

    const handleConfirm = async () => {
        setIsBooking(true);
        const { data, error } = await createBooking({
            venueId: venue.id,
            slotIds: selectedSlots,
            date: typeof date === 'string' ? date : new Date().toISOString().split('T')[0],
            totalAmount: totalPayable
        });

        setIsBooking(false);

        if (error) {
            Alert.alert('Booking Failed', error);
        } else {
            // Success! Direct to a mock payment/success screen for now
            router.push({
                pathname: '/booking/payment/[id]',
                params: { id: data as string, amount: totalPayable.toString(), bookingId: data as string }
            });
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <IconSymbol name="chevron.left" size={24} color={theme.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Confirm Booking</Text>
                <View style={{ width: 24 }} /> {/* align center */}
            </View>

            <View style={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.icon + '10' }]}>
                    <Text style={[styles.venueName, { color: theme.text }]}>{venue.name}</Text>
                    <Text style={[styles.location, { color: theme.icon }]}>{venue.location}</Text>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <IconSymbol name="calendar" size={20} color={theme.icon} />
                        <Text style={[styles.detailText, { color: theme.text }]}>{dateStr}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <IconSymbol name="clock" size={20} color={theme.icon} />
                        <Text style={[styles.detailText, { color: theme.text }]}>{slotTimes.join(', ')}</Text>
                    </View>
                </View>

                <View style={[styles.priceCard, { backgroundColor: theme.icon + '10' }]}>
                    <Text style={[styles.priceHeader, { color: theme.text }]}>Payment Summary</Text>

                    <View style={styles.priceRow}>
                        <Text style={[styles.priceLabel, { color: theme.text }]}>Booking Fee ({selectedSlots.length} slots)</Text>
                        <Text style={[styles.priceValue, { color: theme.text }]}>₹{totalAmount}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={[styles.priceLabel, { color: theme.text }]}>Platform Fee</Text>
                        <Text style={[styles.priceValue, { color: theme.text }]}>₹20</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.priceRow}>
                        <Text style={[styles.totalLabel, { color: theme.text }]}>Total Payable</Text>
                        <Text style={[styles.totalValue, { color: theme.tint }]}>₹{totalAmount + 20}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.bottomBar, { borderTopColor: theme.icon + '20', backgroundColor: theme.background }]}>
                <Pressable
                    style={[styles.payButton, { backgroundColor: theme.tint, opacity: isBooking ? 0.7 : 1 }]}
                    onPress={handleConfirm}
                    disabled={isBooking}
                >
                    {isBooking ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payButtonText}>Confirm & Pay ₹{totalAmount + 20}</Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
    },
    venueName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#00000015',
        marginVertical: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
    priceCard: {
        padding: 20,
        borderRadius: 16,
    },
    priceHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    priceLabel: {
        fontSize: 15,
    },
    priceValue: {
        fontSize: 15,
        fontWeight: '500',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 34,
        borderTopWidth: 1,
    },
    payButton: {
        paddingVertical: 16,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
