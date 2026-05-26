import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../services/eventService";
import Button from "../design-system/primitives/Button/Button";
import Typography from "../design-system/primitives/Typography/Typography";
import styles from "./EventDetailPage.module.css";

// ─── Iconos SVG ────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
);
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
const MusicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);
const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
);
const InfoIcon = null; // reserved, not yet used

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
);
const UserCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
);
const ShirtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
);
const AccessibilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>
);
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const UtensilsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
);
const CigaretteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12H2v4h16"/><path d="M22 12v4"/><path d="M7 12v4"/><path d="M18 8c0-2.5-2-2.5-2-5"/><path d="M22 8c0-2.5-2-2.5-2-5"/></svg>
);
const PeopleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
// ─────────────────────────────────────────────────────────────────────────────

// Genera hora sumando minutos a un string "HH:MM"
const addMinutes = (timeStr, mins) => {
  const clean = timeStr?.replace(/\s*HS\s*/i, "") || "19:00";
  const [h, m] = clean.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return "";
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
};

// Genera el slug de IG quitando tildes
const igSlug = (name) =>
  name.toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[áàä]/g, "a").replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i").replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u");

// ─── Static data (outside component to avoid recreation on every render) ────
const CONCERT_PHOTOS = [
  "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80",
];

const BAND_DESCRIPTIONS = [
  "Indie del barrio. Letras de caño y de tarde.",
  "Shoegaze tucumano. Suenan como si el calor se volviera ruido.",
  "Rock alternativo desde el centro. Tocan en cualquier patio.",
  "Punk acústico con actitud. Tres acordes y la verdad.",
  "Post-rock instrumental. Ninguno estudió música y se nota bien.",
  "Folk under. Los encontrás en Instagram antes que en un estudio.",
];

// Duración de cada set en minutos
const SET_DURATION   = 55;
const PUERTAS_OFFSET = 30; // primer set empieza 30 min después de puertas

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

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

  const concertPhotos  = CONCERT_PHOTOS;
  const bandDescriptions = BAND_DESCRIPTIONS;


  // Artistas lineup en texto (para el hero, si se necesita)
  // const artistNames = eventData.artists?.map(a => a.nombre).join(" | ") || "";


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
        <button className={styles.heroHeart}>
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

              <div className={styles.timeline}>
                {timelineItems.map((item, idx) => {
                  const isPast   = item.role === "cierre";
                  const isGreen  = item.role === "puertas";
                  const isMag    = item.role === "headliner";
                  const timeClass = isGreen
                    ? styles.tlTimeGreen
                    : isMag
                    ? styles.tlTimeMagenta
                    : isPast
                    ? styles.tlTimeGrey
                    : styles.tlTimeWhite;
                  const dotClass = isGreen
                    ? styles.dotGreen
                    : isMag
                    ? styles.dotMagenta
                    : styles.dotGrey;
                  const titleClass = isPast
                    ? styles.tlTitleGrey
                    : isMag
                    ? styles.tlTitleMagenta
                    : styles.tlTitleWhite;

                  return (
                    <div key={`${item.time}-${idx}`} className={styles.tlRow}>
                      {/* Hora */}
                      <div className={`${styles.tlTime} ${timeClass}`}>{item.time}</div>

                      {/* Dot + line */}
                      <div className={styles.tlDivider}>
                        <div className={`${styles.tlDot} ${dotClass}`} />
                        {idx !== timelineItems.length - 1 && (
                          <div className={styles.tlLine} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={styles.tlContent}>
                        <div className={styles.tlTitleRow}>
                          <span className={`${styles.tlTitle} ${titleClass}`}>{item.title}</span>
                          {item.badge && (
                            <span className={`${styles.tlBadge} ${
                              item.role === "headliner"
                                ? styles.badgeMagenta
                                : item.role === "apertura"
                                ? styles.badgeGreen
                                : styles.badgeCyan
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className={styles.tlSubtitle}>{item.subtitle}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
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

              <div className={styles.artistsGrid}>
                {eventData.artists.map((artist, idx) => {
                  const isHeadliner = idx === n - 1;
                  const isApertura  = idx === 0;
                  const isInvitada  = idx === 1 && n > 2;
                  const badgeColor  = isHeadliner ? "magenta" : isApertura ? "green" : "grey";
                  const badgeText   = isHeadliner ? "HEADLINER" : isApertura ? "APERTURA" : isInvitada ? "INVITADA" : null;
                  const photo  = concertPhotos[idx % concertPhotos.length];
                  const desc   = bandDescriptions[idx % bandDescriptions.length];

                  return (
                    <div key={artist._id || `artist-${idx}`} className={styles.artistCard}>
                      <div className={styles.artistCardBg}>
                        <img src={photo} alt={artist.nombre} className={styles.artistCardImg} />
                        <div className={styles.artistCardGradient} />
                        {badgeText && (
                          <span className={`${styles.artistCardBadge} ${styles[`bg_${badgeColor}`]}`}>
                            {badgeText}
                          </span>
                        )}
                      </div>

                      <div className={styles.artistCardContent}>
                        <div className={styles.artistCardInfo}>
                          <h3 className={styles.artistCardName}>{artist.nombre}</h3>
                          <p className={styles.artistCardDesc}>{desc}</p>
                        </div>
                        <div className={styles.artistCardFooter}>
                          <div className={styles.artistIgBadge}>
                            <InstagramIcon />
                            <span>@{igSlug(artist.nombre)}</span>
                          </div>
                          <button className={styles.artistProfileBtn}>
                            Ver perfil <ExternalLinkIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
          <div className={styles.ticketCard}>
            <div className={styles.ticketHeader}>
              <span className={styles.ticketType}>ENTRADA GENERAL</span>
              <div className={styles.ticketPriceValue}>{eventData.price}</div>
              <span className={styles.ticketFee}>+ cargo por servicio</span>
            </div>

            <div className={styles.ticketDetails}>
              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>ESTADO</span>
                <span className={`${styles.ticketValueBadge} ${isSoldOut ? styles.badgeValSoldout : styles.badgeValAvailable}`}>
                  {eventData.status}
                </span>
              </div>
              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>CAPACIDAD</span>
                <span className={styles.ticketValue}>
                  {eventData.capacity ? `${eventData.capacity} personas` : "Venue chico"}
                </span>
              </div>
              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>RESTRICCIÓN</span>
                <span className={styles.ticketValue}>Apto todo público</span>
              </div>
              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>REINGRESO</span>
                <span className={`${styles.ticketValue} ${styles.textNeon}`}>Permitido</span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.buyButton}
                disabled={isSoldOut}
                onClick={() => navigate(`/events/${id}/checkout`, { state: { eventData } })}
              >
                <TicketIcon /> {isSoldOut ? "AGOTADO" : "COMPRAR ENTRADA"}
              </button>
              <button className={styles.outlineButton}><HeartIcon /> GUARDAR EVENTO</button>
              <button className={styles.outlineButton}><ShareIcon /> COMPARTIR EVENTO</button>
            </div>

            <p className={styles.termsText}>
              Al comprar tu entrada aceptás los <a href="#">términos y condiciones de VOYProject</a>.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
