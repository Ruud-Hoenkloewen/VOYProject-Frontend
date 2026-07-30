import api from './api';
import { MOCK_ARTISTS } from './artistMockData';

/**
 * Flag global para forzar mock o intentar API real con fallback automático.
 * Cuando el backend implemente /api/artists y /api/users/:id/follow, basta con poner USE_MOCK_ARTISTS = false.
 */
export const USE_MOCK_ARTISTS = false;

// Estado local reactivo en memoria de los mocks para mantener interactividad durante la sesión
let mockStore = [...MOCK_ARTISTS];

/**
 * Obtiene la lista de todos los artistas para el directorio de la comunidad.
 * @param {Object} filters - { query, genre, sortBy }
 */
export const fetchCommunityArtists = async (filters = {}) => {
  if (!USE_MOCK_ARTISTS) {
    try {
      const { data } = await api.get('/artists', { params: filters });
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('[artistService] Backend /artists no disponible o vacío. Usando fallback Mock Data.');
    }
  }

  // Fallback a Mock Data
  let results = [...mockStore];

  if (filters.query) {
    const q = filters.query.toLowerCase().trim();
    results = results.filter(
      (a) =>
        a.nombre.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q) ||
        a.bio.toLowerCase().includes(q)
    );
  }

  if (filters.genre && filters.genre !== 'TODOS') {
    const g = filters.genre.toUpperCase();
    results = results.filter((a) =>
      a.generosMusicales.some((item) => item.toUpperCase() === g)
    );
  }

  if (filters.sortBy === 'popular') {
    results.sort((a, b) => (b.seguidoresCount || 0) - (a.seguidoresCount || 0));
  } else if (filters.sortBy === 'name') {
    results.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  // Simular retardo de red para experiencia fluida
  return new Promise((resolve) => {
    setTimeout(() => resolve(results), 200);
  });
};

/**
 * Obtiene el perfil completo de un artista por username o ID.
 * @param {string} identifier - username o _id del artista
 */
export const fetchArtistProfile = async (identifier) => {
  if (!identifier) throw new Error('Se requiere un identificador de artista');

  if (!USE_MOCK_ARTISTS) {
    try {
      const { data } = await api.get(`/artists/${identifier}`);
      if (data && (data._id || data.id)) {
        return data;
      }
    } catch (err) {
      console.warn(`[artistService] GET /artists/${identifier} no disponible. Intentando /users/${identifier}`);
      try {
        const { data: userData } = await api.get(`/users/${identifier}`);
        if (userData && (userData.role === 'artist' || userData.rol === 'artist' || userData.tags?.includes('artista'))) {
          return userData;
        }
      } catch (e) {
        console.warn(`[artistService] Fallback a Mock Data para ${identifier}`);
      }
    }
  }

  // Fallback Mock Data
  const clean = identifier.toLowerCase().replace('@', '').trim();
  const artist = mockStore.find(
    (a) =>
      a._id === identifier ||
      a.id === identifier ||
      a.username.toLowerCase() === clean
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (artist) {
        resolve(artist);
      } else {
        // Si no se encuentra un artista específico en los mocks, devolvemos el primero como fallback para pruebas de maquetado
        resolve(mockStore[0]);
      }
    }, 200);
  });
};

/**
 * Sigue a un artista.
 * @param {string} artistId 
 */
export const followArtist = async (artistId) => {
  if (!USE_MOCK_ARTISTS) {
    try {
      const { data } = await api.post(`/users/${artistId}/follow`);
      return data;
    } catch (err) {
      console.warn('[artistService] API follow falló, actualizando estado simulado local.');
    }
  }

  // Actualización simulada local
  mockStore = mockStore.map((a) => {
    if (a._id === artistId || a.id === artistId) {
      return {
        ...a,
        isFollowing: true,
        seguidoresCount: (a.seguidoresCount || 0) + 1,
      };
    }
    return a;
  });

  return { success: true, message: 'Artista seguido correctamente' };
};

/**
 * Deja de seguir a un artista.
 * @param {string} artistId 
 */
export const unfollowArtist = async (artistId) => {
  if (!USE_MOCK_ARTISTS) {
    try {
      const { data } = await api.delete(`/users/${artistId}/follow`);
      return data;
    } catch (err) {
      console.warn('[artistService] API unfollow falló, actualizando estado simulado local.');
    }
  }

  // Actualización simulada local
  mockStore = mockStore.map((a) => {
    if (a._id === artistId || a.id === artistId) {
      return {
        ...a,
        isFollowing: false,
        seguidoresCount: Math.max(0, (a.seguidoresCount || 0) - 1),
      };
    }
    return a;
  });

  return { success: true, message: 'Has dejado de seguir al artista' };
};
