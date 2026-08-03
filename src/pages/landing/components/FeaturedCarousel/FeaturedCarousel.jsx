import { useState, useRef } from "react";
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

  // Traemos los eventos del backend sin límite estricto para poder buscar los destacados
  const { events: backendEvents, isLoading } = useEvents();

  // Filtrar los eventos destacados configurados por el administrador
  const getFeaturedAndPaddedEvents = () => {
    if (isLoading || !backendEvents || backendEvents.length === 0) return [];

    const saved = localStorage.getItem("voy_featured_events");
    let featuredIds = [];
    if (saved) {
      try {
        featuredIds = JSON.parse(saved);
      } catch (e) {}
    }

    // Filtrar los que tengan su ID en la lista de destacados
    const featured = backendEvents.filter(evt => featuredIds.includes(evt.id));

    // Si no hay ninguno destacado por el admin, tomamos los primeros 3
    if (featured.length === 0) {
      return backendEvents.slice(0, 3);
    }

    // Si hay destacados pero son menos de 3, rellenamos con otros para mantener la estructura tridimensional
    let finalEvents = [...featured];
    if (finalEvents.length < 3 && backendEvents.length >= 3) {
      for (const evt of backendEvents) {
        if (finalEvents.length >= 3) break;
        if (!finalEvents.some(fe => fe.id === evt.id)) {
          finalEvents.push(evt);
        }
      }
    }
    return finalEvents;
  };

  const activeEventsList = getFeaturedAndPaddedEvents();

  // Mezclamos: si el backend tiene eventos, los usamos; si no (cargando/error), usamos los hardcodeados
  const shows = activeEventsList.length > 0
    ? activeEventsList.map(evt => ({
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
  const featuredEvent = activeShow?._raw || null;

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const clampDrag = (rawDiff) => {
    const maxOffset = 120;
    if (Math.abs(rawDiff) <= maxOffset) return rawDiff;
    // Resistencia elástica para evitar que las tarjetas salgan de los límites
    const overdrag = Math.abs(rawDiff) - maxOffset;
    const dampedOverdrag = Math.pow(overdrag, 0.65) * 2;
    return Math.sign(rawDiff) * (maxOffset + dampedOverdrag);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setIsDragging(true);
      hasDraggedRef.current = false;
      startXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches || !e.touches[0]) return;
    const currentX = e.touches[0].clientX;
    const rawDiff = currentX - startXRef.current;
    if (Math.abs(rawDiff) > 5) {
      hasDraggedRef.current = true;
    }
    setDragX(clampDrag(rawDiff));
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      if (dragX > 40) {
        prev();
      } else if (dragX < -40) {
        next();
      }
      setDragX(0);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rawDiff = e.clientX - startXRef.current;
    if (Math.abs(rawDiff) > 5) {
      hasDraggedRef.current = true;
    }
    setDragX(clampDrag(rawDiff));
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (dragX > 40) {
        prev();
      } else if (dragX < -40) {
        next();
      }
      setDragX(0);
    }
  };

  // Cálculo del progreso de arrastre (-1 a 1) para escalado y opacidad dinámica en tiempo real
  const progress = Math.max(-1, Math.min(1, dragX / 120));

  const leftScale     = 0.88 + Math.max(0, progress) * 0.12;
  const leftOpacity   = 0.45 + Math.max(0, progress) * 0.55;

  const centerScale   = 1 - Math.abs(progress) * 0.12;
  const centerOpacity = 1 - Math.abs(progress) * 0.55;

  const rightScale    = 0.88 + Math.max(0, -progress) * 0.12;
  const rightOpacity  = 0.45 + Math.max(0, -progress) * 0.55;

  return (
    <section className={styles.featuredSection}>
      {/* Header estilo QUÉ ES VOY: centrado con líneas a los costados */}
      <div className={styles.featuredHeader}>
        <div className={styles.featuredDivider} />
        <div className={styles.featuredHeaderCenter}>
          <span className={styles.featuredDiamond}>♦</span>
          <span className={styles.featuredLabel}>SHOWS DESTACADOS DE LA SEMANA</span>
          <span className={styles.featuredDiamond}>♦</span>
        </div>
        <div className={styles.featuredDivider} />
      </div>

      {/* Stage del carrusel con soporte táctil y arrastre interactivo en tiempo real */}
      <div
        className={styles.carouselStage}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragStart={(e) => e.preventDefault()}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <button
          className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
          onClick={prev}
          aria-label="Evento anterior"
        >
          ‹
        </button>

        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              transform: `scale(${leftScale})`,
              opacity: leftOpacity,
              transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: isDragging ? 'none' : 'auto',
            }}
          >
            <FlyerCard3D
              show={shows[leftIdx]}
              isCenter={false}
              key={`left-${leftIdx}`}
              onCardClick={() => !hasDraggedRef.current && goTo(leftIdx)}
            />
          </div>

          <div
            style={{
              transform: `scale(${centerScale})`,
              opacity: centerOpacity,
              transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: isDragging ? 'none' : 'auto',
            }}
          >
            <FlyerCard3D
              show={shows[centerIdx]}
              isCenter={true}
              key={`center-${centerIdx}`}
              onCardClick={() => !hasDraggedRef.current && navigate(featuredEvent?.id ? `/events/${featuredEvent.id}` : '/events')}
            />
          </div>

          <div
            style={{
              transform: `scale(${rightScale})`,
              opacity: rightOpacity,
              transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: isDragging ? 'none' : 'auto',
            }}
          >
            <FlyerCard3D
              show={shows[rightIdx]}
              isCenter={false}
              key={`right-${rightIdx}`}
              onCardClick={() => !hasDraggedRef.current && goTo(rightIdx)}
            />
          </div>
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
