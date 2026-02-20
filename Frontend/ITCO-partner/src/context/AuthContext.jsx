import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Api from "../api/Api";
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
      const auth = { email, token: res.data.token };

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