/**
 * useRequireAuth — Redirects unauthenticated users to the Profile (login) tab.
 * 
 * Usage in protected screens:
 *   const { user } = useRequireAuth();
 *   if (!user) return null; // hook already handles redirect
 * 
 * Optionally restrict to admins only:
 *   const { user } = useRequireAuth({ adminOnly: true });
 */
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import type { AuthUser } from '@/context/AuthContext';

type Options = {
    /** If true, only 'admin' role users are allowed. Other logged-in users are also redirected. */
    adminOnly?: boolean;
};

export function useRequireAuth(options: Options = {}): { user: AuthUser | null } {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            // Not logged in → go to Profile (login) tab
            router.replace('/(tabs)/profile');
            return;
        }
        if (options.adminOnly && !isAdmin) {
            // Logged in but not admin → go back home
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, isAdmin, options.adminOnly]);

    return { user };
}
