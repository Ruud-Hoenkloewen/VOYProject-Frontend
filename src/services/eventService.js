import api from './api';
import { formatPrice } from '../utils/helpers';

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

/**
 * formatDate — convierte una fecha ISO a formato legible.
 * Ej: "14 AGO 2026"
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha a confirmar';
  const date  = new Date(dateString);
  const day   = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year  = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
};

const mapStatusTone = (status) => {
  switch (status) {
    case 'DISPONIBLE':       return 'success';
    case 'ÚLTIMAS ENTRADAS': return 'warning';
    case 'AGOTADO':          return 'danger';
    default:                 return 'neutral';
  }
};

/**
 * mapEvent — transforma un documento de evento del backend al shape
 * que consume el frontend. Centralizado para evitar duplicación.
 * @param {object} evt - Documento crudo de MongoDB
 * @returns {object} Evento normalizado
 */
const mapEvent = (evt) => {
  let imageUrl = evt.imagen || '';
  
  // Sanitize invalid local mock paths and assign actual flyers based on title
  if (imageUrl.startsWith('/public/') || !imageUrl) {
    const titleLower = (evt.nombre || '').toLowerCase();
    
    if (titleLower.includes('danny') || titleLower.includes('proyectil')) {
      imageUrl = '/flyer-danny-proyectil.png';
    } else if (titleLower.includes('lacrifagia') || titleLower.includes('oscuridad')) {
      imageUrl = '/flyer-lacrifagia.png';
    } else if (titleLower.includes('inexplicables')) {
      imageUrl = '/flyer-las-cosas-inexplicables.png';
    } else {
      // Default to one of the cool flyers for any other mock event
      const fallbacks = [
        '/flyer-sabbath-fest.png',
        '/flyer-lacrifagia.png',
        '/flyer-danny-proyectil.png',
        '/flyer-las-cosas-inexplicables.png'
      ];
      // Deterministic fallback based on ID or string length
      const index = (evt.nombre || '').length % fallbacks.length;
      imageUrl = fallbacks[index];
    }
  }

  return {
    id:           evt._id,
    title:        evt.nombre,
    imageUrl:     imageUrl,
    genres:       evt.generos  || [],
    date:         evt.fecha    ? formatDate(evt.fecha) : 'Fecha a confirmar',
    rawDate:      evt.fecha    ? new Date(evt.fecha)   : null,
    time:         evt.hora     ? `${evt.hora} HS`      : '',
    venue:        evt.lugar    || 'Lugar a confirmar',
    price:        evt.precio   !== undefined ? formatPrice(evt.precio) : formatPrice(0),
    rawPrice:     evt.precio   ?? 0,
    description:  evt.descripcion || '',
    artists:      (evt.artistas || []).map(a => ({ nombre: a.nombre, headliner: a.headliner || false })),
    status:       evt.estado   || 'DISPONIBLE',
    statusTone:   mapStatusTone(evt.estado || 'DISPONIBLE'),
    capacity:     evt.capacidadTotal ?? null,
    stock:        evt.stock ?? null,
    creador:      evt.creador || null,
    comentarios:  (evt.comentarios || []).map(c => ({
      id: c._id,
      texto: c.texto,
      createdAt: c.createdAt,
      usuario: c.usuario ? {
        id: c.usuario._id,
        nombre: c.usuario.nombre || 'Usuario',
        username: c.usuario.username || '',
        avatar: c.usuario.avatar || c.usuario.avatarUrl || c.usuario.fotoPerfil || '',
        avatarColor: c.usuario.avatarColor || '#00FF9F',
        role: c.usuario.role || c.usuario.rol || 'client'
      } : null
    })),
  };
};

/**
 * fetchEvents — obtiene la lista de eventos con filtros opcionales.
 * @param {object} params - Query params: genero, lugar, fecha, limit
 * @returns {Array} Lista de eventos normalizados
 */
export const fetchEvents = async (params = {}) => {
  try {
    const { data } = await api.get('/events', { params });
    return data.map((evt) => ({ ...mapEvent(evt), highlighted: false }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error(error.response?.data?.mensaje || "Error al obtener eventos del servidor");
  }
};

/**
 * fetchMyEvents — obtiene los eventos creados por el productor actual.
 * @returns {Array} Lista de eventos normalizados
 */
export const fetchMyEvents = async () => {
  try {
    const { data } = await api.get('/events/producer/my-events');
    return data.map((evt) => ({ ...mapEvent(evt), highlighted: false }));
  } catch (error) {
    console.error("Error fetching my events:", error);
    throw new Error(error.response?.data?.mensaje || "Error al obtener tus eventos del servidor");
  }
};

/**
 * fetchEventById — obtiene el detalle completo de un evento por su ID.
 * Re-lanza el error original para preservar error.response.status (ej: 404).
 * @param {string} id - MongoDB ObjectId del evento
 * @returns {object} Evento normalizado
 */
export const fetchEventById = async (id) => {
  try {
    const { data } = await api.get(`/events/${id}`);
    return mapEvent(data);
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

/**
 * createEvent — crea un nuevo evento en el servidor.
 * @param {object} eventData - Datos del evento a crear
 * @returns {object} Evento normalizado creado
 */
export const createEvent = async (eventData) => {
  try {
    const { data } = await api.post('/events', eventData);
    return mapEvent(data);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

/**
 * updateEvent — actualiza un evento existente en el servidor.
 * @param {string} id - ID del evento a actualizar
 * @param {object} eventData - Campos a actualizar
 * @returns {object} Evento normalizado actualizado
 */
export const updateEvent = async (id, eventData) => {
  try {
    const { data } = await api.put(`/events/${id}`, eventData);
    return mapEvent(data);
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw error;
  }
};

/**
 * deleteEvent — elimina un evento en el servidor.
 * @param {string} id - ID del evento a eliminar
 */
export const deleteEvent = async (id) => {
  try {
    const { data } = await api.delete(`/events/${id}`);
    return data;
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error;
  }
};

/**
  * addEventComment — agrega un comentario a un evento.
  */
export const addEventComment = async (eventId, texto) => {
  try {
    const { data } = await api.post(`/events/${eventId}/comments`, { texto });
    return data;
  } catch (error) {
    console.error(`Error adding comment to event ${eventId}:`, error);
    throw error;
  }
};

/**
  * deleteEventComment — elimina un comentario de un evento.
  */
export const deleteEventComment = async (eventId, commentId) => {
  try {
    const { data } = await api.delete(`/events/${eventId}/comments/${commentId}`);
    return data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};
