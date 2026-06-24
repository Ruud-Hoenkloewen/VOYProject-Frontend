import api from "./api";

/**
 * authService — llamadas HTTP a los endpoints de autenticación.
 * Devuelve el objeto { _id, nombre, email, token } en caso exitoso.
 * Re-lanza el error original de axios para que el llamador pueda leer
 * error.response.data.mensaje y mostrarlo en el formulario.
 */

/**
 * POST /api/auth/login
 * @param {string} email
 * @param {string} password
 * @returns {{ _id, nombre, email, token }}
 */
export const loginUser = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

/**
 * POST /api/auth/register
 * @param {string} nombre
 * @param {string} email
 * @param {string} password
 * @returns {{ _id, nombre, email, token }}
 */
export const registerUser = async (nombre, email, password) => {
  const { data } = await api.post("/auth/register", { nombre, email, password });
  return data;
};

/**
 * POST /api/auth/google
 * @param {string} credential JWT token from Google
 * @returns {{ _id, nombre, email, token, avatar }}
 */
export const googleLogin = async (credential) => {
  const { data } = await api.post("/auth/google", { credential });
  return data;
};
