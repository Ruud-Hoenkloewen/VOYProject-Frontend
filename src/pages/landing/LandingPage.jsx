import { Link } from "react-router-dom";
import { useEvents } from "../../hooks/useEvents";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useAuth } from "../../context/AuthContext";
import EventCard from "../../design-system/composites/EventCard/EventCard";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import FeaturedCarousel from "./components/FeaturedCarousel/FeaturedCarousel";
import HeroWidgetLoggedIn from "./components/HeroWidgets/HeroWidgetLoggedIn";
import HeroWidgetLoggedOut from "./components/HeroWidgets/HeroWidgetLoggedOut";
import { 
  MusicIcon, TicketIcon, PeopleIcon, MapPinIcon, 
  ZapIcon, FlameIcon, DiscIcon, HeadphonesIcon, 
  StarIcon, RadioIcon, SpeakerIcon, EyeIcon 
} from "../../components/icons";
import styles from "./LandingPage.module.css";

const FEATURES = [
  {
    icon: <MusicIcon />,
    title: "Descubrí Bandas",
    description: "Encontrá los artistas emergentes de la escena tucumana antes que nadie.",
  },
  {
    icon: <TicketIcon />,
    title: "Conseguí Entradas",
    description: "Comprá tus tickets de forma rápida y segura, sin colas ni intermediarios.",
  },
  {
    icon: <PeopleIcon />,
    title: "Unite a la Escena",
    description: "Conectate con el underground local y apoyá la música en vivo.",
  },
  {
    icon: <MapPinIcon />,
    title: "Todos los Venues",
    description: "Bares, clubs y teatros de Tucumán en un solo lugar.",
  },
];

const GENRES = [
  {
    icon: <ZapIcon />,
    name: "Punk",
    description: "Rápido, corto y sin filtros. La energía en su forma más honesta.",
  },
  {
    icon: <FlameIcon />,
    name: "Hardcore",
    description: "Más pesado, más intenso. El pogo llevado al límite.",
  },
  {
    icon: <DiscIcon />,
    name: "Post-Hardcore",
    description: "Emociones crudas y estructuras que no siguen reglas.",
  },
  {
    icon: <SpeakerIcon />,
    name: "Rock Alternativo",
    description: "Fuera del mainstream. Riffs que cuentan historias propias.",
  },
  {
    icon: <HeadphonesIcon />,
    name: "Grunge",
    description: "Sucio, oscuro y real. El sonido que no pide disculpas.",
  },
  {
    icon: <StarIcon />,
    name: "Metal",
    description: "Pesado y preciso. Desde el thrash hasta el doom más lento.",
  },
  {
    icon: <RadioIcon />,
    name: "Noise Rock",
    description: "Caos como lenguaje. Distorsión convertida en arte.",
  },
  {
    icon: <EyeIcon />,
    name: "Pop Underground",
    description: "Melodías que no piden permiso. Lo indie con actitud.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Explorá", desc: "Navegá por la cartelera o buscá por género y fecha." },
  { step: "02", title: "Elegí", desc: "Seleccioná tus entradas y pagá rápido y seguro." },
  { step: "03", title: "Recibí", desc: "Tu entrada digital (QR) se guarda en tu perfil al instante." },
  { step: "04", title: "Asistí", desc: "Mostrá el QR en puerta, y metete al pogo." },
];

/**
 * COMPONENTE: LandingPage
 * Página de entrada al producto con estética editorial underground.
 * Inspirada en discográficas como Sub Pop, Factory Records y Pitchfork.
 * Header propio con nav links — no usa el Navbar global (que tiene buscador).
 * Ruta: /
 */
