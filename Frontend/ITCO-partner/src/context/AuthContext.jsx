import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Api from "../api/auth.api";
import { STORAGE_KEYS } from "../utils/storageKeys";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      setUser(null);
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await Api.AdminLoginAPI({ email, password });

      // ✅ build ONE object that includes token
      const auth = {
        user_id: res.data.id ?? res.data.user?.user_id ?? null,
        role_id: res.data.role_id ?? res.data.user?.role_id ?? null,
        email: res.data.email ?? res.data.user?.email ?? email,
        token: res.data.token, // ✅ IMPORTANT
      };

      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
      setUser(auth);

      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthed: !!user?.token, login, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}