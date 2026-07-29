import api from './api';

export const getMyProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

export const getProfileByUsername = async (username) => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};

export const getCommunityUsers = async () => {
  const { data } = await api.get('/users/community');
  return data;
};

export const followUser = async (userId) => {
  const { data } = await api.post(`/users/${userId}/follow`);
  return data;
};

export const unfollowUser = async (userId) => {
  const { data } = await api.delete(`/users/${userId}/follow`);
  return data;
};

export const toggleFavorite = async (eventId) => {
  const { data } = await api.put(`/users/favorites/${eventId}`);
  return data;
};

/**
 * PUT /api/users/me
 * Actualiza el perfil del usuario autenticado.
 */
export const updateMyProfile = async (data) => {
  const { data: result } = await api.put('/users/me', data);
  return result;
};

/**
 * GET /api/users/check-username?username=xxx
 * Verifica si un username está disponible.
 * Devuelve { available: true/false }
 */
export const checkUsername = async (username) => {
  const { data } = await api.get(`/users/check-username/${username}`);
  return { available: data.disponible };
};

/**
 * GRADIENTS y AVATAR_COLORS — constantes compartidas con el onboarding
 */
export const GRADIENTS = {
  g1: "linear-gradient(135deg, #00FF9F 0%, #A044FF 100%)",
  g2: "linear-gradient(135deg, #A044FF 0%, #FF2D78 100%)",
  g3: "linear-gradient(135deg, #00FF9F 0%, #00E5FF 100%)",
  g4: "linear-gradient(135deg, #FF2D78 0%, #FF6B00 100%)",
  g5: "linear-gradient(135deg, #00E5FF 0%, #A044FF 100%)",
  g6: "linear-gradient(135deg, #12131a 0%, #2a2d3d 100%)",
  rainbow: "linear-gradient(90deg, #ff0055 0%, #ff5000 20%, #ffcc00 40%, #00ff66 60%, #00ccff 80%, #a000ff 100%)",
  solid_mint: "#00FF9F",
  solid_cyan: "#00E5FF",
  solid_magenta: "#FF2D78",
  solid_purple: "#7B1FA2",
  solid_orange: "#FF6B00",
  solid_yellow: "#FFD600",
  solid_dark: "#0d0e14",
};

export const AVATAR_COLORS = [
  // Colores Fijos
  { value: "transparent", name: "Sin Borde (Full Imagen)", category: "fijo" },
  { value: "#00FF9F", name: "Verde Menta", category: "fijo" },
  { value: "#00E5FF", name: "Cyan Neón", category: "fijo" },
  { value: "#FF2D78", name: "Fucsia Neón", category: "fijo" },
  { value: "#A044FF", name: "Violeta", category: "fijo" },
  { value: "#FFD600", name: "Amarillo", category: "fijo" },
  { value: "#FF6B00", name: "Naranja", category: "fijo" },
  { value: "#FF0055", name: "Rojo Carmín", category: "fijo" },
  { value: "#ffffff", name: "Blanco", category: "fijo" },
  { value: "#1f2434", name: "Oscuro Metal", category: "fijo" },
  // Colores Mixtos (Gradients)
  { value: "linear-gradient(135deg, #00FF9F 0%, #00E5FF 100%)", name: "Acid Mint", category: "mixto" },
  { value: "linear-gradient(135deg, #FF2D78 0%, #A044FF 100%)", name: "Neon Pulse", category: "mixto" },
  { value: "linear-gradient(135deg, #FF6B00 0%, #FF2D78 100%)", name: "Sunset Fire", category: "mixto" },
  { value: "linear-gradient(135deg, #00E5FF 0%, #A044FF 100%)", name: "Electric Ocean", category: "mixto" },
  // Arcoíris
  { value: "linear-gradient(90deg, #ff0055 0%, #ff5000 20%, #ffcc00 40%, #00ff66 60%, #00ccff 80%, #a000ff 100%)", name: "Arcoíris Neón", category: "arcoiris" }
];