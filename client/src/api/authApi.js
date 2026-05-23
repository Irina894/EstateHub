// src/api/authApi.js
import api from "./axios";

/**
 * Усі захищені запити більше НЕ потребують ручного передавання токена —
 * його додає request interceptor у axios.js.
 *
 * Параметр `token` залишено в getMe лише для backward-compatibility
 * (його викликає AuthContext під час bootstrap). Якщо переданий — буде
 * використано саме його (корисно одразу після login, коли interceptor
 * ще читає старий токен з localStorage). Якщо ні — спрацює interceptor.
 */

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await api.post("/auth/login", userData);
  return data;
};

export const getMe = async (token) => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;
  const { data } = await api.get("/auth/me", config);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/auth/profile", payload);
  return data;
};