import React, { useState, useRef, useEffect } from 'react';
import { GENRES_LIST } from '../../types/eventTypes';
import styles from './FilterChips.module.css';

const PRIMARY_GENRES = ["TODOS", "INDIE", "ROCK", "PUNK", "METAL"];

/**
 * Componente: FilterChips (Rediseñado)
 * Muestra los géneros principales en píldoras y el resto en un menú desplegable 'Más géneros ▾'.
 * 
 * @param {Object} props
 * @param {string[]} [props.genres] - Lista completa de géneros
 * @param {string} props.selectedGenre - Género seleccionado
 * @param {Function} props.onSelectGenre - Callback al cambiar género
 */
export default function FilterChips({
  genres = GENRES_LIST,
  selectedGenre = 'TODOS',
  onSelectGenre
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const secondaryGenres = genres.filter(g => !PRIMARY_GENRES.includes(g));
  const isSecondaryActive = secondaryGenres.some(g => g.toUpperCase() === selectedGenre.toUpperCase());

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenreClick = (genre) => {
    if (onSelectGenre) onSelectGenre(genre);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.chipsRow}>
        {/* Géneros Principales */}
        {PRIMARY_GENRES.map((genre) => {
          const isActive = selectedGenre.toUpperCase() === genre.toUpperCase();
          return (
            <button
              key={genre}
              type="button"
              className={`${styles.chip} ${isActive ? styles.activeChip : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre === 'TODOS' ? '⚡ TODOS' : genre}
            </button>
          );
        })}

        {/* Botón Desplegable para Más Géneros */}
        <div className={styles.dropdownWrapper}>
          <button
            type="button"
            className={`${styles.moreButton} ${isSecondaryActive ? styles.activeMoreButton : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Más géneros musicales"
          >
            <span>
              {isSecondaryActive ? `🎧 ${selectedGenre}` : 'Más géneros'}
            </span>
            <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>▾</span>
          </button>

          {/* Menú Desplegable (Popover) */}
          {isOpen && (
            <div className={styles.dropdownMenu} role="menu">
              <div className={styles.menuHeader}>GÉNEROS ADICIONALES</div>
              <div className={styles.menuGrid}>
                {secondaryGenres.map((genre) => {
                  const isActive = selectedGenre.toUpperCase() === genre.toUpperCase();
                  return (
                    <button
                      key={genre}
                      type="button"
                      role="menuitem"
                      className={`${styles.menuItem} ${isActive ? styles.activeMenuItem : ''}`}
                      onClick={() => handleGenreClick(genre)}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
