import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../design-system/layout/Container/Container";
import Stack from "../../design-system/layout/Stack/Stack";
import Typography from "../../design-system/primitives/Typography/Typography";
import EventCard from "../../design-system/composites/EventCard/EventCard";
import Button from "../../design-system/primitives/Button/Button";
import SearchBar from "../../design-system/composites/SearchBar/SearchBar";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import { useEvents } from "../../hooks/useEvents";
import { useEventFilters } from "../../hooks/useEventFilters";
import { useDebounce } from "../../hooks/useDebounce";
import { WarningIcon } from "../../components/icons";
import styles from "./EventsPage.module.css";

const GENRES = ["INDIE", "ROCK", "PUNK", "HARDCORE", "METAL", "GRUNGE", "SHOEGAZE", "FOLK", "ALTERNATIVO", "POP"];

/**
 * COMPONENTE: EventsPage
 * Grilla principal de eventos con filtros por género, lugar, fecha y artista.
 * Ruta: /events
 */
export default function EventsPage() {
  const navigate = useNavigate();

  // ── Búsqueda por artista con debounce ──────────────────────────
  // El input se actualiza al instante (UX fluida), pero el valor que
  // se manda a la API espera 300ms de inactividad antes de disparar.
  const [artistQuery, setArtistQuery] = useState("");
  const debouncedArtistQuery = useDebounce(artistQuery, 300);

  // El backend expone el filtro como ?artist=xyz (ver tarea de backend
  // SCRUM-XXX: GET /api/events con RegExp case-insensitive sobre artistas[].nombre)
  const eventsParams = debouncedArtistQuery.trim()
    ? { artist: debouncedArtistQuery.trim() }
    : {};

  const { events, isLoading, error } = useEvents(eventsParams);
  const {
    activeCategories, toggleCategory,
    activeLugar, setActiveLugar, availableLugares,
    activeFecha, setActiveFecha, availableFechas,
    filteredEvents
  } = useEventFilters(events);

  return (
    <div className={styles.pageWrapper}>
      <EditorialHeader ctaLabel="ACCEDER" ctaTo="/login" />

      <Container className={styles.pageContainer}>
        <Stack gap="xl">

          {/* ── HERO ─────────────────────────────────────── */}
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>BIENVENIDO A LA BUENA MÚSICA</h1>
            <p className={styles.heroSubtitle}>SELECCIONÁ TUS FILTROS O BUSCÁ EVENTOS</p>
            <div className={styles.heroSearch}>
              <SearchBar placeholder="Buscar bandas, lugares, fechas..." />
            </div>
          </div>

          {/* ── FILTROS ──────────────────────────────────── */}
          <div className={styles.filtersRow}>
            <div className={styles.filterGroupLarge}>
              <Typography variant="caption" className={styles.filterLabel}>GÉNERO</Typography>
              <div className={styles.genresList}>
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleCategory(genre)}
                    className={`${styles.genreBtn} ${activeCategories.includes(genre) ? styles.genreBtnActive : ""}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroupSmall}>
              <Typography variant="caption" className={styles.filterLabel}>LUGAR</Typography>
              <select
                className={styles.filterSelect}
                value={activeLugar}
                onChange={(e) => setActiveLugar(e.target.value)}
              >
                <option value="TODOS">Todos los lugares</option>
                {availableLugares.map(lugar => (
                  <option key={lugar} value={lugar}>{lugar}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroupSmall}>
              <Typography variant="caption" className={styles.filterLabel}>FECHA</Typography>
              <select
                className={styles.filterSelect}
                value={activeFecha}
                onChange={(e) => setActiveFecha(e.target.value)}
              >
                <option value="TODOS">Todas las fechas</option>
                {availableFechas.map(fecha => (
                  <option key={fecha} value={fecha}>{fecha}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroupSmall}>
              <Typography variant="caption" className={styles.filterLabel}>ARTISTA</Typography>
              <input
                type="text"
                className={styles.filterSelect}
                placeholder="Buscar por artista..."
                value={artistQuery}
                onChange={(e) => setArtistQuery(e.target.value)}
              />
            </div>
          </div>

          {/* ── ESTADOS: error / loading / vacío / grid ── */}
          {error && (
            <div className={styles.errorContainer}>
              <Typography variant="body">{error}</Typography>
            </div>
          )}

          {isLoading ? (
            <div className={styles.eventsGrid}>
              {[1, 2, 3, 4, 5, 6].map(i => <EventCard key={i} isLoading={true} />)}
            </div>
          ) : filteredEvents.length === 0 && !error ? (
            <div className={styles.emptyState}>
              <Typography variant="h3" style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}>
                <WarningIcon /> No hay nada disponible
              </Typography>
              <Typography variant="body" tone="muted" className={styles.emptyStateText}>
                Parece que la movida está descansando temporalmente. ¡Volvé pronto!
              </Typography>
              <Button variant="primary" onClick={() => navigate("/")}>Volver al inicio</Button>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} {...evt} />
              ))}
            </div>
          )}

        </Stack>
      </Container>
    </div>
  );
}
