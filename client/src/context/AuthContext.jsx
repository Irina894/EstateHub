// src/context/AuthContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getMe } from "../api/authApi";

/**
 * Auth-стан з:
 *  • bootstrap-завантаженням «me» при наявності токена;
 *  • глобальним listener-ом події `auth:unauthorized` від axios interceptor;
 *  • безпечним fallback у useAuth, щоб додаток не падав, якщо Provider забутий.
 */

const DEFAULT_CTX = {
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  __noProvider: true,
};

const AuthContext = createContext(DEFAULT_CTX);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const bootRan = useRef(false);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    if (bootRan.current) return;
    bootRan.current = true;

    const loadUser = async () => {
      const stored = localStorage.getItem("token");
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const userData = await getMe(stored);
        const me = userData?.user || userData;
        setUser(me);
        setToken(stored);
        localStorage.setItem("user", JSON.stringify(me));
      } catch (err) {
        console.error("Auth bootstrap failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [logout]);

  useEffect(() => {
    const handler = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener("auth:unauthorized", handler);
    return () => window.removeEventListener("auth:unauthorized", handler);
  }, []);

  const login = useCallback((userData, tokenData) => {
    const me = userData?.user || userData;
    setUser(me);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(me));
    localStorage.setItem("token", tokenData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ── one-shot warning якщо Provider забутий ── */
let warned = false;

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx?.__noProvider && !warned && typeof console !== "undefined") {
    warned = true;
    console.warn(
      "[AuthContext] <AuthProvider> is missing. Using fallback values. " +
      "Wrap your <App /> with <AuthProvider> in main.jsx."
    );
  }
  return ctx;
};