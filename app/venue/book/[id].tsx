import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_VENUES } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRequireAuth } from '@/hooks/use-require-auth';

// Generate some upcoming dates for mockup
const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push({
            id: d.toISOString(),
            dateObj: d,
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateNum: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' })
        });
    }
    return dates;
};

export default function BookSlotScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { user } = useRequireAuth();

    const venue = MOCK_VENUES.find(v => v.id === id);
    const [dates] = useState(getUpcomingDates());
    const [selectedDate, setSelectedDate] = useState(dates[0].id);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    if (!user) return null; // redirect in progress


    if (!venue) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ color: theme.text }}>Venue not found</Text>
            </View>
        );
    }

    const toggleSlot = (slotId: string) => {
        setSelectedSlots(prev =>
            prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
        );
    };

    const calculateTotal = () => {
        return selectedSlots.length * venue.pricePerHour;
    };

    const handleConfirmBooking = () => {
        if (selectedSlots.length === 0) return;
        // In a real app we'd pass slot data or create a pending booking. 
        // For now, pass venueId string array of slotIds.
        router.push({
            pathname: '/booking/confirm/[id]',
            params: {
                id: venue.id,
                slots: selectedSlots.join(','),
                date: selectedDate
            }
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <IconSymbol name="chevron.left" size={24} color={theme.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Select Slot</Text>
                <View style={{ width: 24 }} /> {/* align center */}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.venueName, { color: theme.text }]}>{venue.name}</Text>
                <Text style={[styles.location, { color: theme.icon }]}>{venue.location}</Text>

                {/* Date Picker */}
                <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesContainer}>
                    {dates.map((d) => {
                        const isSelected = selectedDate === d.id;
                        return (
                            <Pressable
                                key={d.id}
                                style={[
                                    styles.dateCard,
                                    {
                                        backgroundColor: isSelected ? theme.tint : theme.icon + '15',
                                        borderColor: isSelected ? theme.tint : 'transparent',
                                        borderWidth: 1
                                    }
                                ]}
                                onPress={() => setSelectedDate(d.id)}
                            >
                                <Text style={[styles.dayName, { color: isSelected ? '#fff' : theme.icon }]}>{d.dayName}</Text>
                                <Text style={[styles.dateNum, { color: isSelected ? '#fff' : theme.text }]}>{d.dateNum}</Text>
                                <Text style={[styles.dayName, { color: isSelected ? '#fff' : theme.icon }]}>{d.month}</Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Time Slots */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Slots</Text>
                <View style={styles.slotsGrid}>
                    {venue.slots.map((slot) => {
                        const isSelected = selectedSlots.includes(slot.id);
                        const isAvailable = slot.isAvailable;

                        return (
                            <Pressable
                                key={slot.id}
                                disabled={!isAvailable}
                                style={[
                                    styles.slotCard,
                                    {
                                        backgroundColor: isSelected
                                            ? theme.tint
                                            : isAvailable
                                                ? theme.background
                                                : theme.icon + '20',
                                        borderColor: isSelected
                                            ? theme.tint
                                            : theme.icon + '40',
                                        opacity: isAvailable ? 1 : 0.6
                                    }
                                ]}
                                onPress={() => toggleSlot(slot.id)}
                            >
                                <Text style={[
                                    styles.slotTime,
                                    {
                                        color: isSelected
                                            ? '#fff'
                                            : isAvailable
                                                ? theme.text
                                                : theme.icon
                                    }
                                ]}>
                                    {slot.time}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

            </ScrollView>

            {/* Checkout Bar */}
            {selectedSlots.length > 0 && (
                <View style={[styles.bottomBar, { borderTopColor: theme.icon + '20', backgroundColor: theme.background }]}>
                    <View>
                        <Text style={[styles.summaryText, { color: theme.icon }]}>{selectedSlots.length} slot(s) selected</Text>
                        <Text style={[styles.totalPrice, { color: theme.text }]}>₹{calculateTotal()}</Text>
                    </View>
                    <Pressable
                        style={[styles.confirmButton, { backgroundColor: theme.tint }]}
                        onPress={handleConfirmBooking}
                    >
                        <Text style={styles.confirmButtonText}>Continue</Text>
                    </Pressable>
                </View>
            )}
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
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    venueName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 24,
    },
    datesContainer: {
        gap: 12,
        paddingRight: 20,
    },
    dateCard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        width: 70,
    },
    dayName: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    dateNum: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    slotCard: {
        width: '30%', // ~3 columns
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
    },
    slotTime: {
        fontSize: 14,
        fontWeight: '600',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 34,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    summaryText: {
        fontSize: 14,
        marginBottom: 2,
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: '800',
    },
    confirmButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 100,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
