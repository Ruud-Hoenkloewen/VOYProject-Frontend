import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "voy_token";
const USER_KEY  = "voy_user";

const normalizeRole = (r) => {
  if (!r) return null;
  const lower = r.toLowerCase();
  if (lower === "usuario" || lower === "client") return "client";
  if (lower === "productor" || lower === "producer") return "producer";
  if (lower === "admin") return "admin";
  return lower;
};

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
  const [role, setRole] = useState(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const rawRole = decoded.rol || decoded.role;
        if (rawRole) return normalizeRole(rawRole);
      } catch {}
    }
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return normalizeRole(parsed.rol || parsed.role);
      }
    } catch {}
    return null;
  });

  /** Llama después de un login/register exitoso */
  const login = useCallback((userData, jwt) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    
    let userRole = null;
    try {
      const decoded = jwtDecode(jwt);
      userRole = normalizeRole(decoded.rol || decoded.role);
    } catch {}
    
    if (!userRole) {
      userRole = normalizeRole(userData.rol || userData.role);
    }
    setRole(userRole);
  }, []);

  /** Cierra la sesión y limpia el storage */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setRole(null);
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
    if (!newUserData) return;
    localStorage.setItem(USER_KEY, JSON.stringify(newUserData));
    setUser(newUserData);
    if (newUserData.rol || newUserData.role) {
      setRole(normalizeRole(newUserData.rol || newUserData.role));
    }
  }, []);

  /** Si hay token pero no hay usuario (ej. bug anterior o storage parcial), recuperarlo */
  useEffect(() => {
    if (token && !user) {
      import('../services/userService').then(({ getMyProfile }) => {
        getMyProfile().then(data => {
          updateUser(data);
        }).catch(err => {
          console.error("Error recuperando usuario:", err);
          logout();
        });
      });
    }
  }, [token, user, updateUser, logout]);

  const isAuthenticated = Boolean(token);

  // Devolvemos el usuario asegurándonos de inyectar el rol del JWT si está disponible
  const userWithRole = user ? { ...user, rol: role || user.rol, role: role || user.role } : null;

  return (
    <AuthContext.Provider value={{ user: userWithRole, token, isAuthenticated, role, login, logout, updateUser }}>
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

