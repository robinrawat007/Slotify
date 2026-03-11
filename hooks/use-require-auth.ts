/**
 * useRequireAuth — Redirects unauthenticated users to the Profile (login) tab.
 *
 * Waits for the navigator to be fully mounted before firing any redirect,
 * preventing "navigate before mount" errors in Expo Router.
 *
 * Usage:
 *   const { user } = useRequireAuth();
 *   if (!user) return null; // hook already handles redirect
 *
 *   // Admin-only screens:
 *   const { user } = useRequireAuth({ adminOnly: true });
 */
import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import type { AuthUser } from '@/context/AuthContext';

type Options = {
    adminOnly?: boolean;
};

export function useRequireAuth(options: Options = {}): { user: AuthUser | null } {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();
    // Only truthy once the root navigator has fully mounted
    const rootNavState = useRootNavigationState();

    useEffect(() => {
        // Don't navigate until the navigator is ready
        if (!rootNavState?.key) return;

        if (!isAuthenticated) {
            router.replace('/(tabs)/profile');
            return;
        }
        if (options.adminOnly && !isAdmin) {
            router.replace('/(tabs)');
        }
    }, [rootNavState?.key, isAuthenticated, isAdmin, options.adminOnly]);

    return { user };
}
