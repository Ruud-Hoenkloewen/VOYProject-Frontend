import React from 'react';
import { useEventSearch } from '../../hooks/useEventSearch';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterChips from '../../components/FilterChips/FilterChips';
import EventGrid from '../../components/EventGrid/EventGrid';
import EmptyState from '../../components/EmptyState/EmptyState';
import { WarningIcon } from '../../components/icons';
import styles from './EventsExplorer.module.css';

/**
 * COMPONENTE: EventsExplorer
 * Vista principal desacoplada que integra el Buscador en tiempo real,
 * Chips de géneros musicales, Ordenamiento por fecha/precio, Grilla de resultados y EmptyState.
 */
export default function EventsExplorer() {
  const {
    filteredEvents,
    isLoading,
    isUsingMock,
    filters,
    setSearchText,
    setSelectedGenre,
    setSortOrder,
    resetFilters
  } = useEventSearch();

  const isFiltered = Boolean(filters.searchText) || filters.selectedGenre !== 'TODOS' || filters.sortOrder !== 'fecha_asc';

  return (
    <section className={styles.explorerSection}>
      {/* ── ALERTA DE FALLBACK (MOCK DATA) ── */}
      {isUsingMock && (
        <div className={styles.mockBanner}>
          <span>⚡ Modo Contingencia Activo: Servidor fuera de línea. Mostrando eventos locales.</span>
        </div>
      )}

      {/* ── BARRA DE BÚSQUEDA ── */}
      <div className={styles.searchContainer}>
        <SearchBar
          value={filters.searchText}
          onChange={setSearchText}
          onClear={() => setSearchText('')}
          placeholder="Buscar evento por nombre, banda o venue..."
        />
      </div>

      {/* ── BARRA DE CHIPS DE GÉNEROS + CONTROLES ── */}
      <div className={styles.controlsRow}>
        <div className={styles.chipsWrapper}>
          <FilterChips
            selectedGenre={filters.selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </div>

        <div className={styles.sortWrapper}>
          <label htmlFor="sort-select" className={styles.sortLabel}>ORDENAR:</label>
          <select
            id="sort-select"
            className={styles.sortSelect}
            value={filters.sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="fecha_asc">📅 Próximos (Fecha ↑)</option>
            <option value="fecha_desc">📅 Lejanos (Fecha ↓)</option>
            <option value="precio_asc">💵 Menor precio</option>
            <option value="precio_desc">💵 Mayor precio</option>
            <option value="popular">🔥 Más populares</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              className={styles.resetButton}
              onClick={resetFilters}
              title="Restablecer todos los filtros"
            >
              ✕ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* ── RESULTADOS / GRID / EMPTY STATE ── */}
      <div className={styles.resultsContainer}>
        {!isLoading && filteredEvents.length === 0 ? (
          <EmptyState
            icon={<WarningIcon />}
            title="No encontramos eventos con esos filtros"
            description="Intenta cambiar las palabras clave o seleccionar otro género musical para descubrir más shows."
            actionLabel="Limpiar Filtros"
            onAction={resetFilters}
          />
        ) : (
          <EventGrid events={filteredEvents} isLoading={isLoading} />
        )}
      </div>
    </section>
  );
}
