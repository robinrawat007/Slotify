import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable, Image, Platform, StatusBar, RefreshControl } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_MATCHES } from '@/constants/mockData';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

export default function MatchesScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'discover' | 'my_matches'>('discover');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const renderItem = ({ item: match }: any) => (
        <View style={[styles.matchCard, { backgroundColor: theme.icon + '0A' }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.sportTag, { backgroundColor: theme.tint + '15' }]}>
                    <Text style={[styles.sportTagText, { color: theme.tint }]}>{match.sport}</Text>
                </View>
                <Text style={[styles.priceText, { color: theme.text }]}>₹{match.pricePerPlayer}/player</Text>
            </View>

            <Text style={[styles.matchTitle, { color: theme.text }]}>{match.title}</Text>

            <View style={styles.infoRow}>
                <IconSymbol name="map" size={14} color={theme.icon} />
                <Text style={[styles.infoText, { color: theme.icon }]}>{match.venueName}</Text>
            </View>
            <View style={styles.infoRow}>
                <IconSymbol name="calendar" size={14} color={theme.icon} />
                <Text style={[styles.infoText, { color: theme.icon }]}>{match.date} • {match.time}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <View style={styles.hostInfo}>
                    <Image source={{ uri: match.host.avatar }} style={styles.avatar} />
                    <View>
                        <Text style={[styles.hostName, { color: theme.text }]}>Hosted by {match.host.name}</Text>
                        <Text style={[styles.skillText, { color: theme.icon }]}>Skill: {match.skillLevel}</Text>
                    </View>
                </View>

                <View style={styles.joinContainer}>
                    <Text style={[styles.playersText, { color: theme.text }]}>
                        {match.playersJoined}/{match.maxPlayers} joined
                    </Text>
                    <Pressable
                        style={[styles.joinBtn, { backgroundColor: theme.tint }]}
                        onPress={() => router.push({ pathname: '/matches/chat/[id]', params: { id: match.id } })}
                    >
                        <Text style={styles.joinBtnText}>Join Match</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Community Matches</Text>
                <Pressable
                    style={[styles.createBtn, { backgroundColor: theme.tint }]}
                    onPress={() => router.push('/matches/create')}
                >
                    <IconSymbol name="plus" size={16} color="#fff" />
                    <Text style={styles.createBtnText}>Host</Text>
                </Pressable>
            </View>

            <View style={styles.tabContainer}>
                <Pressable
                    style={[styles.tab, activeTab === 'discover' && { borderBottomColor: theme.tint, borderBottomWidth: 2 }]}
                    onPress={() => setActiveTab('discover')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'discover' ? theme.tint : theme.icon }]}>Discover</Text>
                </Pressable>
                <Pressable
                    style={[styles.tab, activeTab === 'my_matches' && { borderBottomColor: theme.tint, borderBottomWidth: 2 }]}
                    onPress={() => setActiveTab('my_matches')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'my_matches' ? theme.tint : theme.icon }]}>My Matches</Text>
                </Pressable>
            </View>

            <FlatList
                data={activeTab === 'discover' ? MOCK_MATCHES : []}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <IconSymbol name="person.3.sequence.fill" size={48} color={theme.icon} />
                        <Text style={{ color: theme.icon, marginTop: 16 }}>You haven&apos;t joined any matches yet</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    createBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    matchCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sportTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sportTagText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    priceText: {
        fontWeight: '700',
    },
    matchTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    infoText: {
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#00000010',
        marginVertical: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hostInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    hostName: {
        fontSize: 12,
        fontWeight: '600',
    },
    skillText: {
        fontSize: 11,
    },
    joinContainer: {
        alignItems: 'flex-end',
    },
    playersText: {
        fontSize: 11,
        marginBottom: 4,
    },
    joinBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    joinBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
});
