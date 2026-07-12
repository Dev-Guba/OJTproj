import axios from "axios";
import { STORAGE_KEYS } from "../utils/storageKeys";

const Http = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});
Http.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
      const auth = raw ? JSON.parse(raw) : null;

      if (auth?.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch {
    }

    return config;
  },
  (error) => Promise.reject(error)
);

Http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default Http;