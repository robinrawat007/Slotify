import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, TextInput, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/Avatar';

export default function ProfileScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { user, isAuthenticated, isAdmin, login, signup, logout, loading: authLoading } = useAuth();

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const getFriendlyErrorMessage = (error: string) => {
        const lower = error.toLowerCase();
        if (lower.includes('invalid login credentials')) return 'Email or password incorrect.';
        if (lower.includes('user already registered')) return 'An account with this email already exists.';
        if (lower.includes('email not confirmed')) return 'Please confirm your email before logging in.';
        if (lower.includes('rate limit')) return 'Too many attempts. Please try again later.';
        return error;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        const trimmedEmail = email.trim();
        const trimmedName = name.trim();

        if (!trimmedEmail) newErrors.email = 'Email is required';
        else if (!EMAIL_REGEX.test(trimmedEmail)) newErrors.email = 'Invalid email address';

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Min 6 characters required';

        if (mode === 'signup') {
            if (!trimmedName) newErrors.name = 'Full name is required';
            if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setSubmitting(true);
        setErrors({});

        try {
            if (mode === 'login') {
                const { error } = await login(email.trim(), password);
                if (error) {
                    setErrors({ general: getFriendlyErrorMessage(error) });
                }
            } else {
                const { error } = await signup(email.trim(), password, name.trim());
                if (error) {
                    setErrors({ general: getFriendlyErrorMessage(error) });
                } else {
                    Alert.alert(
                        'Confirm Email 📧',
                        'We sent a verification link to your email. Please click it to activate your account.'
                    );
                    setMode('login');
                    setPassword('');
                    setConfirmPassword('');
                }
            }
        } catch (err: any) {
            setErrors({ general: 'Something went wrong. Please try again.' });
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
                        style={{ width: 100, height: 100, marginBottom: 16 }}
                        contentFit="contain"
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
                        {errors.general && (
                            <View style={styles.generalError}>
                                <Text style={styles.errorTextSmall}>{errors.general}</Text>
                            </View>
                        )}

                        {mode === 'signup' && (
                            <View>
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: errors.name ? '#ff4d4f' : theme.icon + '40', backgroundColor: theme.background }]}
                                    placeholder="Full Name"
                                    placeholderTextColor={theme.icon}
                                    value={name}
                                    onChangeText={(val) => { setName(val); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
                                    autoCapitalize="words"
                                />
                                {errors.name && <Text style={styles.errorTextSmall}>{errors.name}</Text>}
                            </View>
                        )}

                        <View>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: errors.email ? '#ff4d4f' : theme.icon + '40', backgroundColor: theme.background }]}
                                placeholder="Email Address"
                                placeholderTextColor={theme.icon}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(val) => { setEmail(val); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
                            />
                            {errors.email && <Text style={styles.errorTextSmall}>{errors.email}</Text>}
                        </View>

                        <View>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: errors.password ? '#ff4d4f' : theme.icon + '40', backgroundColor: theme.background }]}
                                placeholder="Password (min 6 chars)"
                                placeholderTextColor={theme.icon}
                                secureTextEntry
                                value={password}
                                onChangeText={(val) => { setPassword(val); if (errors.password) setErrors(prev => ({ ...prev, password: '' })); }}
                            />
                            {errors.password && <Text style={styles.errorTextSmall}>{errors.password}</Text>}
                        </View>

                        {mode === 'signup' && (
                            <View>
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: errors.confirmPassword ? '#ff4d4f' : theme.icon + '40', backgroundColor: theme.background }]}
                                    placeholder="Confirm Password"
                                    placeholderTextColor={theme.icon}
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={(val) => { setConfirmPassword(val); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                                />
                                {errors.confirmPassword && <Text style={styles.errorTextSmall}>{errors.confirmPassword}</Text>}
                            </View>
                        )}
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
                <Avatar
                    name={user?.name || 'User'}
                    avatarUrl={user?.avatar}
                    size={72}
                />
                <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: theme.text }]}>
                        {user?.name}
                    </Text>
                    <Text style={[styles.profileEmail, { color: theme.icon }]}>{user?.email}</Text>
                    <View style={[styles.skillBadge, { backgroundColor: theme.tint + '20' }]}>
                        <Text style={[styles.skillText, { color: theme.tint }]}>
                            {user?.role === 'admin' ? '🏟️ Venue Owner' : '⚽ Player'}
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
    errorTextSmall: {
        color: '#ff4d4f',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
        marginLeft: 4,
    },
    generalError: {
        backgroundColor: '#fff1f0',
        borderColor: '#ffa39e',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        width: '100%',
    },
});
