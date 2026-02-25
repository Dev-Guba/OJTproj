import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../utils/storageKeys";
import Api from "../api/Api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async ({ username, password }) => {
    try {
      const res = await Api.AdminLoginAPI({ email: username, password });
      
      // Check if backend returned a user

      const userData = res.data.user || {
      user_id: res.data.user_id,
      role_id: res.data.role_id,
      email: res.data.email,
      username: username,
    };
      const token = res.data.token;

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(userData));
      localStorage.setItem("token", token);

      // Update context state
      setUser(userData);

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}