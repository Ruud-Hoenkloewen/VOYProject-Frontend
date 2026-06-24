import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../LandingPage.module.css";
import { CalendarIcon, ClockIcon, MapPinIcon } from "../../../../components/icons";
import { shareEvent } from "../../../../utils/helpers";

/**
 * FeaturedEventCard — Card mediana del evento destacado
 * Layout idéntico al mockup: izquierda (chips + título + meta) / derecha (lineup + acciones)
 * Sin precio ni botón comprar. Acciones: VER DETALLE (largo) + Share + Favoritos.
 */
export default function FeaturedEventCard({ event, isLoading }) {
  const [fav, setFav] = useState(false);

  const handleShare = () => {
    shareEvent(event);
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
