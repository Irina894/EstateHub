// src/api/axios.js
import axios from "axios";

/**
 * Центральний axios instance.
 *
 *  ─ Базовий URL береться зі змінної середовища VITE_API_URL,
 *    а fallback — http://localhost:5000/api (для локальної розробки).
 *  ─ Request interceptor автоматично підставляє Bearer-токен з localStorage
 *    у заголовок Authorization кожного запиту, тож ручне передавання токена
 *    в API-функції більше не потрібне.
 *  ─ Response interceptor ловить 401 та емітить кастомну подію `auth:unauthorized`,
 *    яку слухає AuthContext, щоб коректно розлогінити користувача.
 */

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

// ─── REQUEST: автопідстановка токена ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE: глобальна обробка 401 ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // токен невалідний / прострочений → чистимо локальне сховище
      // та сповіщаємо AuthContext, щоб він прибрав user/token у стані.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default api;