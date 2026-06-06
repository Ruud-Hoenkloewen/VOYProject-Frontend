import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../../../hooks/useEvents";
import FlyerCard3D from "../FlyerCard3D/FlyerCard3D";
import FeaturedEventCard from "../FeaturedEventCard/FeaturedEventCard";
import styles from "../../LandingPage.module.css";

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
 * FeaturedCarousel — Carrusel de shows destacados de la semana
 * Trae los eventos del backend. 3 flyers: 1 central grande + 2 laterales.
 * Navegación con flechas prev/next + dots. Card del evento central debajo.
 */
export default function FeaturedCarousel() {
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
