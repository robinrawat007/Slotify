import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar?: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionToUser(session: Session, profile?: Record<string, unknown> | null): AuthUser {
    return {
        id: session.user.id,
        email: session.user.email ?? '',
        name: (profile?.name as string) ?? session.user.email?.split('@')[0] ?? 'Player',
        role: (profile?.role as 'admin' | 'user') ?? 'user',
        avatar: (profile?.avatar_url as string) ?? `https://i.pravatar.cc/150?u=${session.user.id}`,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch profile from Supabase after a session is established
    const loadProfile = useCallback(async (session: Session) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('name, role, avatar_url')
                .eq('id', session.user.id)
                .single();
            setUser(sessionToUser(session, data));
        } catch {
            // Profile might not exist yet (signup race condition) — use session data
            setUser(sessionToUser(session));
        }
    }, []);

    // Restore session on app launch
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) loadProfile(session);
            else setLoading(false);
        });

        // Listen for auth state changes (login / logout / token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                loadProfile(session).finally(() => setLoading(false));
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [loadProfile]);

    const login = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        return { error: error?.message ?? null };
    }, []);

    const signup = useCallback(async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { name } },
        });
        return { error: error?.message ?? null };
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin',
            loading,
            login,
            signup,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
