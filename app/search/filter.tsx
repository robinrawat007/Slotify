import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const SPORTS = ['Football', 'Cricket', 'Tennis', 'Badminton', 'Basketball'];
const DISTANCES = ['< 2km', '< 5km', '< 10km', 'Anywhere'];
const PRICES = ['< ₹500', '₹500 - ₹1000', '> ₹1000'];

export default function FilterModalScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [selectedSports, setSelectedSports] = useState<string[]>([]);
    const [selectedDistance, setSelectedDistance] = useState('Anywhere');
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    const toggleSport = (sport: string) => {
        setSelectedSports(prev =>
            prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
        );
    };

    const handleApply = () => {
        // In a real app we would pass these back via context or router params
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
                <Pressable onPress={() => router.back()} style={styles.closeBtn}>
                    <IconSymbol name="xmark" size={24} color={theme.icon} />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Sports */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Sports</Text>
                <View style={styles.chipGrid}>
                    {SPORTS.map(sport => {
                        const isSelected = selectedSports.includes(sport);
                        return (
                            <Pressable
                                key={sport}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: isSelected ? theme.tint : theme.icon + '15',
                                        borderColor: isSelected ? theme.tint : 'transparent'
                                    }
                                ]}
                                onPress={() => toggleSport(sport)}
                            >
                                <Text style={[styles.chipText, { color: isSelected ? '#fff' : theme.text }]}>
                                    {sport}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.divider} />

                {/* Distance */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Distance</Text>
                <View style={styles.chipGrid}>
                    {DISTANCES.map(dist => {
                        const isSelected = selectedDistance === dist;
                        return (
                            <Pressable
                                key={dist}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: isSelected ? theme.tint : theme.icon + '15',
                                        borderColor: isSelected ? theme.tint : 'transparent'
                                    }
                                ]}
                                onPress={() => setSelectedDistance(dist)}
                            >
                                <Text style={[styles.chipText, { color: isSelected ? '#fff' : theme.text }]}>
                                    {dist}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.divider} />

                {/* Price */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Price range (per hr)</Text>
                <View style={styles.chipGrid}>
                    {PRICES.map(price => {
                        const isSelected = selectedPrice === price;
                        return (
                            <Pressable
                                key={price}
                                style={[
                                    styles.chip,
                                    {
                                        backgroundColor: isSelected ? theme.tint : theme.icon + '15',
                                        borderColor: isSelected ? theme.tint : 'transparent'
                                    }
                                ]}
                                onPress={() => setSelectedPrice(isSelected ? null : price)}
                            >
                                <Text style={[styles.chipText, { color: isSelected ? '#fff' : theme.text }]}>
                                    {price}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { borderTopColor: theme.icon + '20', backgroundColor: theme.background }]}>
                <Pressable
                    style={styles.clearBtn}
                    onPress={() => {
                        setSelectedSports([]);
                        setSelectedDistance('Anywhere');
                        setSelectedPrice(null);
                    }}
                >
                    <Text style={[styles.clearBtnText, { color: theme.text }]}>Clear All</Text>
                </Pressable>
                <Pressable
                    style={[styles.applyBtn, { backgroundColor: theme.tint }]}
                    onPress={handleApply}
                >
                    <Text style={styles.applyBtnText}>Show Results</Text>
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
        justifyContent: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
        position: 'relative',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeBtn: {
        position: 'absolute',
        right: 16,
        padding: 8,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#00000010',
        marginVertical: 24,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
    },
    clearBtn: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    clearBtnText: {
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    applyBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginLeft: 16,
    },
    applyBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
