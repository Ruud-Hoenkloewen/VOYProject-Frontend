import { useNavigate } from "react-router-dom";
import Container from "../../design-system/layout/Container/Container";
import Stack from "../../design-system/layout/Stack/Stack";
import Typography from "../../design-system/primitives/Typography/Typography";
import EventCard from "../../design-system/composites/EventCard/EventCard";
import Button from "../../design-system/primitives/Button/Button";
import BookingSearchBar from "../../design-system/composites/BookingSearchBar/BookingSearchBar";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import { useEvents } from "../../hooks/useEvents";
import { useState, useEffect } from "react";
import { useEventFilters } from "../../hooks/useEventFilters";
import { WarningIcon } from "../../components/icons";
import styles from "./EventsPage.module.css";

const GENRES = ["INDIE", "ROCK", "PUNK", "HARDCORE", "METAL", "GRUNGE", "SHOEGAZE", "FOLK", "ALTERNATIVO", "POP"];

/**
 * COMPONENTE: EventsPage
 * Grilla principal de eventos con filtros por género, lugar y fecha.
 * Ruta: /events
 */
export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedArtist, setDebouncedArtist] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedArtist(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  const navigate = useNavigate();
  const { events, isLoading, error } = useEvents({ artist: debouncedArtist });
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
              <BookingSearchBar
                availableLugares={availableLugares}
                availableFechas={availableFechas}
                activeLugar={activeLugar}
                setActiveLugar={setActiveLugar}
                activeFecha={activeFecha}
                setActiveFecha={setActiveFecha}
                activeCategories={activeCategories}
                toggleCategory={toggleCategory}
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
