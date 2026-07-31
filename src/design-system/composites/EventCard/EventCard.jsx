import Badge from "../../primitives/Badge/Badge";
import Button from "../../primitives/Button/Button";
import Card from "../../primitives/Card/Card";
import Chip from "../../primitives/Chip/Chip";
import Typography from "../../primitives/Typography/Typography";
import { useNavigate } from "react-router-dom";
import styles from "./EventCard.module.css";

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
);

/**
 * COMPONENTE: EventCard (US3)
 * 
 * PROPÓSITO: Muestra la información resumida de un evento en la grilla principal.
 * 
 * EDGE CASES MANEJADOS:
 * - Si falta un dato (null/undefined), la card no se rompe gracias a los operadores `&&` y optional chaining `?.`.
 * - Si la imagen falla o no existe, el espacio se mantiene sin romperse.
 * - Soporta un estado `isLoading` que muestra un Skeleton de carga antes de tener los datos.
 */
export default function EventCard({
  id = "",
  status = "DISPONIBLE",
  statusTone = "success",
  title = "Noche de Furia en el Nesta",
  genres = [],
  date = "",
  time = "",
  venue = "",
  price = "",
  imageUrl = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
  artists = [],
  highlighted = false,
  isLoading = false,
}) {
  const navigate = useNavigate();

  // ESTADO DE CARGA: Retorna la versión Skeleton de la card
  if (isLoading) {
    return (
      <Card className={`${styles.card} ${styles.skeletonCard}`}>
        <div className={`${styles.media} ${styles.skeletonMedia}`} />
        <div className={styles.content}>
          <div className={`${styles.skeletonText} ${styles.skeletonChips}`} />
          <div className={`${styles.skeletonText} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeletonText} ${styles.skeletonLine}`} />
          <div className={`${styles.skeletonText} ${styles.skeletonLine}`} />
          <div className={`${styles.skeletonText} ${styles.skeletonLine}`} />
          <div className={styles.actions}>
             <div className={`${styles.skeletonText} ${styles.skeletonButton}`} />
          </div>
        </div>
      </Card>
    );
  }

  // RENDERIZADO SEGURO: Cada elemento comprueba la existencia de su dato antes de renderizarse
  return (
    <Card highlighted={highlighted} className={styles.card}>
      <div className={styles.media}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title || "Evento"}
            loading="lazy"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        )}
        <div className={styles.topBar}>
          {status && <Badge tone={statusTone}>{status}</Badge>}
          {price && <span className={styles.price}>{price}</span>}
        </div>
      </div>
      <div className={styles.content}>
        {/* Array seguro usando optional chaining y fallback a array vacío */}
        {(genres || []).length > 0 && (
          <div className={styles.chips}>
            {genres.map((genre) => (
              <Chip key={genre}>{genre}</Chip>
            ))}
          </div>
        )}
        
        {title && <Typography variant="h3">{title}</Typography>}
        
        <div className={styles.infoList}>
          {date && (
            <div className={styles.infoItem}>
              <CalendarIcon />
              <Typography variant="caption">{date}</Typography>
            </div>
          )}
          {time && (
            <div className={styles.infoItem}>
              <ClockIcon />
              <Typography variant="caption">{time}</Typography>
            </div>
          )}
          {venue && (
            <div className={styles.infoItem}>
              <MapPinIcon />
              <Typography variant="caption">{venue}</Typography>
            </div>
          )}
        </div>
        
        <div className={styles.actions}>
          {(artists || []).length > 0 && (
             <span className={styles.artistsCount}>+ {artists.length} Artis{artists.length === 1 ? 'ta' : 'tas'}</span>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="ghost" size="sm" onClick={() => id && navigate(`/events/${id}`)}>
              VER MÁS →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
