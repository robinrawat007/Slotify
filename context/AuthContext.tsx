import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

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
    login: (email: string, _password: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── MOCK user database (replace with real API calls) ───────────────────────
const MOCK_USERS: Record<string, AuthUser> = {
    'admin@slotify.com': {
        id: 'u0',
        name: 'Admin',
        email: 'admin@slotify.com',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=admin',
    },
    'user@slotify.com': {
        id: 'u1',
        name: 'Demo Player',
        email: 'user@slotify.com',
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?u=player',
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    const login = useCallback((email: string, _password: string): boolean => {
        const found = MOCK_USERS[email.toLowerCase().trim()];
        if (found) {
            setUser(found);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin',
            login,
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
