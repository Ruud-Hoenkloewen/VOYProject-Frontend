import { useState, useEffect, useMemo } from 'react';
import { fetchEvents } from '../services/eventService';
import { MOCK_EVENTS } from '../types/eventTypes';

/**
 * Custom Hook: useEventSearch
 * Encapsula el estado de búsqueda/filtrado, debounce de texto y fallback (Fetch Backend -> Mock Data).
 *
 * @param {Object} initialFilters - Filtros iniciales opcionales
 * @param {number} delay - Tiempo de debounce en milisegundos (default: 300ms)
 */
export function useEventSearch(initialFilters = {}, delay = 300) {
  const [searchText, setSearchText] = useState(initialFilters.searchText || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [selectedGenre, setSelectedGenre] = useState(initialFilters.selectedGenre || 'TODOS');
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || 'fecha_asc');
  const [venue, setVenue] = useState(initialFilters.venue || 'TODOS');
  const [date, setDate] = useState(initialFilters.date || 'TODOS');

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Debounce para el input de texto
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchText, delay]);

  // Efecto para obtener eventos (Estrategia Backend-First con Fallback)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Intentar consultar el backend real
        const backendEvents = await fetchEvents({
          artist: debouncedSearch,
          genero: selectedGenre !== 'TODOS' ? selectedGenre : undefined,
        });

        if (isMounted) {
          if (backendEvents && backendEvents.length > 0) {
            setEvents(backendEvents);
            setIsUsingMock(false);
          } else {
            // Si el backend responde vacío o sin eventos, usamos MOCK_EVENTS de contingencia
            setEvents(MOCK_EVENTS);
            setIsUsingMock(true);
          }
        }
      } catch (err) {
        console.warn("Backend no disponible o error en petición. Usando datos Mock de respaldo:", err.message);
        if (isMounted) {
          setEvents(MOCK_EVENTS);
          setIsUsingMock(true);
          setError("Servidor offline. Mostrando datos locales de contingencia.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedGenre]);

  // Filtrado y ordenamiento dinámico sobre los eventos cargados
  const filteredEvents = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    const result = events.filter((evt) => {
      // 1. Filtro de Texto (Nombre de evento, banda/artista o venue)
      const matchesText =
        !query ||
        (evt.title && evt.title.toLowerCase().includes(query)) ||
        (evt.venue && evt.venue.toLowerCase().includes(query)) ||
        (evt.artists && evt.artists.some((a) => a.nombre && a.nombre.toLowerCase().includes(query)));

      // 2. Filtro por Género
      const matchesGenre =
        selectedGenre === 'TODOS' ||
        (evt.genres && evt.genres.some((g) => g.toUpperCase() === selectedGenre.toUpperCase()));

      // 3. Filtro por Lugar
      const matchesVenue = venue === 'TODOS' || evt.venue === venue;

      // 4. Filtro por Fecha
      const matchesDate = date === 'TODOS' || evt.date === date;

      return matchesText && matchesGenre && matchesVenue && matchesDate;
    });

    // Ordenamiento
    const sorted = [...result];
    if (sortOrder === 'alfabetico') {
      sorted.sort((a, b) => (a.title || a.nombre || '').localeCompare(b.title || b.nombre || '', 'es', { sensitivity: 'base' }));
    } else if (sortOrder === 'fecha_asc') {
      sorted.sort((a, b) => (a.rawDate || 0) - (b.rawDate || 0));
    } else if (sortOrder === 'fecha_desc') {
      sorted.sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0));
    } else if (sortOrder === 'precio_asc') {
      sorted.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
    } else if (sortOrder === 'precio_desc') {
      sorted.sort((a, b) => (b.rawPrice || 0) - (a.rawPrice || 0));
    } else if (sortOrder === 'popular') {
      sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    }

    return sorted;
  }, [events, debouncedSearch, selectedGenre, venue, date, sortOrder]);

  const toggleGenre = (genre) => {
    setSelectedGenre((prev) => (prev === genre ? 'TODOS' : genre));
  };

  const resetFilters = () => {
    setSearchText('');
    setDebouncedSearch('');
    setSelectedGenre('TODOS');
    setSortOrder('fecha_asc');
    setVenue('TODOS');
    setDate('TODOS');
  };

  return {
    events,
    filteredEvents,
    isLoading,
    error,
    isUsingMock,
    filters: {
      searchText,
      selectedGenre,
      sortOrder,
      venue,
      date,
    },
    setSearchText,
    setSelectedGenre,
    toggleGenre,
    setSortOrder,
    setVenue,
    setDate,
    resetFilters,
  };
}
