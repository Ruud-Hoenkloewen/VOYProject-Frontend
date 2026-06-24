import api from './api';

/**
 * getUsers — obtiene la lista completa de usuarios del sistema.
 * Solo para administradores.
 * @returns {Array} Lista de usuarios
 */
export const getUsers = async () => {
  try {
    const { data } = await api.get('/admin/users');
    // Mapeamos el campo role para homogeneizar la respuesta si el backend usa rol o role
    return data.map(u => ({
      id: u._id,
      nombre: u.nombre || u.username,
      username: u.username || 'sin_username',
      email: u.email,
      role: u.role || u.rol || 'client',
      isSuspended: u.isSuspended || false,
      isVerifiedProducer: u.isVerifiedProducer || false,
      isPendingApproval: u.isPendingApproval || false,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.response?.data?.mensaje || "Error al obtener usuarios del servidor");
  }
};

/**
 * updateUserStatus — actualiza rol, suspension y verificacion de productor.
 * @param {string} id - ID del usuario
 * @param {object} payload - { role, isSuspended, isVerifiedProducer, isPendingApproval }
 */
export const updateUserStatus = async (id, payload) => {
  try {
    const { data } = await api.put(`/admin/users/${id}`, payload);
    return data;
  } catch (error) {
    console.error(`Error updating user status for ${id}:`, error);
    throw new Error(error.response?.data?.mensaje || "Error al actualizar estado del usuario");
  }
};

/**
 * getMetrics — obtiene métricas financieras reales.
 * @returns {object} { ventasTotales, recaudacion }
 */
export const getMetrics = async () => {
  try {
    const { data } = await api.get('/admin/metrics');
    return data;
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    throw new Error(error.response?.data?.mensaje || "Error al obtener métricas financieras");
  }
};

/**
 * toggleFeaturedEvent — alterna el estado de destacado de un evento.
 * @param {string} id - ID del evento
 */
export const toggleFeaturedEvent = async (id) => {
  try {
    const { data } = await api.put(`/admin/events/${id}/feature`);
    return data;
  } catch (error) {
    console.error(`Error toggling featured status for event ${id}:`, error);
    throw new Error(error.response?.data?.mensaje || "Error al cambiar el estado de destacado del evento");
  }
};
