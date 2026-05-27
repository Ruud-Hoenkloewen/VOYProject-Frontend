import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../../services/eventService";
import Button from "../../design-system/primitives/Button/Button";
import Typography from "../../design-system/primitives/Typography/Typography";
import styles from "./EventDetailPage.module.css";
import {
  CalendarIcon, ClockIcon, MapPinIcon, WarningIcon, MusicIcon,
  TicketIcon, HeartIcon, ShareIcon, UsersIcon, InstagramIcon,
  ExternalLinkIcon, ZapIcon, UserCheckIcon, ShirtIcon, RefreshIcon,
  AccessibilityIcon, CameraIcon, UtensilsIcon, CigaretteIcon, PeopleIcon
} from "../../components/icons";
import { addMinutes, igSlug } from "../../utils/helpers";
import { CONCERT_PHOTOS, BAND_DESCRIPTIONS } from "../../utils/mockData";

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
