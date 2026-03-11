import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RazorpayMockScreen() {
    const { amount, bookingId } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePay = () => {
        if (!selectedMethod) return;
        setIsProcessing(true);

        // Simulate Payment Gateway Delay
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);

            // Redirect to success/bookings after showing tick
            setTimeout(() => {
                router.replace('/bookings?refresh=true');
            }, 2000);
        }, 2500);
    };

    if (isSuccess) {
        return (
            <View style={[styles.successContainer, { backgroundColor: '#1DB954' }]}>
                <IconSymbol name="checkmark.circle.fill" size={100} color="#fff" />
                <Text style={styles.successText}>Payment Successful!</Text>
                <Text style={styles.successSubtext}>Redirecting to your bookings...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#f4f4f4' }]}>
            {/* Razorpay Header Mock */}
            <View style={styles.rzpHeader}>
                <View style={styles.rzpHeaderTop}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <IconSymbol name="xmark" size={20} color="#fff" />
                    </Pressable>
                    <Text style={styles.rzpTitle}>Slotify Sports</Text>
                </View>
                <Text style={styles.rzpAmount}>₹{amount}</Text>
                <Text style={styles.rzpOrderId}>Booking Ref: {bookingId}</Text>
            </View>

            <View style={[styles.methodsContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Cards, UPI & More</Text>

                <Pressable
                    style={[styles.methodItem, selectedMethod === 'upi' && { borderColor: '#528ff0', backgroundColor: '#eef4ff' }]}
                    onPress={() => setSelectedMethod('upi')}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#f0f0f0' }]}>
                        <IconSymbol name="qrcode.viewfinder" size={24} color="#000" />
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={[styles.methodTitle, { color: theme.text }]}>UPI / QR</Text>
                        <Text style={styles.methodSubtext}>Google Pay, PhonePe, Paytm</Text>
                    </View>
                    <View style={[styles.radio, selectedMethod === 'upi' && styles.radioSelected]}>
                        {selectedMethod === 'upi' && <View style={styles.radioInner} />}
                    </View>
                </Pressable>

                <Pressable
                    style={[styles.methodItem, selectedMethod === 'card' && { borderColor: '#528ff0', backgroundColor: '#eef4ff' }]}
                    onPress={() => setSelectedMethod('card')}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#f0f0f0' }]}>
                        <IconSymbol name="creditcard" size={24} color="#000" />
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={[styles.methodTitle, { color: theme.text }]}>Card</Text>
                        <Text style={styles.methodSubtext}>Visa, MasterCard, RuPay</Text>
                    </View>
                    <View style={[styles.radio, selectedMethod === 'card' && styles.radioSelected]}>
                        {selectedMethod === 'card' && <View style={styles.radioInner} />}
                    </View>
                </Pressable>
            </View>

            {/* RZP Footer */}
            <View style={[styles.footer, { backgroundColor: theme.background }]}>
                <View style={styles.securedBy}>
                    <IconSymbol name="lock.fill" size={14} color="#888" />
                    <Text style={{ color: '#888', fontSize: 12, marginLeft: 6 }}>Secured by Razorpay</Text>
                </View>
                <Pressable
                    style={[
                        styles.payBtn,
                        { backgroundColor: selectedMethod ? '#528ff0' : '#a0c0f0' }
                    ]}
                    disabled={!selectedMethod || isProcessing}
                    onPress={handlePay}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payBtnText}>Pay Now</Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    successSubtext: {
        color: '#fff',
        opacity: 0.8,
        marginTop: 8,
        fontSize: 16,
    },
    rzpHeader: {
        backgroundColor: '#528ff0', // typical Razorpay blue
        padding: 20,
        paddingTop: 40,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    rzpHeaderTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backBtn: {
        padding: 4,
        marginRight: 16,
    },
    rzpTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    rzpAmount: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 4,
    },
    rzpOrderId: {
        color: '#fff',
        opacity: 0.8,
        fontSize: 14,
    },
    methodsContainer: {
        margin: 16,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    methodInfo: {
        flex: 1,
    },
    methodTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    methodSubtext: {
        fontSize: 12,
        color: '#666',
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: '#528ff0',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#528ff0',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    securedBy: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    payBtn: {
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
