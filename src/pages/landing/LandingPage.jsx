import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import EventCard from "../design-system/composites/EventCard/EventCard";
import EditorialHeader from "../design-system/composites/EditorialHeader/EditorialHeader";
import styles from "./LandingPage.module.css";


const FEATURES = [
  {
    icon: "🎸",
    title: "Descubrí Bandas",
    description: "Encontrá los artistas emergentes de la escena tucumana antes que nadie.",
  },
  {
    icon: "🎟️",
    title: "Conseguí Entradas",
    description: "Comprá tus tickets de forma rápida y segura, sin colas ni intermediarios.",
  },
  {
    icon: "🤘",
    title: "Unite a la Escena",
    description: "Conectate con el underground local y apoyá la música en vivo.",
  },
  {
    icon: "📍",
    title: "Todos los Venues",
    description: "Bares, clubs y teatros de Tucumán en un solo lugar.",
  },
];

const GENRES = [
  {
    icon: "⚡",
    name: "Punk",
    description: "Rápido, corto y sin filtros. La energía en su forma más honesta.",
  },
  {
    icon: "🔥",
    name: "Hardcore",
    description: "Más pesado, más intenso. El pogo llevado al límite.",
  },
  {
    icon: "🌀",
    name: "Post-Hardcore",
    description: "Emociones crudas y estructuras que no siguen reglas.",
  },
  {
    icon: "🎸",
    name: "Rock Alternativo",
    description: "Fuera del mainstream. Riffs que cuentan historias propias.",
  },
  {
    icon: "🌧️",
    name: "Grunge",
    description: "Sucio, oscuro y real. El sonido que no pide disculpas.",
  },
  {
    icon: "🤘",
    name: "Metal",
    description: "Pesado y preciso. Desde el thrash hasta el doom más lento.",
  },
  {
    icon: "📻",
    name: "Noise Rock",
    description: "Caos como lenguaje. Distorsión convertida en arte.",
  },
  {
    icon: "✨",
    name: "Pop Underground",
    description: "Melodías que no piden permiso. Lo indie con actitud.",
  },
];


/**
 * FlyerCard — Imagen del flyer con tilt 3D reactivo al mouse + esquinas bracket
 * Inspirado en la estética de Warp Records / Black Midi
 */
function FlyerCard() {
  const cardRef = useRef(null);
  const animFrameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      // Inclinación un poquito más que antes (era 5/7)
      const rotX = -y * 6;
      const rotY = x * 9;
      const imgX = x * 4;
      const imgY = y * 4;
      // scale más sutil: 1.015 en vez de 1.03
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.015)`;
      const img = card.querySelector('img');
      if (img) img.style.transform = `translate(${imgX}px, ${imgY}px) scale(1.05)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    const img = card.querySelector('img');
    if (img) img.style.transform = 'translate(0,0) scale(1)';
  }, []);

  return (
    // flyerOuter: contenedor columna SIN filter
    <div className={styles.flyerOuter}>
      {/* Eyebrow visible solo en mobile/tablet para acompañar al flyer cuando colapsa a 1 columna */}
      <div className={styles.flyerEyebrowMobile}>
        SHOW DESTACADO DE LA SEMANA - LUN 4 - DOM 10 ♦
      </div>
      <div className={styles.flyerInnerCentered}>
        <div className={styles.flyerShadowWrap}>
          <div
            ref={cardRef}
            className={styles.flyerCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <span className={styles.flyerCornerTL} aria-hidden="true" />
            <span className={styles.flyerCornerBR} aria-hidden="true" />
            <img
              src="/flyer-lacrifagia.png"
              alt="Lacrifagia — 08.05.2026 Bar Floresta"
              className={styles.flyerImg}
              draggable={false}
            />
          </div>
        </div>
        <Link to="/events" className={styles.flyerEventLink}>
          VER DETALLES DEL EVENTO →
        </Link>
        {/* Meta strip del evento — datos decorativos contextales */}
        <div className={styles.flyerMeta} aria-hidden="true">
          <span>08.05.2026</span>
          <span className={styles.flyerMetaDot}>◆</span>
          <span>BAR FLORESTA</span>
          <span className={styles.flyerMetaDot}>◆</span>
          <span>POST-HARDCORE</span>
          <span className={styles.flyerMetaDot}>◆</span>
          <span className={styles.flyerMetaBlink}>● LIVE</span>
        </div>
      </div>
    </div>
  );
}

