import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, Platform, StatusBar, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const SPORTS = ['Football', 'Cricket', 'Tennis', 'Badminton'];

export default function CreateMatchScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [title, setTitle] = useState('');
    const [selectedSport, setSelectedSport] = useState('Football');
    const [venue, setVenue] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('10');
    const [price, setPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = () => {
        if (!title.trim() || !venue.trim() || !price.trim() || !maxPlayers.trim()) {
            Alert.alert('Validation Error', 'Please fill out all required fields.');
            return;
        }

        const numericPrice = parseInt(price);
        const numericPlayers = parseInt(maxPlayers);

        if (isNaN(numericPrice) || numericPrice <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid amount for Price/Player.');
            return;
        }

        if (isNaN(numericPlayers) || numericPlayers < 2 || numericPlayers > 50) {
            Alert.alert('Validation Error', 'Players must be a valid number between 2 and 50.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert('Success', 'Match created successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        }, 1000);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <IconSymbol name="chevron.left" size={24} color={theme.text} />
                    </Pressable>
                    <Text style={[styles.title, { color: theme.text }]}>Host a Match</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.label, { color: theme.text }]}>Match Title</Text>
                    <TextInput
                        style={[styles.input, { borderColor: theme.icon + '30', color: theme.text }]}
                        placeholder="e.g. 5v5 Weekend Kickoff"
                        placeholderTextColor={theme.icon}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={[styles.label, { color: theme.text }]}>Sport</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll}>
                        {SPORTS.map(sport => (
                            <Pressable
                                key={sport}
                                style={[
                                    styles.sportChip,
                                    selectedSport === sport ? { backgroundColor: theme.tint, borderColor: theme.tint } : { borderColor: theme.icon + '30' }
                                ]}
                                onPress={() => setSelectedSport(sport)}
                            >
                                <Text style={{ color: selectedSport === sport ? '#fff' : theme.text }}>{sport}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <Text style={[styles.label, { color: theme.text }]}>Venue</Text>
                    <TextInput
                        style={[styles.input, { borderColor: theme.icon + '30', color: theme.text }]}
                        placeholder="Search venue name..."
                        placeholderTextColor={theme.icon}
                        value={venue}
                        onChangeText={setVenue}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={[styles.label, { color: theme.text }]}>Max Players</Text>
                            <TextInput
                                style={[styles.input, { borderColor: theme.icon + '30', color: theme.text }]}
                                keyboardType="numeric"
                                value={maxPlayers}
                                onChangeText={setMaxPlayers}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={[styles.label, { color: theme.text }]}>Price / Player</Text>
                            <TextInput
                                style={[styles.input, { borderColor: theme.icon + '30', color: theme.text }]}
                                placeholder="₹"
                                placeholderTextColor={theme.icon}
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                    </View>

                </ScrollView>
                <View style={[styles.footer, { borderTopColor: theme.icon + '20', backgroundColor: theme.background }]}>
                    <Pressable
                        style={[styles.submitBtn, { backgroundColor: theme.tint, opacity: (!title || !venue || !price) ? 0.5 : 1 }]}
                        onPress={handleCreate}
                        disabled={!title || !venue || !price || isSubmitting}
                    >
                        <Text style={styles.submitBtnText}>{isSubmitting ? 'Creating...' : 'Create Match'}</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    sportsScroll: {
        paddingVertical: 4,
        marginBottom: 8,
    },
    sportChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginRight: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    submitBtn: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
