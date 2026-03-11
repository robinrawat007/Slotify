import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView, Platform, StatusBar, Alert, RefreshControl } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_VENUES } from '@/constants/mockData';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useRequireAuth } from '@/hooks/use-require-auth';

// Mock Bookings Data
const MOCK_BOOKINGS = [
    {
        id: 'b1',
        venue: MOCK_VENUES[0],
        date: new Date(Date.now() + 86400000).toISOString(),
        slots: ['06:00 PM', '07:00 PM'],
        status: 'upcoming', // upcoming, past, cancelled
        totalAmount: 2400
    },
    {
        id: 'b2',
        venue: MOCK_VENUES[1],
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        slots: ['06:00 AM'],
        status: 'past',
        totalAmount: 800
    },
    {
        id: 'b3',
        venue: MOCK_VENUES[2],
        date: new Date(Date.now() - 86400000 * 10).toISOString(),
        slots: ['07:00 PM'],
        status: 'cancelled',
        totalAmount: 1500
    }
];

type TabType = 'upcoming' | 'past' | 'cancelled';

export default function BookingsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { user } = useRequireAuth();
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [refreshing, setRefreshing] = useState(false);

    if (!user) return null; // redirect in progress

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const filteredBookings = bookings.filter(b => b.status === activeTab);

    const handleCancelBooking = (bookingId: string) => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking? A 10% cancellation fee will be deducted from your refund.',
            [
                { text: 'Keep Booking', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => {
                        setBookings(prev => prev.map(b =>
                            b.id === bookingId ? { ...b, status: 'cancelled' } : b
                        ));
                    }
                }
            ]
        );
    };

    const renderBookingCard = (booking: typeof MOCK_BOOKINGS[0]) => {
        const venue = booking.venue;
        const dateObj = new Date(booking.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        let statusColor = theme.tint;
        if (booking.status === 'past') statusColor = theme.icon;
        if (booking.status === 'cancelled') statusColor = '#EF4444'; // Red

        return (
            <View key={booking.id} style={[styles.card, { backgroundColor: theme.background, borderColor: theme.icon + '20' }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.venueName, { color: theme.text }]}>{venue.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {booking.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.detailRow}>
                        <IconSymbol name="calendar" size={16} color={theme.icon} />
                        <Text style={[styles.detailText, { color: theme.text }]}>{dateStr}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol name="clock" size={16} color={theme.icon} />
                        <Text style={[styles.detailText, { color: theme.text }]}>{booking.slots.join(', ')}</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={[styles.totalText, { color: theme.text }]}>Total Paid: ₹{booking.totalAmount + 20}</Text>
                    {booking.status === 'upcoming' && (
                        <Pressable style={styles.cancelBtn} onPress={() => handleCancelBooking(booking.id)}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>
                    )}
                    {booking.status === 'past' && (
                        <Pressable
                            style={[styles.rebookBtn, { backgroundColor: theme.tint }]}
                            onPress={() => router.push({ pathname: '/venue/[id]', params: { id: venue.id } })}
                        >
                            <Text style={styles.rebookBtnText}>Rebook</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>My Bookings</Text>
            </View>

            <View style={styles.tabsContainer}>
                {(['upcoming', 'past', 'cancelled'] as TabType[]).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <Pressable
                            key={tab}
                            style={[
                                styles.tabTextContainer,
                                isActive && { borderBottomColor: theme.tint, borderBottomWidth: 2 }
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[
                                styles.tabText,
                                { color: isActive ? theme.tint : theme.icon, fontWeight: isActive ? 'bold' : '500' }
                            ]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <FlatList
                data={filteredBookings}
                keyExtractor={item => item.id}
                renderItem={({ item }) => renderBookingCard(item)}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <IconSymbol name="calendar.badge.exclamationmark" size={48} color={theme.icon} />
                        <Text style={[styles.emptyText, { color: theme.icon }]}>No {activeTab} bookings found</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
    },
    tabTextContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    tabText: {
        fontSize: 15,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    venueName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardBody: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        fontSize: 14,
        marginLeft: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#00000010',
        paddingTop: 12,
    },
    totalText: {
        fontSize: 14,
        fontWeight: '600',
    },
    cancelBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    cancelBtnText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '600',
    },
    rebookBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    rebookBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
});
