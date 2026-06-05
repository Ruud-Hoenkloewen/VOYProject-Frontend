import { useRef, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEvents } from "../../hooks/useEvents";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import EventCard from "../../design-system/composites/EventCard/EventCard";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
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


/** Datos hardcodeados — Shows destacados semana 25–31 de mayo 2026 */
const FEATURED_SHOWS = [
  {
    id: 1,
    img: "/flyer-danny-proyectil.png",
    alt: "Danny Proyectil + Entre Penumbras + Lacrifagia — 30 Ene",
    title: "Danny Proyectil",
    subtitle: "Entre Penumbras · Lacrifagia · Para Salir de la Oscuridad",
    date: "30.01.2026",
    time: "19hs",
    venue: "ND — Dir. por MP",
    price: "Anticipadas $5000",
    genre: "POST-HARDCORE",
    status: "DISPONIBLE",
    statusTone: "success",
  },
  {
    id: 2,
    img: "/flyer-lacrifagia.png",
    alt: "Lacrifagia — Bar Floresta, 08.05.2026",
    title: "Lacrifagia",
    subtitle: "Para Salir de la Oscuridad · Bar Floresta",
    date: "08.05.2026",
    time: "21hs",
    venue: "Bar Floresta — Av. Colón 471",
    price: "Anticipadas $5000",
    genre: "POST-HARDCORE / EMO",
    status: "DISPONIBLE",
    statusTone: "success",
  },
  {
    id: 3,
    img: "/flyer-las-cosas-inexplicables.png",
    alt: "Las Cosas Inexplicables + Lacrifagia — Debut 13.09.2025",
    title: "Las Cosas Inexplicables",
    subtitle: "Lacrifagia",
    date: "13.09.2025",
    time: "22hs",
    venue: "Oskar — Virgen de la Merced 611",
    price: "Consultar",
    genre: "NOISE ROCK / ALT",
    status: "DISPONIBLE",
    statusTone: "success",
  },
];

/**
 * FlyerCard3D — Flyer individual con tilt 3D reactivo al mouse + esquinas bracket
 * Mejoras: glare de luz, nombre dentro del tilt, click navega al evento, pseudo-3D en todos.
 */
