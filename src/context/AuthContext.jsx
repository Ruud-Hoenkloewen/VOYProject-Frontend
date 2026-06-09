import { createContext, useContext, useState, useCallback, useEffect } from "react";

const TOKEN_KEY = "voy_token";
const USER_KEY  = "voy_user";

const AuthContext = createContext(null);

/**
 * AuthProvider — envuelve la app y provee el estado global de autenticación.
 * Lee el token de localStorage al montar para restaurar la sesión.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user,  setUser]  = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  /** Llama después de un login/register exitoso */
  const login = useCallback((userData, jwt) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  }, []);

  /** Cierra la sesión y limpia el storage */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Escucha el evento 'voy:unauthorized' que dispara api.js cuando el backend
   * devuelve 401 (token expirado o inválido). Cierra la sesión automáticamente
   * sin generar una dependencia circular entre api.js y AuthContext.
   */
  useEffect(() => {
    window.addEventListener('voy:unauthorized', logout);
    return () => window.removeEventListener('voy:unauthorized', logout);
  }, [logout]);

  /**
   * Actualiza los datos del usuario logueado en el estado y localStorage.
   */
  const updateUser = useCallback((newUserData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(newUserData));
    setUser(newUserData);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — hook para consumir el contexto desde cualquier componente.
 * Lanza error si se usa fuera del AuthProvider (fail-fast).
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

