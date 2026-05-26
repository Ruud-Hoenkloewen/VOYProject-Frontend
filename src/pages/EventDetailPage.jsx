import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../services/eventService";
import Button from "../design-system/primitives/Button/Button";
import Badge from "../design-system/primitives/Badge/Badge";
import Card from "../design-system/primitives/Card/Card";
import Chip from "../design-system/primitives/Chip/Chip";
import Typography from "../design-system/primitives/Typography/Typography";
import styles from "./EventDetailPage.module.css";

// Iconos
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
);

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  const getEventDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEventById(id);
      setEventData(data);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError(err.response?.status === 404 ? 'not_found' : 'network_error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getEventDetail();
    }
  }, [id, getEventDetail]);

  if (loading) {
    return (
      <div className={styles.root}>
        <div className={styles.headerBar}>
          <Button variant="ghost" onClick={() => navigate("/events")}>← Volver a eventos</Button>
        </div>
        <main className={styles.container}>
          <Card className={`${styles.maxCard} ${styles.skeletonCard}`}>
             <div className={`${styles.mediaSection} ${styles.skeletonPulse}`} />
             <div className={styles.contentSection}>
               <div className={`${styles.skeletonPulse} ${styles.skeletonBadge}`} />
               <div className={`${styles.skeletonPulse} ${styles.skeletonTitle}`} />
               <div className={`${styles.skeletonPulse} ${styles.skeletonDetail}`} />
               <div className={`${styles.skeletonPulse} ${styles.skeletonDetailShort}`} />
             </div>
          </Card>
        </main>
      </div>
    );
  }

  if (error === 'not_found') {
    return (
      <div className={styles.errorState}>
        <Typography variant="display">404</Typography>
        <Typography variant="h2">Evento no encontrado</Typography>
        <Typography variant="body" className={styles.errorMsg}>El evento que estás buscando no existe o fue eliminado.</Typography>
        <Button onClick={() => navigate("/events")} variant="primary">
          ← Volver a eventos
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <Typography variant="h2">Ups, algo salió mal</Typography>
        <Typography variant="body" className={styles.errorMsg}>No pudimos cargar la información del evento. Por favor revisa tu conexión.</Typography>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button onClick={getEventDetail} variant="primary">Reintentar</Button>
          <Button onClick={() => navigate("/events")} variant="ghost">← Volver a eventos</Button>
        </div>
      </div>
    );
  }

  if (!eventData) return null;

  const isSoldOut = eventData.status === 'AGOTADO';

  return (
    <div className={styles.root}>
      {/* Botón superior integrado (no flotante ni ruidoso) */}
      <header className={styles.headerBar}>
        <Button variant="ghost" onClick={() => navigate("/events")}>
          ← Volver a eventos
        </Button>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className={styles.container}>
        
        {/* CARD MÁXIMA */}
        <Card className={styles.maxCard}>
          
          {/* LADO IZQUIERDO: IMAGEN */}
          <div className={styles.mediaSection}>
            {eventData.imageUrl && !imgError ? (
              <img 
                src={eventData.imageUrl} 
                alt={eventData.title} 
                className={styles.image}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={styles.fallbackImage}>{eventData.title}</div>
            )}
          </div>

          {/* LADO DERECHO: CONTENIDO */}
          <div className={styles.contentSection}>
            
            <div className={styles.topBadges}>
              <Badge tone={eventData.statusTone}>{eventData.status}</Badge>
              {eventData.genres?.length > 0 && (
                <div className={styles.genres}>
                  {eventData.genres.map(g => (
                    <Chip key={g}>{g}</Chip>
                  ))}
                </div>
              )}
            </div>

            <Typography variant="display" className={styles.title}>
              {eventData.title}
            </Typography>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <div className={styles.iconWrapper}><CalendarIcon /></div>
                <div className={styles.detailText}>
                  <Typography variant="caption" className={styles.detailLabel}>Fecha</Typography>
                  <Typography variant="body" className={styles.detailValue}>{eventData.date}</Typography>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.iconWrapper}><ClockIcon /></div>
                <div className={styles.detailText}>
                  <Typography variant="caption" className={styles.detailLabel}>Horario</Typography>
                  <Typography variant="body" className={styles.detailValue}>{eventData.time}</Typography>
                </div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.iconWrapper}><MapPinIcon /></div>
                <div className={styles.detailText}>
                  <Typography variant="caption" className={styles.detailLabel}>Lugar</Typography>
                  <Typography variant="body" className={styles.detailValue}>{eventData.venue}</Typography>
                </div>
              </div>
            </div>

            {eventData.artists?.length > 0 && (
              <div className={styles.artistsSection}>
                <Typography variant="h3" className={styles.sectionTitle}>Line Up</Typography>
                <div className={styles.artistList}>
                  {eventData.artists.map((artist, idx) => (
                    <div key={idx} className={styles.artistName}>
                      {artist.nombre}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN DE COMPRA (INCORPORADA A LA CARD) */}
            <div className={styles.ticketSection}>
              <div className={styles.priceContainer}>
                <Typography variant="caption" className={styles.priceLabel}>Valor de la entrada</Typography>
                <Typography variant="display" className={styles.priceValue}>{eventData.price}</Typography>
              </div>

              <div className={styles.buyAction}>
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  disabled={isSoldOut}
                  className={styles.buyButton}
                  onClick={() => navigate(`/events/${id}/checkout`, { state: { eventData } })}
                >
                  {isSoldOut ? "Sin entradas disponibles" : "Comprar Entrada"}
                </Button>
                <Typography variant="caption" className={styles.purchaseNote}>
                  Pagos seguros procesados a través de MercadoPago.
                </Typography>
              </div>
            </div>

          </div>
        </Card>
      </main>
    </div>
  );
}
