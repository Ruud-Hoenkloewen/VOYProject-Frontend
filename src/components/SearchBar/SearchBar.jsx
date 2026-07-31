import React from 'react';
import { SearchIcon } from '../icons';
import styles from './SearchBar.module.css';

/**
 * Componente: SearchBar
 * Input de búsqueda en tiempo real con icono y botón de limpieza.
 * 
 * @param {Object} props
 * @param {string} props.value - Texto actual del buscador
 * @param {Function} props.onChange - Handler al cambiar el texto
 * @param {string} [props.placeholder] - Placeholder personalizado
 * @param {Function} [props.onClear] - Callback para limpiar la búsqueda
 */
export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Buscar evento, banda o venue...',
  onClear
}) {
  return (
    <div className={styles.container}>
      <span className={styles.iconWrapper} aria-hidden="true">
        <SearchIcon />
      </span>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar eventos"
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          title="Borrar búsqueda"
          aria-label="Borrar texto de búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}
