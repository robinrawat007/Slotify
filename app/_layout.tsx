import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SplashScreenOverlay } from '@/components/SplashScreen';
import { AuthProvider } from '@/context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Expo Router's native error boundary — exported as a named function from the
 * layout file so Expo Router automatically uses it when any screen crashes.
 * This is a function component (not class) so it's safe with the React Compiler.
 */
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorBody} numberOfLines={4}>{error.message}</Text>
      <Pressable style={styles.retryBtn} onPress={retry}>
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashDone, setSplashDone] = useState(false);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'About Slotify' }} />
        </Stack>
        <StatusBar style="auto" />
        {!splashDone && <SplashScreenOverlay onFinish={() => setSplashDone(true)} />}
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  errorBody: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  retryBtn: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 100,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
