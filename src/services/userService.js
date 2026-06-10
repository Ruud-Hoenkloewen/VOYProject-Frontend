import api from './api';

export const getMyProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

export const getProfileByUsername = async (username) => {
  const { data } = await api.get(`/users/${username}`);
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

export const updateMyProfile = async (data) => {
  const { data: result } = await api.put('/users/me', data);
  return result;
};

export const checkUsername = async (username) => {
  const { data } = await api.get(`/users/check-username?username=${username}`);
  return data;
};

export const GRADIENTS = {
  g1: "linear-gradient(135deg, #C6F92B 0%, #A044FF 100%)",
  g2: "linear-gradient(135deg, #A044FF 0%, #FF2D78 100%)",
  g3: "linear-gradient(135deg, #C6F92B 0%, #00E5FF 100%)",
  g4: "linear-gradient(135deg, #FF2D78 0%, #FF6B00 100%)",
  g5: "linear-gradient(135deg, #00E5FF 0%, #A044FF 100%)",
  g6: "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)",
};

export const AVATAR_COLORS = [
  { value: "#C6F92B", name: "Lima" },
  { value: "#A044FF", name: "Violeta" },
  { value: "#00E5FF", name: "Cyan" },
  { value: "#FF6B00", name: "Naranja" },
  { value: "#A044FF", name: "Púrpura" },
  { value: "#FF2D78", name: "Rosa" },
  { value: "#FFD600", name: "Amarillo" },
  { value: "#888888", name: "Gris" },
];