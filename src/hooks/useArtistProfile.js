import { useState, useEffect, useCallback } from 'react';
import { fetchArtistProfile } from '../services/artistService';

export function useArtistProfile(usernameOrId) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!usernameOrId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArtistProfile(usernameOrId);
      setArtist(data);
    } catch (err) {
      console.error('[useArtistProfile] Error al cargar perfil:', err);
      setError(err.message || 'No se pudo cargar el perfil del artista');
    } finally {
      setLoading(false);
    }
  }, [usernameOrId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    artist,
    tracks: artist?.tracks || [],
    events: artist?.events || [],
    interactions: artist?.interactions || [],
    loading,
    error,
    refetch: loadProfile,
  };
}