export default function LandingPage() {
  const { events: previewEvents, isLoading } = useEvents({ limit: 4 });
  const { events: allEvents } = useEvents();
  const { user, isAuthenticated } = useAuth();

  useScrollAnimation();

  return (
    <div className={styles.page}>

      {/* ── HEADER EDITORIAL (compartido, scroll-aware) ─── */}
      <EditorialHeader ctaLabel="ACCEDER" ctaTo="/login" />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Grain film overlay — textura análoga muy sutil */}
        <div className={styles.heroGrain} aria-hidden="true" />

        {/* Barra superior: solo BIENVENIDO en desktop */}
        <div className={`${styles.heroTopBar} ${styles.animateStagger} ${styles.delay1}`}>
          <span className={styles.heroEyebrowLeft}><span className={styles.diamond}>♦</span> BIENVENIDO</span>
          <div className={styles.heroTopBarLine} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <h1 className={`${styles.heroTitle} ${styles.animateStagger} ${styles.delay2}`}>
              WELCOME<br />
              TO THE<br />
              <span className={styles.heroTitleAccent}>POGO</span>
            </h1>
            <p className={`${styles.heroSubtitle} ${styles.animateStagger} ${styles.delay3}`}>LA ESCENA EMERGENTE Y UNDERGROUND</p>
            <p className={`${styles.heroDescription} ${styles.animateStagger} ${styles.delay3}`}>
              La plataforma de eventos musicales del noroeste argentino.<br />
              Punk, Rock, Metal, Grunge y más — todo en un solo lugar.
            </p>

          </div>
          
          <div className={`${styles.animateStagger} ${styles.delay4}`} style={{ width: '100%', maxWidth: '380px' }}>
            {isAuthenticated ? (
              <HeroWidgetLoggedIn user={user} activeShowsCount={allEvents?.length || 0} />
            ) : (
              <HeroWidgetLoggedOut />
            )}
          </div>
        </div>
      </section>

      {/* ── SHOWS DESTACADOS — CARRUSEL ───────────────────── */}
      <FeaturedCarousel />

      {/* ── MARQUEE TICKER ───────────────────────────────────── */}
      <div className={styles.marqueeWrapper} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {["SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT"].map((item, i) => (
            <span key={i} className={styles.marqueeItem}><span className={styles.diamond}>♦</span> {item}</span>
          ))}
          {/* Duplicado para el loop infinito */}
          {["SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT"].map((item, i) => (
            <span key={`dup-${i}`} className={styles.marqueeItem} aria-hidden="true"><span className={styles.diamond}>♦</span> {item}</span>
          ))}
        </div>
      </div>

      {/* ── EVENTOS DESTACADOS — ticker horizontal ───────────── */}
      <section className={styles.eventsPreview}>
        <div className={styles.sectionHeader} data-animate>
          <div className={styles.sectionDivider} />
          <span className={styles.sectionLabel}><span className={styles.diamond}>♦</span> CARTELERA DE EVENTOS <span className={styles.diamond}>♦</span></span>
          <div className={styles.sectionDivider} />
        </div>

        {/* Ticker: overflow oculto + track animado */}
        <div className={styles.eventsTicker}>
          <div className={styles.eventsTrack}>
            {/* Set principal */}
            {(isLoading ? [1, 2, 3, 4] : previewEvents).map((evt, i) =>
              isLoading ? (
                <div key={i} className={styles.eventsTickerItem}>
                  <EventCard isLoading={true} />
                </div>
              ) : (
                <div key={evt.id} className={styles.eventsTickerItem}>
                  <EventCard
                    id={evt.id}
                    title={evt.title}
                    date={evt.date}
                    time={evt.time}
                    venue={evt.venue}
                    price={evt.price}
                    genres={evt.genres}
                    status={evt.status}
                    statusTone={evt.statusTone}
                    imageUrl={evt.imageUrl}
                  />
                </div>
              )
            )}
            {/* Duplicado para el loop infinito — aria-hidden */}
            {(!isLoading && previewEvents.length > 0) && previewEvents.map((evt) => (
              <div key={`dup-${evt.id}`} className={styles.eventsTickerItem} aria-hidden="true">
                <EventCard
                  id={evt.id}
                  title={evt.title}
                  date={evt.date}
                  time={evt.time}
                  venue={evt.venue}
                  price={evt.price}
                  genres={evt.genres}
                  status={evt.status}
                  statusTone={evt.statusTone}
                  imageUrl={evt.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.eventsCtaWrapper} data-animate>
          <Link to="/events" className={styles.ctaPrimary}>VER TODOS LOS EVENTOS</Link>
        </div>
      </section>



      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerBar}>
          PRIVACY POLICY &nbsp;|&nbsp; TÉRMINOS Y CONDICIONES &nbsp;|&nbsp; APOYÁ LA ESCENA EMERGENTE DE TUCUMÁN &nbsp;|&nbsp; © 2026 VOY PROJECT
        </div>
      </footer>

    </div>
  );
}
