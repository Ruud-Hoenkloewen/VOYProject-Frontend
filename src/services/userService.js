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
