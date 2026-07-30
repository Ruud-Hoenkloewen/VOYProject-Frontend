import Container from "../../design-system/layout/Container/Container";
import Stack from "../../design-system/layout/Stack/Stack";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import EventsExplorer from "./EventsExplorer";
import styles from "./EventsPage.module.css";

/**
 * COMPONENTE: EventsPage
 * Grilla y explorador de eventos con rediseño de buscador en tiempo real, chips y fallback.
 * Ruta: /events
 */
export default function EventsPage() {
  return (
    <div className={styles.pageWrapper}>
      <EditorialHeader ctaLabel="ACCEDER" ctaTo="/login" />

      <Container className={styles.pageContainer}>
        <Stack gap="xl">

          {/* ── HERO ─────────────────────────────────────── */}
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>BIENVENIDO A LA BUENA MÚSICA</h1>
            <p className={styles.heroSubtitle}>EXPLORÁ SHOWS, BANDAS Y VENUES EN TIEMPO REAL</p>
          </div>

          {/* ── EXPLORADOR Y GRILLA DE EVENTOS ────────────── */}
          <EventsExplorer />

        </Stack>
      </Container>
    </div>
  );
}
