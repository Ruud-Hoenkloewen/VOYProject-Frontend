import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchEvents } from "../../services/eventService";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon,
  ArrowRightIcon,
  ExternalLinkIcon
} from "../../components/icons";
import styles from "./ArtistCalendarPage.module.css";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function ArtistCalendarPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Septiembre 2026 por defecto (mes de primeros shows)
  const [selectedDay, setSelectedDay] = useState(null);
  const [filterMode, setFilterMode] = useState("TODOS"); // "TODOS" | "MES" | "HEADLINER"

  const userName = user?.nombre || user?.username || "Artista";
  const userHandle = user?.username ? `@${user.username}` : "";

  // Cargar eventos del backend y filtrar los de la banda
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const events = await fetchEvents();
        const normName = (user?.nombre || '').toLowerCase().trim();
        const normUser = (user?.username || '').toLowerCase().trim();

        // Filtrar eventos donde toca este artista
        const matched = events.filter(evt => {
          if (!evt.artists) return false;
          return evt.artists.some(a => {
            const aName = (a.nombre || '').toLowerCase().trim();
            const aUser = (a.usuario?.username || '').toLowerCase().trim();
            return (normUser && aUser === normUser) || (normName && aName === normName);
          });
        });

        const listToUse = matched;
        setAllEvents(listToUse);

        // Fijar el mes inicial en el primer evento futuro si existe
        if (listToUse.length > 0 && listToUse[0].rawDate) {
          setCurrentDate(new Date(listToUse[0].rawDate.getFullYear(), listToUse[0].rawDate.getMonth(), 1));
        }
      } catch (err) {
        console.error("Error al cargar calendario:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [user]);

  // Navegación de mes del calendario
  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  // Cálculo de los días del mes actual para la grilla del calendario
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Relleno de días vacíos anteriores
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, key: `empty-prev-${i}` });
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      
      // Buscar si hay eventos en este día
      const dayEvents = allEvents.filter(evt => {
        if (!evt.rawDate) return false;
        const eDate = new Date(evt.rawDate);
        return eDate.getFullYear() === year && eDate.getMonth() === month && eDate.getDate() === day;
      });

      days.push({
        dayNumber: day,
        dateObj,
        hasEvents: dayEvents.length > 0,
        events: dayEvents,
        key: `day-${day}`
      });
    }

    return days;
  }, [currentDate, allEvents]);

  // Lista de eventos filtrados para las tarjetas
  const displayedEvents = useMemo(() => {
    let list = [...allEvents];

    if (selectedDay) {
      const y = selectedDay.getFullYear();
      const m = selectedDay.getMonth();
      const d = selectedDay.getDate();
      list = list.filter(evt => {
        if (!evt.rawDate) return false;
        const eDate = new Date(evt.rawDate);
        return eDate.getFullYear() === y && eDate.getMonth() === m && eDate.getDate() === d;
      });
    } else if (filterMode === "MES") {
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth();
      list = list.filter(evt => {
        if (!evt.rawDate) return false;
        const eDate = new Date(evt.rawDate);
        return eDate.getFullYear() === y && eDate.getMonth() === m;
      });
    }

    return list;
  }, [allEvents, selectedDay, filterMode, currentDate]);

  return (
    <div className={styles.pageRoot}>
      <EditorialHeader transparent={false} />

      <main className={styles.mainContainer}>
        {/* Encabezado Superior */}
        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard/artist')}>
            <ChevronLeftIcon size={18} />
            <span>VOLVER AL DASHBOARD</span>
          </button>

          <div className={styles.titleBlock}>
            <h1 className={styles.pageTitle}>CALENDARIO DE FECHAS</h1>
          </div>
        </div>

        {/* Layout Principal: Calendario Interactivo + Grilla de Tarjetas */}
        <div className={styles.layoutGrid}>
          
          {/* COLUMNA IZQUIERDA: CALENDARIO MENSUAL */}
          <section className={styles.calendarSection}>
            <div className={styles.calendarBox}>
              <div className={styles.calendarControls}>
                <button className={styles.navMonthBtn} onClick={prevMonth} aria-label="Mes anterior">
                  <ChevronLeftIcon size={18} />
                </button>
                <h3 className={styles.monthTitle}>
                  {MONTH_NAMES[currentDate.getMonth()].toUpperCase()} {currentDate.getFullYear()}
                </h3>
                <button className={styles.navMonthBtn} onClick={nextMonth} aria-label="Mes siguiente">
                  <ChevronRightIcon size={18} />
                </button>
              </div>

              {/* Encabezados de Días de la Semana */}
              <div className={styles.weekdaysGrid}>
                {WEEKDAY_NAMES.map((wd, i) => (
                  <span key={i} className={styles.weekdayCell}>{wd}</span>
                ))}
              </div>

              {/* Grilla de Días del Mes */}
              <div className={styles.daysGrid}>
                {calendarDays.map((cell) => {
                  if (!cell.dayNumber) {
                    return <div key={cell.key} className={styles.emptyCell} />;
                  }

                  const isSelected = selectedDay && 
                    selectedDay.getDate() === cell.dayNumber &&
                    selectedDay.getMonth() === currentDate.getMonth() &&
                    selectedDay.getFullYear() === currentDate.getFullYear();

                  return (
                    <button
                      key={cell.key}
                      className={`
                        ${styles.dayCell}
                        ${cell.hasEvents ? styles.hasEventsCell : ''}
                        ${isSelected ? styles.selectedDayCell : ''}
                      `}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedDay(null);
                        } else {
                          setSelectedDay(cell.dateObj);
                        }
                      }}
                    >
                      <span className={styles.dayNum}>{cell.dayNumber}</span>
                      {cell.hasEvents && (
                        <div className={styles.eventDotBadge}>
                          <span className={styles.eventDot} />
                          <span className={styles.eventCountLabel}>{cell.events.length}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className={styles.calendarFooterNotice}>
                <span className={styles.legendDot} />
                <span>Días con recitales confirmados en la plataforma</span>
              </div>
            </div>
          </section>

          {/* COLUMNA DERECHA: GRILLA DE TARJETAS DE MOVIDAS Y RECITALES */}
          <section className={styles.eventsListSection}>
            <div className={styles.filterBar}>
              <div className={styles.filterGroup}>
                <button 
                  className={`${styles.filterChip} ${filterMode === "TODOS" && !selectedDay ? styles.filterChipActive : ''}`}
                  onClick={() => { setFilterMode("TODOS"); setSelectedDay(null); }}
                >
                  TODAS LAS FECHAS ({allEvents.length})
                </button>
                <button 
                  className={`${styles.filterChip} ${filterMode === "MES" && !selectedDay ? styles.filterChipActive : ''}`}
                  onClick={() => { setFilterMode("MES"); setSelectedDay(null); }}
                >
                  ESTE MES ({MONTH_NAMES[currentDate.getMonth()]})
                </button>
              </div>

              {selectedDay && (
                <button className={styles.clearSelectedBtn} onClick={() => setSelectedDay(null)}>
                  Ver todas las fechas ✕
                </button>
              )}
            </div>

            {selectedDay && (
              <div className={styles.selectedDayNotice}>
                Mostrando fechas para el <strong>{selectedDay.getDate()} de {MONTH_NAMES[selectedDay.getMonth()]}</strong>:
              </div>
            )}

            {displayedEvents.length === 0 ? (
              <div className={styles.emptyEventsState}>
                <CalendarIcon size={36} className={styles.emptyIcon} />
                <h3 style={{ margin: "6px 0 0 0", fontSize: "1rem" }}>No tenes ningun evento confirmado todavia.</h3>
              </div>
            ) : (
              <div className={styles.showCardsGrid}>
                {displayedEvents.map((evt) => {
                  const normName = (user?.nombre || '').toLowerCase().trim();
                  const isHeadliner = evt.artists?.some(a => a.headliner && (a.nombre || '').toLowerCase().trim() === normName);

                  return (
                    <div key={evt.id} className={styles.showCard}>
                      <div className={styles.showCardBanner}>
                        <img src={evt.imageUrl} alt={evt.title} className={styles.showFlyerImg} />
                        <div className={styles.showCardOverlay} />
                        <span className={styles.showDateBadge}>
                          📅 {evt.date}
                        </span>
                        {isHeadliner && (
                          <span className={styles.headlinerBadge}>
                            ⭐ DEBUT
                          </span>
                        )}
                      </div>

                      <div className={styles.showCardBody}>
                        <div className={styles.showTimeVenue}>
                          <span><ClockIcon size={14} /> {evt.time}</span>
                          <span><MapPinIcon size={14} /> {evt.venue}</span>
                        </div>

                        <h3 className={styles.showTitle}>{evt.title}</h3>
                        <p className={styles.showDesc}>{evt.description}</p>

                        <div className={styles.lineupPreview}>
                          <span className={styles.lineupLabel}>GRILLA:</span>
                          <div className={styles.lineupTags}>
                            {evt.artists?.map((a, i) => (
                              <span key={i} className={`${styles.lineupTag} ${a.headliner ? styles.headlinerTag : ''}`}>
                                {a.nombre}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.showCardFooter}>
                          <span className={styles.showPrice}>{evt.price}</span>
                          <Link to={`/events/${evt.id}`} className={styles.viewShowBtn}>
                            <span>PÁGINA DEL SHOW</span>
                            <ExternalLinkIcon size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
