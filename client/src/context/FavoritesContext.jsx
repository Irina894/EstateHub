// src/context/FavoritesContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addToFavorites as apiAdd,
  getMyFavorites as apiGet,
  removeFromFavorites as apiRemove,
} from "../api/favoriteApi";
import { useAuth } from "./AuthContext";

/**
 * Глобальний стан «Обраного».
 *
 *  ─ favorites: масив повних об'єктів property (для MyFavoritesPage).
 *  ─ favoriteIds: Set<string> для миттєвої перевірки.
 *  ─ toggleFavorite(id, [currentlyFav]) — оптимістичне оновлення з відкатом.
 *  ─ refresh() — повне ре-завантаження з бекенду.
 *
 * Контекст реагує на зміну user/token (логін-логаут):
 *   client + token → завантажуємо
 *   інакше         → очищаємо стан
 *
 * ВАЖЛИВО: useFavorites НЕ кидає виключення, якщо Provider не підключений —
 * повертає безпечний fallback. Це гарантує, що додаток не впаде через
 * випадкову помилку в розкладці. Помилка лише логиться в консоль (один раз).
 */

/* ── дефолтний (no-op) контекст ────────────────────────────────────────── */
const DEFAULT_CTX = {
  favorites: [],
  favoriteIds: new Set(),
  isFavorited: () => false,
  toggleFavorite: async () => {},
  refresh: async () => {},
  loading: false,
  error: null,
  count: 0,
  __noProvider: true, // прапорець для діагностики
};

const FavoritesContext = createContext(DEFAULT_CTX);

/* нормалізатор — бек може віддавати по-різному */
const normalizeFavorites = (raw) => {
  const list = raw?.favorites || raw || [];
  return list
    .map((item) => {
      if (item?.propertyId && typeof item.propertyId === "object") {
        return item.propertyId; // populate
      }
      if (item?.property) return item.property;
      return item;
    })
    .filter(Boolean);
};

export const FavoritesProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const isClient = isAuthenticated && user?.role === "client";

  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ─── завантаження з бекенду ─── */
  const refresh = useCallback(async () => {
    if (!isClient) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet();
      const list = normalizeFavorites(data);
      setFavorites(list);
      setFavoriteIds(new Set(list.map((p) => p._id)));
    } catch (err) {
      if (err?.response?.status !== 401) {
        setError("Failed to load favorites");
        console.error("getMyFavorites:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  /* ── ре-завантаження при зміні auth-стану ── */
  useEffect(() => {
    if (isClient) {
      refresh();
    } else {
      setFavorites([]);
      setFavoriteIds(new Set());
      setError(null);
    }
  }, [isClient, token, refresh]);

  /* ─── toggle з оптимістичним апдейтом ─── */
  const isFavorited = useCallback((id) => favoriteIds.has(id), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (propertyId, currentlyFav) => {
      if (!isClient) return;
      const wasFav =
        typeof currentlyFav === "boolean" ? currentlyFav : favoriteIds.has(propertyId);

      // оптимістичне оновлення
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        wasFav ? next.delete(propertyId) : next.add(propertyId);
        return next;
      });

      try {
        if (wasFav) {
          await apiRemove(propertyId);
          setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
        } else {
          await apiAdd(propertyId);
        }
      } catch (err) {
        // ─ відкат ─
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          wasFav ? next.add(propertyId) : next.delete(propertyId);
          return next;
        });
        console.error("toggleFavorite:", err);
        throw err;
      }
    },
    [isClient, favoriteIds]
  );

  const value = useMemo(
    () => ({
      favorites,
      favoriteIds,
      isFavorited,
      toggleFavorite,
      refresh,
      loading,
      error,
      count: favoriteIds.size,
    }),
    [favorites, favoriteIds, isFavorited, toggleFavorite, refresh, loading, error]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

/* ── діагностичний один-раз попередження ── */
let warned = false;

/**
 * useFavorites — не кидає виключення, повертає безпечний fallback,
 * якщо Provider не підключений. Натомість виводить single-shot warning,
 * щоб ви побачили в консолі, що щось не так із розкладкою.
 */
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (ctx?.__noProvider && !warned && typeof console !== "undefined") {
    warned = true;
    console.warn(
      "[FavoritesContext] <FavoritesProvider> is missing. Using fallback values. " +
      "Wrap your <App /> with <FavoritesProvider> in main.jsx."
    );
  }
  return ctx;
};