/**
 * COMPONENTE: LandingPage
 * Página de entrada al producto con estética editorial underground.
 * Inspirada en discográficas como Sub Pop, Factory Records y Pitchfork.
 * Header propio con nav links — no usa el Navbar global (que tiene buscador).
 * Ruta: /
 */
export default function LandingPage() {
  const { events: previewEvents, isLoading } = useEvents({ limit: 4 });

  useScrollAnimation();

  return (
    <div className={styles.page}>

      {/* ── HEADER EDITORIAL (compartido, scroll-aware) ─── */}
      <EditorialHeader ctaLabel="ACCEDER" ctaTo="/login" />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Grain film overlay — textura análoga muy sutil */}
        <div className={styles.heroGrain} aria-hidden="true" />

        {/* Barra superior conectada: BIENVENIDO ---- SHOW DESTACADO DE LA SEMANA */}
        <div className={styles.heroTopBar}>
          <span className={styles.heroEyebrowLeft}>♦ BIENVENIDO</span>
          <div className={styles.heroTopBarLine} />
          <span className={styles.heroEyebrowRight}>SHOW DESTACADO DE LA SEMANA - LUN 4 - DOM 10 ♦</span>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            WELCOME<br />
            TO THE<br />
            <span className={styles.heroTitleAccent}>POGO</span>
          </h1>
          <p className={styles.heroSubtitle}>LA ESCENA EMERGENTE Y UNDERGROUND</p>
          <p className={styles.heroDescription}>
            La plataforma de eventos musicales del noroeste argentino.<br />
            Punk, Rock, Metal, Grunge y más — todo en un solo lugar.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/register" className={`${styles.ctaPrimary} ${styles.ctaFull}`}>CREAR TU CUENTA →</Link>
          </div>
        </div>
        {/* Flyer con efecto parallax/tilt al hover */}
        <FlyerCard />
      </section>


      {/* ── MARQUEE TICKER ───────────────────────────────────── */}
      <div className={styles.marqueeWrapper} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {["SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT"].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>♦ {item}</span>
          ))}
          {/* Duplicado para el loop infinito */}
          {["SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT", "SAN MIGUEL DE TUCUMÁN", "VOY PROJECT"].map((item, i) => (
            <span key={`dup-${i}`} className={styles.marqueeItem} aria-hidden="true">♦ {item}</span>
          ))}
        </div>
      </div>

      {/* ── QUÉ ES VOY ───────────────────────────────────────── */}
      <section className={styles.features}>
        <div className={styles.sectionHeader} data-animate>
          <div className={styles.sectionDivider} />
          <span className={styles.sectionLabel}>♦ QUÉ ES VOY ♦</span>
          <div className={styles.sectionDivider} />
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard} data-animate style={{ "--entry-delay": `${i * 80}ms` }}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LA ESCENA — GÉNEROS ─────────────────────────────── */}
      <section className={styles.genresSection}>
        <div className={styles.sectionHeader} data-animate>
          <div className={styles.sectionDivider} />
          <span className={styles.sectionLabel}>♦ NUESTROS GÉNEROS ♦</span>
          <div className={styles.sectionDivider} />
        </div>
        <div className={styles.genresGrid}>
          {GENRES.map((g, i) => (
            <div
              key={i}
              className={styles.genreCard}
              data-animate
              style={{ "--entry-delay": `${i * 60}ms` }}
            >
              <span className={styles.genreCardIcon}>{g.icon}</span>
              <h3 className={styles.genreCardName}>{g.name}</h3>
              <p className={styles.genreCardDesc}>{g.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EVENTOS DESTACADOS — ticker horizontal ───────────── */}
      <section className={styles.eventsPreview}>
        <div className={styles.sectionHeader} data-animate>
          <div className={styles.sectionDivider} />
          <span className={styles.sectionLabel}>♦ EN CARTELERA ♦</span>
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
                    status={evt.estado || evt.status}
                    statusTone={
                      (evt.estado || evt.status) === "AGOTADO" ? "danger"
                      : (evt.estado || evt.status) === "ÚLTIMAS ENTRADAS" ? "warning"
                      : "success"
                    }
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
                  status={evt.estado || evt.status}
                  statusTone={
                    (evt.estado || evt.status) === "AGOTADO" ? "danger"
                    : (evt.estado || evt.status) === "ÚLTIMAS ENTRADAS" ? "warning"
                    : "success"
                  }
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
