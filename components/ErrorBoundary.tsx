import React, { Component, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary — wraps any subtree to catch unexpected React render errors.
 * 
 * Usage:
 *   <ErrorBoundary>
 *     <MyScreen />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Replace with real error reporting (Sentry, Crashlytics, etc.) in production
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    handleReset = () => this.setState({ hasError: false, error: null });

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <View style={styles.container}>
                    <Text style={styles.emoji}>⚠️</Text>
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.body} numberOfLines={3}>
                        {this.state.error?.message ?? 'An unexpected error occurred.'}
                    </Text>
                    <Pressable style={styles.btn} onPress={this.handleReset}>
                        <Text style={styles.btnText}>Try Again</Text>
                    </Pressable>
                </View>
            );
        }
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    emoji: { fontSize: 48, marginBottom: 12 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 },
    body: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
    btn: {
        backgroundColor: '#1DB954',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 100,
    },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
