import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Api from "../api/auth.api";
import { STORAGE_KEYS } from "../utils/storageKeys";

const AuthContext = createContext(null);

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalizeAuth(resData, fallbackEmail) {
  const employeeNo =
    resData?.employeeNo ??
    resData?.user?.employeeNo ??
    resData?.user?.EmployeeNo ??
    null;

  const roleId = resData?.roleId ?? resData?.user?.roleId ?? resData?.user?.role_id ?? null;

  const email =
    resData?.email ??
    resData?.user?.Email ??
    fallbackEmail ??
    null;

  const SameDeptCode = resData?.user?.officeCode ?? resData?.user?.SameDeptCode ?? null;

  const firstName =
    resData?.firstName ??
    resData?.user?.firstName ??
    resData?.user?.FirstName ??
    null;

  const lastName =
    resData?.lastName ??
    resData?.user?.lastName ??
    resData?.user?.LastName ??
    null;

  const token = resData?.token ?? null;

  return {
    employeeNo,
    role_id: roleId,
    email,
    SameDeptCode,
    firstName,
    lastName,
    token,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    const parsed = raw ? safeParse(raw) : null;

    if (parsed?.token) {
      setUser(parsed);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      setUser(null);
    }

    setAuthReady(true);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEYS.AUTH) return;
      const parsed = e.newValue ? safeParse(e.newValue) : null;

      if (parsed?.token) setUser(parsed);
      else setUser(null);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await Api.AdminLoginAPI({ email, password });
      const data = res.data;
      const auth = normalizeAuth(data, email);

      if (!auth.token) {
        return { ok: false, error: "Login failed: missing token." };
      }

      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
      setUser(auth);

      return { ok: true };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";

      return { ok: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      authReady,
      isAuthed: !!user?.token,
      login,
      logout,
    }),
    [user, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}