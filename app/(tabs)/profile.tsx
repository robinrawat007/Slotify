import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, TextInput, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { user, isAuthenticated, isAdmin, login, signup, logout, loading: authLoading } = useAuth();

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Validation Error', 'Please enter both email and password.');
            return;
        }
        if (!EMAIL_REGEX.test(email.trim())) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return;
        }
        if (mode === 'signup' && !name.trim()) {
            Alert.alert('Validation Error', 'Please enter your name.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters.');
            return;
        }

        setSubmitting(true);
        try {
            if (mode === 'login') {
                const { error } = await login(email.trim(), password);
                if (error) Alert.alert('Login Failed', error);
            } else {
                const { error } = await signup(email.trim(), password, name.trim());
                if (error) Alert.alert('Sign Up Failed', error);
                else Alert.alert('Account Created! 🎉', 'Check your email to confirm your account before logging in.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        setEmail('');
        setPassword('');
        setName('');
    };

    // Show loading spinner while session is being restored
    if (authLoading) {
        return (
            <View style={[styles.safeArea, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
                <View style={styles.authContainer}>
                    <Image
                        source={require('@/assets/images/logo-icon.png')}
                        style={{ width: 100, height: 100, marginBottom: 16, resizeMode: 'contain' }}
                    />
                    <Text style={[styles.authTitle, { color: theme.text }]}>Welcome to Slotify</Text>
                    <Text style={[styles.authSubtitle, { color: theme.icon }]}>
                        {mode === 'login' ? 'Login to manage your bookings' : 'Create your account'}
                    </Text>

                    {/* Mode Toggle */}
                    <View style={[styles.modeToggle, { backgroundColor: theme.icon + '15' }]}>
                        {(['login', 'signup'] as const).map(m => (
                            <Pressable
                                key={m}
                                style={[styles.modeBtn, mode === m && { backgroundColor: theme.tint }]}
                                onPress={() => setMode(m)}
                            >
                                <Text style={{ color: mode === m ? '#fff' : theme.icon, fontWeight: '600', fontSize: 14 }}>
                                    {m === 'login' ? 'Login' : 'Sign Up'}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.inputContainer}>
                        {mode === 'signup' && (
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.icon + '40', backgroundColor: theme.background }]}
                                placeholder="Full Name"
                                placeholderTextColor={theme.icon}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        )}
                        <TextInput
                            style={[styles.input, { color: theme.text, borderColor: theme.icon + '40', backgroundColor: theme.background }]}
                            placeholder="Email Address"
                            placeholderTextColor={theme.icon}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={[styles.input, { color: theme.text, borderColor: theme.icon + '40', backgroundColor: theme.background }]}
                            placeholder="Password (min 6 chars)"
                            placeholderTextColor={theme.icon}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <Pressable
                        style={[styles.primaryBtn, { backgroundColor: theme.tint, opacity: submitting ? 0.7 : 1 }]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.primaryBtnText}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>
                        }
                    </Pressable>
                </View>
            </SafeAreaView>
        );

    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
            </View>

            <View style={styles.profileHeader}>
                <Image
                    source={{ uri: email === 'admin@slotify.com' ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' }}
                    style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: theme.text }]}>
                        {email === 'admin@slotify.com' ? 'Admin User' : 'Robin Singh'}
                    </Text>
                    <Text style={[styles.profileEmail, { color: theme.icon }]}>{email}</Text>
                    <View style={[styles.skillBadge, { backgroundColor: theme.tint + '20' }]}>
                        <Text style={[styles.skillText, { color: theme.tint }]}>
                            {email === 'admin@slotify.com' ? 'Venue Owner' : 'Intermediate • Football'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.menuContainer}>
                <Pressable style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIconBg, { backgroundColor: theme.icon + '15' }]}>
                            <IconSymbol name="person.fill" size={20} color={theme.icon} />
                        </View>
                        <Text style={[styles.menuItemText, { color: theme.text }]}>Edit Profile</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color={theme.icon} />
                </Pressable>

                <Pressable style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIconBg, { backgroundColor: theme.icon + '15' }]}>
                            <IconSymbol name="creditcard.fill" size={20} color={theme.icon} />
                        </View>
                        <Text style={[styles.menuItemText, { color: theme.text }]}>Payment Methods</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color={theme.icon} />
                </Pressable>

                <Pressable style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIconBg, { backgroundColor: theme.icon + '15' }]}>
                            <IconSymbol name="heart.fill" size={20} color={theme.icon} />
                        </View>
                        <Text style={[styles.menuItemText, { color: theme.text }]}>Favorite Venues</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color={theme.icon} />
                </Pressable>

                {email === 'admin@slotify.com' && (
                    <Pressable style={styles.menuItem} onPress={() => router.push('/admin' as any)}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuIconBg, { backgroundColor: theme.icon + '15' }]}>
                                <IconSymbol name="building.2.fill" size={20} color={theme.icon} />
                            </View>
                            <Text style={[styles.menuItemText, { color: theme.text }]}>Admin Dashboard</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={16} color={theme.icon} />
                    </Pressable>
                )}

                <Pressable style={styles.menuItem} onPress={handleLogout}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIconBg, { backgroundColor: '#EF444415' }]}>
                            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#EF4444" />
                        </View>
                        <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Logout</Text>
                    </View>
                </Pressable>
            </View>
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
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    authSubtitle: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    modeToggle: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        width: '100%',
    },
    modeBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
        gap: 16,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    primaryBtn: {
        width: '100%',
        padding: 16,
        borderRadius: 100,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        marginBottom: 8,
    },
    skillBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    skillText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    menuContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