function FlyerCard3D({ show, isCenter, onCardClick }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const animFrameRef = useRef(null);

  // Intensidad de tilt: más fuerte en el central, suave en los laterales
  const intensity = isCenter ? 1 : 0.55;

  const handleMouseMove = useCallback((e) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      const rotX = -y * 6 * intensity;
      const rotY = x * 9 * intensity;
      const imgX = x * 4 * intensity;
      const imgY = y * 4 * intensity;

      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${isCenter ? 1.015 : 1.01})`;

      const img = card.querySelector('img');
      if (img) img.style.transform = `translate(${imgX}px, ${imgY}px) scale(1.05)`;

      // Glare: luz radial que sigue al cursor sobre el card
      const glare = glareRef.current;
      if (glare) {
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`;
        glare.style.opacity = '1';
      }
    });
  }, [intensity, isCenter]);

  const handleMouseLeave = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    const img = card.querySelector('img');
    if (img) img.style.transform = 'translate(0,0) scale(1)';
    const glare = glareRef.current;
    if (glare) glare.style.opacity = '0';
  }, []);

  return (
    <div className={`${styles.carouselFlyerWrap} ${isCenter ? styles.carouselFlyerCenter : styles.carouselFlyerSide}`}>
      {/* Click → modal si es el central; click lateral → navega al siguiente/anterior */}
      <div
        className={styles.flyerShadowWrapLink}
        onClick={() => onCardClick && onCardClick(show)}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label={`Ver evento: ${show.title}`}
        onKeyDown={e => e.key === 'Enter' && onCardClick && onCardClick(show)}
      >
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
              src={show.img}
              alt={show.alt}
              className={styles.flyerImg}
              draggable={false}
            />
            {/* Glare — luz especular que sigue al cursor */}
            <div ref={glareRef} className={styles.flyerGlare} aria-hidden="true" />
            {/* Nombre del evento — se mueve CON el tilt */}
            <div className={styles.flyerCardLabel}>
              <span className={`${styles.carouselStatusBadge} ${styles[`badge_${show.statusTone}`]}`}>
                {show.status}
              </span>
              <span className={styles.flyerCardLabelTitle}>{show.title}</span>
              <span className={styles.flyerCardLabelSub}>{show.subtitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Íconos SVG — mismos que usa el EventCard del design system
 */
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
);

/**
 * FeaturedEventCard — Card mediana del evento destacado
 * Layout idéntico al mockup: izquierda (chips + título + meta) / derecha (lineup + acciones)
 * Sin precio ni botón comprar. Acciones: VER DETALLE (largo) + Share + Favoritos.
 */
function FeaturedEventCard({ event, isLoading }) {
  const [fav, setFav] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event?.title, url: `${window.location.origin}/events/${event?.id}` });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/events/${event?.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.featuredEventCard}>
        <div className={styles.featuredEventCardSkeleton} />
      </div>
    );
  }

  if (!event) return null;

  const artists = event.artists || [];
  const genres  = event.genres  || [];

  return (
    <div className={styles.featuredEventCard}>
      {/* ── Columna izquierda ── */}
      <div className={styles.fecLeft}>
        {/* Chips de género — estilo magenta/fucsia igual al mockup */}
        {genres.length > 0 && (
          <div className={styles.fecGenres}>
            {genres.slice(0, 3).map((g, i) => (
              <span key={i} className={styles.fecGenreChip}>{g}</span>
            ))}
          </div>
        )}

        {/* Título grande y brutal */}
        <h2 className={styles.fecTitle}>{event.title}</h2>

        {/* Meta: fecha, hora, venue — con íconos SVG propios del design system */}
        <div className={styles.fecInfoList}>
          {event.date && (
            <div className={styles.fecInfoItem}>
              <CalendarIcon />
              <span>{event.date}</span>
            </div>
          )}
          {event.time && (
            <div className={styles.fecInfoItem}>
              <ClockIcon />
              <span>{event.time}</span>
            </div>
          )}
          {event.venue && (
            <div className={styles.fecInfoItem}>
              <MapPinIcon />
              <span>{event.venue}</span>
            </div>
          )}
        </div>

        {/* Descripción breve si el backend la trae */}
        {event.description && (
          <p className={styles.fecDescription}>{event.description}</p>
        )}
      </div>

      {/* ── Columna derecha ── */}
      <div className={styles.fecRight}>
        {/* LINE-UP */}
        {artists.length > 0 && (
          <div className={styles.fecLineup}>
            <span className={styles.fecLineupLabel}>
              {/* Ícono musical SVG — igual al mockup */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
              LINE-UP
            </span>
            <ul className={styles.fecLineupList}>
              {artists.slice(0, 4).map((a, i) => {
                const name = typeof a === 'string' ? a : (a.nombre || a.name || '');
                const isHeadliner = a.headliner === true;
                return (
                  <li key={i} className={styles.fecLineupItem}>
                    <span className={styles.fecLineupNum}>0{i + 1}</span>
                    <span className={styles.fecLineupBar} aria-hidden="true" />
                    <span className={styles.fecLineupName}>{name}</span>
                    {isHeadliner && (
                      <span className={styles.fecHeadlinerBadge}>HEADLINER</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Género del artista como info adicional */}
        {genres.length > 0 && (
          <div className={styles.fecExtraInfo}>
            <span className={styles.fecExtraLabel}>GÉNERO</span>
            <span className={styles.fecExtraValue}>{genres.join(' · ')}</span>
          </div>
        )}

        {/* Separador + fila de acciones */}
        <div className={styles.fecActions}>
          <Link
            to={`/events/${event.id}`}
            className={styles.fecBtnDetail}
            id="featured-event-ver-detalle"
          >
            VER DETALLE →
          </Link>
          <button
            className={styles.fecBtnIcon}
            onClick={handleShare}
            aria-label="Compartir evento"
            title="Compartir"
            id="featured-event-share"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          <button
            className={`${styles.fecBtnIcon} ${fav ? styles.fecBtnIconActive : ''}`}
            onClick={() => setFav(f => !f)}
            aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            title="Favoritos"
            id="featured-event-fav"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * FeaturedCarousel — Carrusel de shows destacados de la semana
 * Trae los eventos del backend. 3 flyers: 1 central grande + 2 laterales.
 * Navegación con flechas prev/next + dots. Card del evento central debajo.
 */
function FeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Traemos hasta 3 eventos del backend para el carrusel
  const { events: backendEvents, isLoading } = useEvents({ limit: 3 });

  // Mezclamos: si el backend tiene eventos, los usamos; si no (cargando/error), usamos los hardcodeados
  const shows = !isLoading && backendEvents.length > 0
    ? backendEvents.map(evt => ({
        id: evt.id,
        img: evt.imageUrl || FEATURED_SHOWS[0].img,
        alt: evt.title,
        title: evt.title,
        subtitle: (evt.artists || []).map(a => typeof a === 'string' ? a : a.nombre || a.name || '').join(' · '),
        date: evt.date,
        time: evt.time,
        venue: evt.venue,
        price: evt.price,
        genre: (evt.genres || []).join(' / '),
        status: evt.status,
        statusTone: evt.statusTone,
        // datos extra para la card
        genres: evt.genres,
        artists: evt.artists,
        capacity: evt.capacity,
        _raw: evt,
      }))
    : FEATURED_SHOWS;

  const navigate = useNavigate();
  const [slideDir,  setSlideDir]          = useState('right'); // 'left' | 'right'
  const [cardAnimKey, setCardAnimKey]     = useState(0);

  const total = shows.length;

  const prev = () => {
    setSlideDir('left');
    setCardAnimKey(k => k + 1);
    setActiveIndex((i) => (i - 1 + total) % total);
  };
  const next = () => {
    setSlideDir('right');
    setCardAnimKey(k => k + 1);
    setActiveIndex((i) => (i + 1) % total);
  };
  const goTo = (i) => {
    setSlideDir(i > activeIndex ? 'right' : 'left');
    setCardAnimKey(k => k + 1);
    setActiveIndex(i);
  };

  const leftIdx   = (activeIndex - 1 + total) % total;
  const centerIdx = activeIndex;
  const rightIdx  = (activeIndex + 1) % total;

  const activeShow = shows[centerIdx];
  // Para la card de evento usamos los datos reales del backend si existen
  const featuredEvent = !isLoading && backendEvents.length > 0
    ? backendEvents[centerIdx] || backendEvents[0]
    : null;

  return (
    <section className={styles.featuredSection}>
      {/* Header estilo QUÉ ES VOY: centrado con líneas a los costados */}
      <div className={styles.featuredHeader}>
        <div className={styles.featuredDivider} />
        <div className={styles.featuredHeaderCenter}>
          <span className={styles.featuredDiamond}>♦</span>
          <span className={styles.featuredLabel}>SHOWS DESTACADOS — ESTA SEMANA</span>
          <span className={styles.featuredDiamond}>♦</span>
        </div>
        <div className={styles.featuredDivider} />
      </div>

      {/* Stage del carrusel */}
      <div className={styles.carouselStage}>
        <button
          className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
          onClick={prev}
          aria-label="Evento anterior"
        >
          ‹
        </button>

        <div className={styles.carouselTrack}>
          <FlyerCard3D show={shows[leftIdx]}   isCenter={false} key={`left-${leftIdx}`}   onCardClick={() => goTo(leftIdx)} />
          <FlyerCard3D show={shows[centerIdx]} isCenter={true}  key={`center-${centerIdx}`} onCardClick={() => navigate(featuredEvent?.id ? `/events/${featuredEvent.id}` : '/events')} />
          <FlyerCard3D show={shows[rightIdx]}  isCenter={false} key={`right-${rightIdx}`}  onCardClick={() => goTo(rightIdx)} />
        </div>

        <button
          className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
          onClick={next}
          aria-label="Siguiente evento"
        >
          ›
        </button>
      </div>

      {/* Dots indicadores */}
      <div className={styles.carouselDots} role="tablist" aria-label="Slides del carrusel">
        {shows.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            className={`${styles.carouselDot} ${i === activeIndex ? styles.carouselDotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Ir al evento ${i + 1}`}
          />
        ))}
      </div>

      {/* Card del evento destacado — key cambia al navegar → fade-in animado */}
      <FeaturedEventCard
        key={`fec-${cardAnimKey}`}
        event={featuredEvent || (activeShow ? { ...activeShow, genres: activeShow.genre ? activeShow.genre.split(' / ') : [], artists: [] } : null)}
        isLoading={isLoading}
        slideDir={slideDir}
      />

    </section>
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

        {/* Barra superior: solo BIENVENIDO en desktop */}
        <div className={styles.heroTopBar}>
          <span className={styles.heroEyebrowLeft}>♦ BIENVENIDO</span>
          <div className={styles.heroTopBarLine} />
          <span className={styles.heroEyebrowRight}>ESCENA UNDERGROUND · NOA · TUCUMÁN ♦</span>
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
      </section>

      {/* ── SHOWS DESTACADOS — CARRUSEL ───────────────────── */}
      <FeaturedCarousel />


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
