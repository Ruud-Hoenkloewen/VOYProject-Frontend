import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../../services/eventService";
import { useAuth } from "../../context/AuthContext";
import Button from "../../design-system/primitives/Button/Button";
import Typography from "../../design-system/primitives/Typography/Typography";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import styles from "./EventDetailPage.module.css";
import 'leaflet/dist/leaflet.css';

import {
  CalendarIcon, ClockIcon, MapPinIcon, WarningIcon, MusicIcon,
  HeartIcon, UsersIcon, ZapIcon, RefreshIcon, UtensilsIcon, PeopleIcon
} from "../../components/icons";
import { addMinutes } from "../../utils/helpers";
import { CONCERT_PHOTOS, BAND_DESCRIPTIONS } from "../../utils/mockData";

import Timeline from "./components/Timeline/Timeline";
import ArtistGrid from "./components/ArtistGrid/ArtistGrid";
import TicketCard from "./components/TicketCard/TicketCard";
import EventMapPreview from "../../components/EventMapPreview/EventMapPreview";
import EventCommentsSection from "./components/EventCommentsSection/EventCommentsSection";

const SET_DURATION   = 55;
const PUERTAS_OFFSET = 30;

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, handleToggleFavorite } = useAuth();
  
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const [toastNotice, setToastNotice] = useState("");

  const isFavorite = user?.favoritos?.includes(id) || false;

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  const toggleFavAction = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setIsTogglingFav(true);
      if (handleToggleFavorite) {
        await handleToggleFavorite(id);
        showToast(isFavorite ? "Quitado de tus guardados" : "¡Guardado en tus favoritos! ❤️");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingFav(false);
    }
  };

  const getEventDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEventById(id);
      setEventData(data);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError(err.response?.status === 404 ? "not_found" : "network_error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) getEventDetail(); }, [id, getEventDetail]);

  if (loading) return (
    <div className={styles.root}>
      <div className={styles.skeletonHero} />
      <main className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.skeletonPulse} style={{ height: 24, width: "40%", borderRadius: 4 }} />
          <div className={styles.skeletonPulse} style={{ height: 80, width: "80%", borderRadius: 4, marginTop: 8 }} />
        </div>
      </main>
    </div>
  );

  if (error) return (
    <div className={styles.errorState}>
      <Typography variant="display">{error === "not_found" ? "404" : "Ups"}</Typography>
      <Typography variant="h2">{error === "not_found" ? "Evento no encontrado" : "Algo salió mal"}</Typography>
      <Button onClick={() => navigate("/events")} variant="primary">← Volver a eventos</Button>
    </div>
  );

  if (!eventData) return null;

  const isSoldOut = eventData.status === "AGOTADO";
  const doorsOpenTime = eventData.time?.replace(/\s*HS\s*/i, "") || "22:00";
  const numArtists    = eventData.artists?.length || 1;
  const venueCloseTime = addMinutes(doorsOpenTime, PUERTAS_OFFSET + numArtists * SET_DURATION);

  return (
    <div className={styles.root}>
      <EditorialHeader transparent={true} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        {eventData.imageUrl && (
          <img src={eventData.imageUrl} alt={eventData.title} className={styles.heroBg} />
        )}
        <div className={styles.heroOverlay} />

        <div className={styles.heroTitleBlock}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 className={styles.heroTitle}>{eventData.title}</h1>
            <button 
              className={`${styles.heroFavBtn} ${isFavorite ? styles.heroFavBtnActive : ""}`}
              onClick={toggleFavAction}
              disabled={isTogglingFav}
              aria-label="Guardar en favoritos"
            >
              <HeartIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────────────── */}
      <main className={styles.container}>

        <div className={styles.leftColumn}>

          {/* BARRA: Fecha / Puertas / Lugar */}
          <div className={styles.topInfoBar}>
            <div className={styles.infoItem}>
              <span className={styles.iconNeon}><CalendarIcon /></span>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>FECHA</span>
                <span className={styles.infoValue}>{eventData.date}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.iconNeon}><ClockIcon /></span>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>PUERTAS</span>
                <span className={styles.infoValue}>{eventData.time}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.iconNeon}><MapPinIcon /></span>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>LUGAR</span>
                <span className={styles.infoValue}>{eventData.venue}</span>
              </div>
            </div>
          </div>

          {/* LA MOVIDA */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.iconMagenta}><WarningIcon /></span>
              <h2 className={styles.sectionTitle}>LA MOVIDA</h2>
            </div>
            <p className={styles.movidaDescription}>
              {eventData.rawPrice === 0
                ? "Entrada libre y gratuita. De esas que quedan en el recuerdo y terminan en algún patio con mate."
                : "Entrada en mano en la puerta. Llegá temprano que los venues son chicos y se llena rápido."
              }
            </p>
          </div>

          {/* UBICACIÓN Y MAPA INTERACTIVO */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.iconMagenta}><MapPinIcon /></span>
              <h2 className={styles.sectionTitle}>UBICACIÓN Y MAPA</h2>
            </div>
            <EventMapPreview venue={eventData.venue} height={260} showDirectionsBtn={true} />
          </div>

          {/* ORDEN DEL SHOW — Timeline Reworked */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.iconMagenta}><MusicIcon /></span>
              <h2 className={styles.sectionTitle}>ORDEN DEL SHOW</h2>
            </div>
            <Timeline 
              doorsOpenTime={doorsOpenTime}
              venueCloseTime={venueCloseTime}
              artists={eventData.artists}
            />
          </div>

          {/* ARTISTAS */}
          {eventData.artists?.length > 0 && (
            <div className={styles.section}>
              <div className={styles.artistsHeader}>
                <div className={styles.sectionHeader}>
                  <span className={styles.iconMagenta}><UsersIcon /></span>
                  <h2 className={styles.sectionTitle}>ARTISTAS</h2>
                </div>
              </div>
              <ArtistGrid 
                artists={eventData.artists} 
                concertPhotos={CONCERT_PHOTOS} 
                bandDescriptions={BAND_DESCRIPTIONS} 
              />
            </div>
          )}

          {/* INFO DEL EVENTO — Reworked (Solo 4 ítems esenciales) */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.iconMagenta}><ZapIcon /></span>
              <h2 className={styles.sectionTitle}>INFO DEL EVENTO</h2>
            </div>

            <div className={styles.infoGrid}>
              {[
                { 
                  icon: <PeopleIcon />, 
                  label: "CAPACIDAD", 
                  value: eventData.capacity ? `${eventData.capacity} personas` : "Venue chico (40 personas)" 
                },
                { 
                  icon: <UtensilsIcon />, 
                  label: "BAR / CONSUMICIONES", 
                  value: "Tragos y comida" 
                },
                { 
                  icon: <MapPinIcon />, 
                  label: "PISOS / ESTRUCTURA", 
                  value: "Planta baja" 
                },
                { 
                  icon: <RefreshIcon />, 
                  label: "REINGRESO", 
                  value: "Permitido", 
                  highlight: true 
                },
              ].map((item, idx) => (
                <div key={idx} className={styles.infoCell}>
                  <div className={styles.infoCellIcon}>{item.icon}</div>
                  <div className={styles.infoCellText}>
                    <span className={styles.infoCellLabel}>{item.label}</span>
                    <span className={`${styles.infoCellValue} ${item.highlight ? styles.infoCellHighlight : ""}`}>
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMENTARIOS DE LA MOVIDA */}
          <EventCommentsSection 
            eventId={id} 
            initialComments={eventData.comentarios || []} 
            eventCreatorId={eventData.creador?._id || eventData.creador}
          />

        </div>

        <div className={styles.rightColumn}>
          <TicketCard eventData={eventData} isSoldOut={isSoldOut} id={id} onShowToast={showToast} />
        </div>

      </main>

      {/* TOAST NOTICE */}
      {toastNotice && (
        <div className={styles.toastNotice}>
          {toastNotice}
        </div>
      )}
    </div>
  );
}
