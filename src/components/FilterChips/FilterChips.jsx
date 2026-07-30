import React from 'react';
import { GENRES_LIST } from '../../types/eventTypes';
import styles from './FilterChips.module.css';

/**
 * Componente: FilterChips
 * Fila de píldoras (chips) para filtrado rápido por género musical.
 * 
 * @param {Object} props
 * @param {string[]} [props.genres] - Lista de géneros disponibles
 * @param {string} props.selectedGenre - Género actualmente seleccionado
 * @param {Function} props.onSelectGenre - Callback al seleccionar un género
 */
export default function FilterChips({
  genres = GENRES_LIST,
  selectedGenre = 'TODOS',
  onSelectGenre
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.chipsContainer} role="tablist" aria-label="Filtros por género">
        {genres.map((genre) => {
          const isActive = selectedGenre.toUpperCase() === genre.toUpperCase();
          return (
            <button
              key={genre}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.chip} ${isActive ? styles.activeChip : ''}`}
              onClick={() => onSelectGenre && onSelectGenre(genre)}
            >
              {genre === 'TODOS' ? '⚡ TODOS' : genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
