import api from './api';
import { formatPrice } from '../utils/helpers';

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

const formatDate = (dateString) => {
  const date = new Date(dateString);
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
const mapEvent = (evt) => ({
  id:           evt._id,
  title:        evt.nombre,
  imageUrl:     evt.imagen || '',
  genres:       evt.generos  || [],
  date:         evt.fecha    ? formatDate(evt.fecha) : 'Fecha a confirmar',
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
});

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
