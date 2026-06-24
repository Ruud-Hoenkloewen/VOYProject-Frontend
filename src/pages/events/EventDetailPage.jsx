import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../../services/eventService";
import { updateMyProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import Button from "../../design-system/primitives/Button/Button";
import Typography from "../../design-system/primitives/Typography/Typography";
import styles from "./EventDetailPage.module.css";
import {
  CalendarIcon, ClockIcon, MapPinIcon, WarningIcon, MusicIcon,
  HeartIcon, UsersIcon, ZapIcon, UserCheckIcon, ShirtIcon, RefreshIcon,
  AccessibilityIcon, CameraIcon, UtensilsIcon, CigaretteIcon, PeopleIcon
} from "../../components/icons";
import { addMinutes } from "../../utils/helpers";
import { CONCERT_PHOTOS, BAND_DESCRIPTIONS } from "../../utils/mockData";

import Timeline from "./components/Timeline/Timeline";
import ArtistGrid from "./components/ArtistGrid/ArtistGrid";
import TicketCard from "./components/TicketCard/TicketCard";
import EventMap from "../../components/EventMap/EventMap";

// Duración de cada set en minutos
const SET_DURATION   = 55;
const PUERTAS_OFFSET = 30; // primer set empieza 30 min después de puertas

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated } = useAuth();
  
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [isTogglingFav, setIsTogglingFav] = useState(false);

  const isFavorite = user?.favoritos?.includes(id) || false;

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setIsTogglingFav(true);
      const currentFavs = user?.favoritos || [];
      const newFavs = isFavorite 
        ? currentFavs.filter(favId => favId !== id)
        : [...currentFavs, id];
        
      const updatedUser = await updateMyProfile({ favoritos: newFavs });
      updateUser(updatedUser);
    } catch (err) {
      console.error("Error toggling favorite:", err);
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

  // ─── Loading ───────────────────────────────────────────────────────────────
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

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (error) return (
    <div className={styles.errorState}>
      <Typography variant="display">{error === "not_found" ? "404" : "Ups"}</Typography>
      <Typography variant="h2">{error === "not_found" ? "Evento no encontrado" : "Algo salió mal"}</Typography>
      <Button onClick={() => navigate("/events")} variant="primary">← Volver a eventos</Button>
    </div>
  );

  if (!eventData) return null;

  const isSoldOut = eventData.status === "AGOTADO";
  const baseTime  = eventData.time?.replace(/\s*HS\s*/i, "") || "19:00";

  // ─── Build Timeline ────────────────────────────────────────────────────────
  const n = eventData.artists?.length || 0;
  const timelineItems = n ? [
    {
      time: baseTime,
      title: "PUERTAS ABREN",
      subtitle: "Ingreso al venue",
      role: "puertas",
      badge: null,
    },
    ...eventData.artists.map((artist, idx) => {
      const isHeadliner = idx === n - 1;
      const isApertura  = idx === 0;
      const isInvitada  = idx === 1 && n > 2;
      const startTime   = addMinutes(baseTime, PUERTAS_OFFSET + idx * SET_DURATION);
      const endTime     = addMinutes(baseTime, PUERTAS_OFFSET + (idx + 1) * SET_DURATION);
      const role        = isHeadliner ? "headliner" : isApertura ? "apertura" : "default";
      const badge       = isHeadliner ? "HEADLINER" : isApertura ? "APERTURA" : isInvitada ? "INVITADA" : null;
      const subtitle    = isHeadliner
        ? `Headliner · hasta las ${endTime} hs`
        : isApertura
        ? `Apertura · hasta las ${endTime} hs`
        : `Set completo · hasta las ${endTime} hs`;
      return { time: startTime, title: artist.nombre, subtitle, role, badge };
    }),
    {
      time: addMinutes(baseTime, PUERTAS_OFFSET + n * SET_DURATION),
      title: "CIERRE DEL VENUE",
      subtitle: "Fin del evento",
      role: "cierre",
      badge: null,
    },
  ] : [];

  return (
    <div className={styles.root}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        {eventData.imageUrl && (
          <img src={eventData.imageUrl} alt={eventData.title} className={styles.heroBg} />
        )}
        <div className={styles.heroOverlay} />

        {/* Nav buttons */}
        <button className={styles.heroBack} onClick={() => navigate("/events")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          className={`${styles.heroHeart} ${isFavorite ? styles.heroHeartActive : ''}`}
          onClick={handleToggleFavorite}
          disabled={isTogglingFav}
          style={{ color: isFavorite ? 'var(--ds-color-magenta-400)' : 'currentColor' }}
        >
          <HeartIcon />
        </button>

        {/* Bottom-left big title */}
        <div className={styles.heroTitleBlock}>
          <h1 className={styles.heroTitle}>{eventData.title}</h1>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────────────── */}
      <main className={styles.container}>

        {/* ── COLUMNA IZQUIERDA ─────────────────────────────────────────── */}
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

          {/* UBICACIÓN — mapa interactivo si hay coordenadas, sino solo texto */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.iconNeon}><MapPinIcon /></span>
              <h2 className={styles.sectionTitle}>UBICACIÓN</h2>
            </div>
            {eventData.coordenadas ? (
              <EventMap
                coordenadas={eventData.coordenadas}
                venue={eventData.venue}
                direccion={eventData.direccion}
              />
            ) : (
              <p className={styles.movidaDescription}>
                {eventData.direccion || `${eventData.venue} — dirección a confirmar.`}
              </p>
            )}
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

          {/* ORDEN DEL SHOW — Timeline */}
          {timelineItems.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.iconMagenta}><MusicIcon /></span>
                <h2 className={styles.sectionTitle}>ORDEN DEL SHOW</h2>
              </div>
              <Timeline items={timelineItems} />
            </div>
          )}

          {/* ARTISTAS */}
          {eventData.artists?.length > 0 && (
            <div className={styles.section}>
              <div className={styles.artistsHeader}>
                <div className={styles.sectionHeader}>
                  <span className={styles.iconMagenta}><UsersIcon /></span>
                  <h2 className={styles.sectionTitle}>ARTISTAS</h2>
                </div>
                <span className={styles.inDev}>● EN DESARROLLO</span>
              </div>
              <ArtistGrid 
                artists={eventData.artists} 
                concertPhotos={CONCERT_PHOTOS} 
                bandDescriptions={BAND_DESCRIPTIONS} 
              />
            </div>
          )}

          {/* INFO DEL EVENTO */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.iconNeon}><ZapIcon /></span>
              <h2 className={styles.sectionTitle}>INFO DEL EVENTO</h2>
            </div>

            <div className={styles.infoGrid}>
              {[
                { icon: <UserCheckIcon />, label: "EDAD MÍNIMA",   value: "Apto todo público" },
                { icon: <ShirtIcon />,     label: "VESTIMENTA",    value: "Libre" },
                { icon: <RefreshIcon />,   label: "REINGRESO",     value: "Permitido", highlight: true },
                { icon: <AccessibilityIcon />, label: "ACCESIBILIDAD", value: "Consultar con el organizador" },
                { icon: <CameraIcon />,    label: "FOTOGRAFÍA",    value: "Sí, compartí y etiquetá" },
                { icon: <UtensilsIcon />,  label: "CONSUMICIONES", value: eventData.rawPrice === 0 ? "Feria y bares propios" : "Bar del lugar" },
                { icon: <CigaretteIcon />, label: "FUMADORES",     value: "Área exterior" },
                { icon: <PeopleIcon />,    label: "CAPACIDAD",     value: eventData.capacity ? `${eventData.capacity} personas` : "Venue chico — llegá temprano" },
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

        </div>{/* /leftColumn */}

        {/* ── COLUMNA DERECHA: TICKET CARD ──────────────────────────────── */}
        <div className={styles.rightColumn}>
          <TicketCard eventData={eventData} isSoldOut={isSoldOut} id={id} />
        </div>

      </main>
    </div>
  );
}
