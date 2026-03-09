"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User, AuthResponse } from "@/lib/types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load auth from localeStorage
        const token = localStorage.getItem("auth_token");
        const username = localStorage.getItem("auth_username");
        const role = localStorage.getItem("auth_role") as User["role"];

        if (token && username && role) {
            setUser({ username, role });
        }
        setLoading(false);
    }, []);

    const login = (authData: AuthResponse) => {
        localStorage.setItem("auth_token", authData.access_token);
        localStorage.setItem("auth_username", authData.username);
        localStorage.setItem("auth_role", authData.role);
        setUser({ username: authData.username, role: authData.role });
        router.push("/");
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_username");
        localStorage.removeItem("auth_role");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAdmin: user?.role === "ADMIN",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
