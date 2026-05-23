// src/api/favoriteApi.js
import api from "./axios";

/**
 * Токен автоматично підставляється interceptor-ом, тож сигнатури функцій
 * стали простіше — приймають лише корисне навантаження.
 * Сторінки, які раніше передавали `token` другим аргументом, можуть
 * продовжувати це робити — зайвий аргумент ігнорується.
 */

export const addToFavorites = async (propertyId) => {
  const { data } = await api.post("/favorites", { propertyId });
  return data;
};

export const getMyFavorites = async () => {
  const { data } = await api.get("/favorites/my");
  return data;
};

export const removeFromFavorites = async (propertyId) => {
  const { data } = await api.delete(`/favorites/${propertyId}`);
  return data;
};

export default { addToFavorites, getMyFavorites, removeFromFavorites };