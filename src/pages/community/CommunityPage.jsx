import { useState } from 'react';
import EditorialHeader from '../../design-system/composites/EditorialHeader/EditorialHeader';
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import { useCommunityArtists } from '../../hooks/useCommunityArtists';
import styles from './CommunityPage.module.css';

const GENRES = ['TODOS', 'PUNK', 'HARDCORE', 'ROCK', 'TECHNO', 'ELECTRÓNICA', 'METAL', 'SYNTHWAVE'];

export default function CommunityPage() {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('TODOS');
  const [sortBy, setSortBy] = useState('popular');

  const { artists, loading, setFilters } = useCommunityArtists({
    query: '',
    genre: 'TODOS',
    sortBy: 'popular',
  });

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setFilters({ query: value, genre: selectedGenre, sortBy });
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setFilters({ query, genre, sortBy });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setFilters({ query, genre: selectedGenre, sortBy: value });
  };

  return (
    <div className={styles.pageRoot}>
      <EditorialHeader />

      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <span className={styles.eyebrow}>
            <span>◆</span> COMUNIDAD Y ESCENA LOCAL
          </span>
          <h1 className={styles.title}>
            DIRECTORIO DE <span className={styles.titleAccent}>ARTISTAS</span>
          </h1>
          <p className={styles.subtitle}>
            Conectá con las bandas, músicos y proyectos independientes que le dan vida a la escena del Noroeste Argentino.
          </p>
        </div>
      </section>

      <main className={styles.mainContent}>
        <div className={styles.filtersBar}>
          <div className={styles.searchRow}>
            <div className={styles.searchInputWrapper}>
              <svg
                className={styles.searchIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar artista por nombre o bio..."
                value={query}
                onChange={handleQueryChange}
              />
            </div>

            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Ordenar por"
            >
              <option value="popular">Más Populares</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          </div>

          <div className={styles.genresRow}>
            {GENRES.map((g) => (
              <button
                key={g}
                className={`${styles.genreBtn} ${selectedGenre === g ? styles.genreBtnActive : ''}`}
                onClick={() => handleGenreClick(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyText}>Cargando artistas de la escena...</span>
          </div>
        ) : artists.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎸</div>
            <h3 className={styles.emptyTitle}>No se encontraron artistas</h3>
            <p className={styles.emptyText}>
              Probá con otro término de búsqueda o seleccionando otro género musical.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {artists.map((artist) => (
              <ArtistCard key={artist._id || artist.id} artist={artist} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
