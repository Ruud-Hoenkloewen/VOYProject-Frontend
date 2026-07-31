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
  const [activeCategories, setActiveCategories] = useState(["TODOS"]);
  const [activeLugar,       setActiveLugar]       = useState("TODOS");
  const [activeFecha,       setActiveFecha]       = useState("TODOS");
  const [sortBy,            setSortBy]            = useState("fecha");

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").toLowerCase();

  const toggleCategory = (genre) => {
    if (genre === "TODOS") {
      setActiveCategories(["TODOS"]);
      return;
    }

    setActiveCategories((prev) => {
      const withoutTodos = prev.filter(c => c !== "TODOS");
      if (withoutTodos.includes(genre)) {
        const newSelection = withoutTodos.filter(c => c !== genre);
        return newSelection.length === 0 ? ["TODOS"] : newSelection;
      } else {
        return [...withoutTodos, genre];
      }
    });
  };

  const resetFilters = () => {
    setActiveCategories(["TODOS"]);
    setActiveLugar("TODOS");
    setActiveFecha("TODOS");
    setSortBy("fecha");
    searchParams.delete("q");
    searchParams.delete("maxPrice");
    setSearchParams(searchParams, { replace: true });
  };

  const filteredEvents = useMemo(() => {
    const list = events.filter((evt) => {
      const matchesSearch = searchQuery === "" ||
        (evt.title && evt.title.toLowerCase().includes(searchQuery)) ||
        (evt.venue && evt.venue.toLowerCase().includes(searchQuery)) ||
        (evt.artists && evt.artists.some(a => a.nombre && a.nombre.toLowerCase().includes(searchQuery)));

      const matchesCategories = activeCategories.includes("TODOS") ||
        (evt.genres && evt.genres.some(g => activeCategories.includes(g.toUpperCase())));

      const matchesLugar = activeLugar === "TODOS" || evt.venue === activeLugar;
      const matchesFecha = activeFecha === "TODOS" || evt.date  === activeFecha;
      
      const maxP = searchParams.get("maxPrice");
      let matchesPrice = true;
      if (maxP !== null && maxP !== undefined && maxP !== "") {
        const numericMax = Number(maxP);
        matchesPrice = (evt.rawPrice || 0) <= numericMax;
      }

      return matchesSearch && matchesCategories && matchesLugar && matchesFecha && matchesPrice;
    });

    // Ordenamiento
    const sorted = [...list];
    if (sortBy === "alfabetico") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || "", "es", { sensitivity: "base" }));
    } else if (sortBy === "precio_asc") {
      sorted.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
    } else if (sortBy === "precio_desc") {
      sorted.sort((a, b) => (b.rawPrice || 0) - (a.rawPrice || 0));
    } else if (sortBy === "popular") {
      sorted.sort((a, b) => (b.attendeesCount || 0) - (a.attendeesCount || 0));
    }

    return sorted;
  }, [events, searchQuery, activeCategories, activeLugar, activeFecha, searchParams, sortBy]);

  const availableLugares = useMemo(
    () => [...new Set(events.map(e => e.venue).filter(Boolean))].sort(),
    [events]
  );
  
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
    sortBy,
    setSortBy,
    resetFilters,
    filteredEvents
  };
}
