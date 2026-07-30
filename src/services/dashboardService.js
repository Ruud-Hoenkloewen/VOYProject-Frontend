import api from './api';
import { MOCK_PRODUCER_DASHBOARD, MOCK_ARTIST_DASHBOARD } from './dashboardMockData';

/**
 * Obtiene métricas y eventos para el Dashboard de Productora.
 * Intenta conectar al backend real. Si falla o no existe la ruta, responde con Mock Data.
 */
export const getProducerDashboardData = async () => {
  try {
    const { data } = await api.get('/dashboard/producer');
    if (data && data.metrics) {
      return { data, isFallback: false };
    }
  } catch (err) {
    console.warn('[dashboardService] Backend Producer Dashboard no disponible. Usando fallback Mock Data.');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_PRODUCER_DASHBOARD, isFallback: true });
    }, 250);
  });
};

/**
 * Obtiene métricas y próximos eventos para el Dashboard de Artista.
 * Intenta conectar al backend real. Si falla o no existe la ruta, responde con Mock Data.
 */
export const getArtistDashboardData = async () => {
  try {
    const { data } = await api.get('/dashboard/artist');
    if (data && data.metrics) {
      return { data, isFallback: false };
    }
  } catch (err) {
    console.warn('[dashboardService] Backend Artist Dashboard no disponible. Usando fallback Mock Data.');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_ARTIST_DASHBOARD, isFallback: true });
    }, 250);
  });
};
