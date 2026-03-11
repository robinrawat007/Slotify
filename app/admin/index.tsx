import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function AdminDashboardScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { user } = useRequireAuth({ adminOnly: true });

    if (!user) return null; // redirect in progress

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <IconSymbol name="chevron.left" size={24} color={theme.text} />
                </Pressable>
                <Text style={[styles.title, { color: theme.text }]}>Admin Dashboard</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.statsContainer}>
                    <View style={[styles.statBox, { backgroundColor: theme.tint + '15' }]}>
                        <Text style={[styles.statValue, { color: theme.tint }]}>12</Text>
                        <Text style={[styles.statLabel, { color: theme.icon }]}>Bookings Today</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: theme.tint + '15' }]}>
                        <Text style={[styles.statValue, { color: theme.tint }]}>₹14.5k</Text>
                        <Text style={[styles.statLabel, { color: theme.icon }]}>Revenue</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>My Venues</Text>

                <View style={[styles.venueCard, { borderColor: theme.icon + '20' }]}>
                    <View style={styles.venueInfo}>
                        <Text style={[styles.venueName, { color: theme.text }]}>Greenfield Sports Arena</Text>
                        <Text style={[styles.venueLocation, { color: theme.icon }]}>Gurgaon</Text>
                    </View>
                    <Pressable style={[styles.manageBtn, { backgroundColor: theme.tint }]}>
                        <Text style={styles.manageBtnText}>Manage Slots</Text>
                    </Pressable>
                </View>

                <Pressable style={[styles.addVenueBtn, { borderColor: theme.tint, borderStyle: 'dashed' }]}>
                    <IconSymbol name="plus" size={20} color={theme.tint} />
                    <Text style={[styles.addVenueText, { color: theme.tint }]}>Add New Venue</Text>
                </Pressable>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Notifications</Text>
                <View style={[styles.notificationCard, { backgroundColor: theme.icon + '10' }]}>
                    <IconSymbol name="bell.fill" size={20} color={theme.tint} />
                    <View style={styles.notificationTextContainer}>
                        <Text style={[styles.notificationText, { color: theme.text }]}>New booking from User A.</Text>
                        <Text style={[styles.notificationTime, { color: theme.icon }]}>5 mins ago</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 8,
    },
    venueCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
    },
    venueInfo: {
        flex: 1,
    },
    venueName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    venueLocation: {
        fontSize: 12,
    },
    manageBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    manageBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    addVenueBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 24,
        gap: 8,
    },
    addVenueText: {
        fontSize: 16,
        fontWeight: '600',
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
    },
    notificationTextContainer: {
        flex: 1,
    },
    notificationText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    notificationTime: {
        fontSize: 12,
    },
});
