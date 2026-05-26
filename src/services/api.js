import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Adjunta el JWT en cada request si existe en localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('voy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo centralizado de errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('[API] Error de red o servidor caído:', error.message);
    } else if (error.response.status === 401) {
      // Emitir evento global para que el AuthProvider cierre la sesión
      // sin generar una dependencia circular (api → AuthContext)
      window.dispatchEvent(new CustomEvent('voy:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;

