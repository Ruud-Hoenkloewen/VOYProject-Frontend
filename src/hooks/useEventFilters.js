import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * HOOK: useEventFilters
 * Encapsula la lógica de negocio para filtrar eventos dinámicamente.
 * 
 * @param {Array} events - Lista original de eventos desde la API.
 * @returns {Object} { activeCategories, toggleCategory, activeLugar, setActiveLugar, availableLugares, activeFecha, setActiveFecha, availableFechas, filteredEvents }
 */
export function useEventFilters(events = []) {
  // Estado para las categorías seleccionadas (soporta multiselección)
  const [activeCategories, setActiveCategories] = useState(["TODOS"]);
  const [activeLugar,       setActiveLugar]       = useState("TODOS");
  const [activeFecha,       setActiveFecha]       = useState("TODOS");

  // Extrae el valor de 'q' de la URL para la búsqueda global (Navbar)
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").toLowerCase();

  /**
   * Alterna la selección de un género musical en el filtro.
   * Si se hace clic en "TODOS", resetea la selección.
   * Si se deseleccionan todos, vuelve automáticamente a "TODOS".
   * 
   * @param {string} genre - El género a alternar.
   */
  const toggleCategory = (genre) => {
    if (genre === "TODOS") {
      setActiveCategories(["TODOS"]);
      return;
    }

    setActiveCategories((prev) => {
      const withoutTodos = prev.filter(c => c !== "TODOS");
      
      if (withoutTodos.includes(genre)) {
        // Quita el género si ya estaba
        const newSelection = withoutTodos.filter(c => c !== genre);
        return newSelection.length === 0 ? ["TODOS"] : newSelection;
      } else {
        // Añade el género si no estaba
        return [...withoutTodos, genre];
      }
    });
  };

  /**
   * Motor de filtrado — memoizado para evitar recálculos innecesarios.
   * Solo se recomputa cuando cambian los eventos o alguno de los filtros activos.
   */
  const filteredEvents = useMemo(() => events.filter((evt) => {
    const matchesSearch = searchQuery === "" ||
      evt.title.toLowerCase().includes(searchQuery) ||
      (evt.venue   && evt.venue.toLowerCase().includes(searchQuery)) ||
      (evt.artists && evt.artists.some(a => a.nombre && a.nombre.toLowerCase().includes(searchQuery)));

    const matchesCategories = activeCategories.includes("TODOS") ||
      (evt.genres && evt.genres.some(g => activeCategories.includes(g.toUpperCase())));

    const matchesLugar = activeLugar === "TODOS" || evt.venue === activeLugar;
    const matchesFecha = activeFecha === "TODOS" || evt.date  === activeFecha;
    const matchesPrice = !searchParams.get("maxPrice") || evt.rawPrice <= Number(searchParams.get("maxPrice"));

    return matchesSearch && matchesCategories && matchesLugar && matchesFecha && matchesPrice;
  }), [events, searchQuery, activeCategories, activeLugar, activeFecha, searchParams]);

  // Opciones únicas extraídas dinámicamente — también memoizadas
  const availableLugares = useMemo(
    () => [...new Set(events.map(e => e.venue).filter(Boolean))].sort(),
    [events]
  );
  // Fechas sin ordenar para preservar el orden cronológico de la DB
  const availableFechas = useMemo(
    () => [...new Set(events.map(e => e.date).filter(Boolean))],
    [events]
  );

  return {
    activeCategories,
    toggleCategory,
    activeLugar,
    setActiveLugar,
    availableLugares,
    activeFecha,
    setActiveFecha,
    availableFechas,
    filteredEvents
  };
}
