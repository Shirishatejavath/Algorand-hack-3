import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
    plan: 'free' | 'pro' | 'premium';
    apiKey: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('bs_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const login = async (email: string, _password: string): Promise<boolean> => {
        const stored = localStorage.getItem('bs_user');
        if (stored) {
            const u = JSON.parse(stored);
            if (u.email === email) {
                setUser(u);
                return true;
            }
        }
        return false;
    };

    const signup = async (name: string, email: string, _password: string): Promise<boolean> => {
        const newUser: User = {
            name,
            email,
            plan: 'free',
            apiKey: 'txs_' + Math.random().toString(36).substring(2, 18),
        };
        localStorage.setItem('bs_user', JSON.stringify(newUser));
        setUser(newUser);
        return true;
    };

    const logout = () => {
        localStorage.removeItem('bs_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
