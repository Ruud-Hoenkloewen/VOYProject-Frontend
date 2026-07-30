import { useState, useEffect, useCallback } from 'react';
import { fetchCommunityArtists } from '../services/artistService';

export function useCommunityArtists(initialFilters = {}) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const loadArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCommunityArtists(filters);
      setArtists(data);
    } catch (err) {
      console.error('[useCommunityArtists] Error al cargar directorio:', err);
      setError('No se pudieron cargar los artistas de la comunidad');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    artists,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    refetch: loadArtists,
  };
}
