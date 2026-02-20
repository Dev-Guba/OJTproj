import React, { createContext, useContext, useEffect, useMemo, useState} from "react";
import { STORAGE_KEYS } from "../utils/storageKeys";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
     
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
        if (raw) {
                setUser(JSON.parse(raw))
        }
        }, []);
     
    const login = async ({username, password}) => {
        if (username === "admin" && password === "admin") {
            const u = { username: "admin", role: "ADMIN" };

    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(u));
            setUser(u);
            return true;
        }
        return false;
    }

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        setUser(null);
    }

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}

