import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function NotificationsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const MOCK_NOTIFICATIONS = [
        {
            id: '1',
            title: 'Booking Confirmed! ✅',
            body: 'Your booking for 5v5 Weekend Kickoff at Greenfield Sports Arena is confirmed.',
            time: '10 Mins Ago',
            read: false,
            icon: 'checkmark.circle.fill',
            color: '#1DB954'
        },
        {
            id: '2',
            title: 'Match Reminder ⚽',
            body: 'Your match starts in 2 hours at The Dugout. Don\'t forget your gear!',
            time: '2 Hours Ago',
            read: false,
            icon: 'clock.fill',
            color: '#F59E0B'
        },
        {
            id: '3',
            title: 'New Review!',
            body: 'Sara left a 4-star review for Greenfield Sports Arena.',
            time: '1 Day Ago',
            read: true,
            icon: 'star.fill',
            color: '#FFD700'
        }
    ];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <IconSymbol name="chevron.left" size={24} color={theme.text} />
                </Pressable>
                <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {MOCK_NOTIFICATIONS.map(notification => (
                    <View
                        key={notification.id}
                        style={[
                            styles.notificationCard,
                            { backgroundColor: notification.read ? theme.background : theme.icon + '10' }
                        ]}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: notification.color + '20' }]}>
                            <IconSymbol name={notification.icon as any} size={24} color={notification.color} />
                        </View>
                        <View style={styles.notificationText}>
                            <Text style={[styles.notificationTitle, { color: theme.text }]}>{notification.title}</Text>
                            <Text style={[styles.notificationBody, { color: theme.text }]}>{notification.body}</Text>
                            <Text style={[styles.notificationTime, { color: theme.icon }]}>{notification.time}</Text>
                        </View>
                        {!notification.read && <View style={[styles.unreadDot, { backgroundColor: theme.tint }]} />}
                    </View>
                ))}
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
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    notificationText: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    notificationBody: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
        marginBottom: 8,
    },
    notificationTime: {
        fontSize: 12,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 6,
        marginLeft: 8,
    },
});
