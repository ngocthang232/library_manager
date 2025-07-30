// app/context/authContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    name: string;
    email: string;
    // bạn có thể bổ sung id, role... sau
};

type AuthContextType = {
    user: User | null;
    ready: boolean;                 // <-- mới: biết lúc nào khôi phục xong
    login: (userData: User) => Promise<void>;  // đổi sang async để đồng bộ storage
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    ready: false,
    login: async () => {},
    logout: async () => {},
});

const USER_KEY = 'auth_user';

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);

    // Khôi phục phiên khi mở app
    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem(USER_KEY);
                if (json) setUser(JSON.parse(json));
            } finally {
                setReady(true);
            }
        })();
    }, []);

    const login = async (userData: User) => {
        // TODO: sau này gọi API -> nhận user thật rồi set
        setUser(userData);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem(USER_KEY);
    };

    const value = useMemo(() => ({ user, ready, login, logout }), [user, ready]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
