import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, Platform, StatusBar, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ChatScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 'msg1',
            sender: 'Priya S.',
            text: 'Hey guys! Excited for the match this weekend.',
            time: '10:00 AM',
            isMe: false,
            isHost: true,
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
        },
        {
            id: 'msg2',
            sender: 'Rahul K.',
            text: 'Same here! I will bring the extra ball.',
            time: '10:05 AM',
            isMe: false,
            isHost: false,
            avatar: 'https://i.pravatar.cc/150?u=b042581f4e39026704d'
        }
    ]);

    const handleSend = () => {
        if (!message.trim()) return;

        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                sender: 'You',
                text: message.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true,
                isHost: false,
                avatar: 'https://i.pravatar.cc/150?u=my_avatar_url' // Just a mock
            }
        ]);
        setMessage('');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <IconSymbol name="chevron.left" size={24} color={theme.text} />
                    </Pressable>
                    <View style={styles.headerInfo}>
                        <Text style={[styles.title, { color: theme.text }]}>Lobby Chat</Text>
                        <Text style={[styles.subtitle, { color: theme.icon }]}>5v5 Weekend Kickoff ({messages.length + 3} joined)</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.chatArea} automaticallyAdjustKeyboardInsets>
                    {messages.map(msg => (
                        <View key={msg.id} style={[styles.messageWrapper, msg.isMe ? styles.messageMe : styles.messageThem]}>
                            {!msg.isMe && <Image source={{ uri: msg.avatar }} style={styles.avatar} />}
                            <View style={[
                                styles.bubble,
                                msg.isMe ? { backgroundColor: theme.tint, borderBottomRightRadius: 4 } : { backgroundColor: theme.icon + '20', borderBottomLeftRadius: 4 }
                            ]}
                            >
                                {!msg.isMe && (
                                    <Text style={[styles.senderName, msg.isHost && { color: theme.tint }]}>
                                        {msg.sender} {msg.isHost && '(Host)'}
                                    </Text>
                                )}
                                <Text style={[styles.messageText, { color: msg.isMe ? '#fff' : theme.text }]}>
                                    {msg.text}
                                </Text>
                                <Text style={[styles.timeText, { color: msg.isMe ? '#fff9' : theme.icon }]}>
                                    {msg.time}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={[styles.inputContainer, { borderTopColor: theme.icon + '20' }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.icon + '15', color: theme.text }]}
                        placeholder="Message the lobby..."
                        placeholderTextColor={theme.icon}
                        value={message}
                        onChangeText={setMessage}
                        onSubmitEditing={handleSend}
                    />
                    <Pressable
                        style={[styles.sendBtn, { backgroundColor: message.trim() ? theme.tint : theme.icon + '30' }]}
                        onPress={handleSend}
                        disabled={!message.trim()}
                    >
                        <IconSymbol name="arrow.up" size={16} color="#fff" />
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
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#00000010',
    },
    backBtn: {
        padding: 10,
    },
    headerInfo: {
        marginLeft: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    chatArea: {
        padding: 16,
        paddingBottom: 24,
    },
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
        maxWidth: '85%',
    },
    messageMe: {
        alignSelf: 'flex-end',
    },
    messageThem: {
        alignSelf: 'flex-start',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    bubble: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
    },
    senderName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#666',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 15,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});
