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
 * Consola Unificada de Búsqueda y Filtros con diseño de panel integrado glassmorphic.
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
      {/* ── BANNER INFORMATIVO MOCK ── */}
      {isUsingMock && (
        <div className={styles.mockBanner}>
          <span>⚡ Modo Contingencia: Mostrando catálogo local de eventos simulados.</span>
        </div>
      )}

      {/* ── CONSOLA UNIFICADA DE BÚSQUEDA Y FILTROS ── */}
      <div className={styles.unifiedConsole}>
        {/* BUSCADOR SUPERIOR */}
        <div className={styles.searchRow}>
          <SearchBar
            value={filters.searchText}
            onChange={setSearchText}
            onClear={() => setSearchText('')}
            placeholder="Buscar show, banda o lugar..."
          />
        </div>

        <div className={styles.divider} />

        {/* FILTROS Y ORDENAMIENTO INFERIOR */}
        <div className={styles.filterRow}>
          <div className={styles.chipsSection}>
            <span className={styles.filterTag}>ESTILO:</span>
            <FilterChips
              selectedGenre={filters.selectedGenre}
              onSelectGenre={setSelectedGenre}
            />
          </div>

          <div className={styles.metaControlSection}>
            {/* CONTADOR DE RESULTADOS */}
            <span className={styles.counterBadge}>
              {isLoading ? 'CARGANDO...' : `${filteredEvents.length} SHOWS`}
            </span>

            {/* CONTROL DE ORDEN */}
            <div className={styles.sortContainer}>
              <select
                id="sort-select"
                className={styles.sortSelect}
                value={filters.sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Ordenar eventos"
              >
                <option value="fecha_asc">📅 Próximos</option>
                <option value="fecha_desc">📅 Lejanos</option>
                <option value="precio_asc">💵 Menor $</option>
                <option value="precio_desc">💵 Mayor $</option>
                <option value="popular">🔥 Populares</option>
              </select>
            </div>

            {/* BOTÓN RESTABLECER */}
            {isFiltered && (
              <button
                type="button"
                className={styles.resetButton}
                onClick={resetFilters}
                title="Limpiar filtros"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── RESULTADOS Y GRILLA DE EVENTOS ── */}
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
