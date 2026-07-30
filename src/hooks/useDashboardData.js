import { useState, useEffect, useCallback } from 'react';
import { getProducerDashboardData, getArtistDashboardData } from '../services/dashboardService';

/**
 * Custom hook inteligente para consumo de datos de dashboard.
 * @param {'producer' | 'artist'} role - Rol del dashboard a cargar
 */
export function useDashboardData(role = 'producer') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (role === 'producer') {
        result = await getProducerDashboardData();
      } else {
        result = await getArtistDashboardData();
      }
      setData(result.data);
      setIsFallback(result.isFallback);
    } catch (err) {
      console.error('[useDashboardData] Error al cargar métricas:', err);
      setError('No se pudieron cargar los datos del panel.');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    metrics: data?.metrics || [],
    events: data?.events || data?.upcomingEvents || [],
    loading,
    error,
    isFallback,
    refetch: loadData,
  };
}
