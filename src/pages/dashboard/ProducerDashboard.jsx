import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import Container from "../../design-system/layout/Container/Container";
import { useAuth } from "../../context/AuthContext";
import { fetchMyEvents, deleteEvent } from "../../services/eventService";
import api from "../../services/api";
import { CalendarIcon, MapPinIcon, TicketIcon, EditIcon, TrashIcon, ZapIcon, PeopleIcon, DollarIcon, ClockIcon } from "../../components/icons";
import styles from "./ProducerDashboard.module.css";

export default function ProducerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message: string, error: boolean }

  const showToastMsg = (message, isError = false) => {
    setToast({ message, error: isError });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await fetchMyEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error al cargar eventos del productor:", err);
        showToastMsg("No se pudieron cargar los eventos.", true);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const handleTogglePause = async (eventId, currentStatus) => {
    try {
      const newStatus = currentStatus === "PAUSADO" ? "PUBLICADO" : "PAUSADO";
      await api.patch(`/events/${eventId}`, { status: newStatus });
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e))
      );
      showToastMsg(newStatus === "PAUSADO" ? "Evento pausado correctamente." : "Evento reactivado correctamente.");
    } catch (err) {
      console.error("Error al cambiar estado del evento:", err);
      showToastMsg("Error al cambiar el estado del evento.", true);
    }
  };

  const handleCancelEvent = async (eventId) => {
    if (!window.confirm("¿Estás seguro de cancelar/eliminar este evento? Esta acción no se puede deshacer.")) {
      return;
    }
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showToastMsg("Evento eliminado exitosamente.");
    } catch (err) {
      console.error("Error al eliminar evento:", err);
      showToastMsg("No se pudo eliminar el evento.", true);
    }
  };

  // Métricas calculadas dinámicamente
  const totalShows = events.length;
  const ticketsSold = events.reduce((sum, e) => {
    const cap = e.capacity || 100;
    const stk = e.stock !== undefined ? e.stock : cap;
    return sum + Math.max(0, cap - stk);
  }, 0);
  const totalCapacitySum = events.reduce((sum, e) => sum + (e.capacity || 100), 0);
  const fillRate = totalCapacitySum > 0 ? Math.round((ticketsSold / totalCapacitySum) * 100) : 0;
  
  const totalRevenue = events.reduce((sum, e) => {
    const cap = e.capacity || 100;
    const stk = e.stock !== undefined ? e.stock : cap;
    const sold = Math.max(0, cap - stk);
    const rawPrice = typeof e.price === 'number' ? e.price : parseFloat(String(e.price || 0).replace(/[^0-9.]/g, '')) || 0;
    return sum + (sold * rawPrice);
  }, 0);

  const formattedRevenue = `$ ${totalRevenue.toLocaleString("es-AR")}`;

  return (
    <div className={styles.root}>
      <EditorialHeader />

      <Container className={styles.dashboardContainer}>
        {/* Header Producer */}
        <div className={styles.headerRow}>
          <div className={styles.titleArea}>
            <span className={styles.eyebrow}>PRODUCTOR DIGITAL</span>
            <h1 className={styles.title}>PANEL PRODUCTOR</h1>
          </div>
          <div>
            <Link to="/events/create" className={styles.createBtn}>
              + Crear Nuevo Evento
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricCardHeader}>
              <span className={styles.metricLabel}>SHOWS PROGRAMADOS</span>
              <div className={styles.metricIconWrapper}>
                <CalendarIcon size={16} color="#00E5FF" />
              </div>
            </div>
            <div className={styles.metricValue} style={{ color: "var(--ds-color-cyan-400)" }}>{totalShows}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricCardHeader}>
              <span className={styles.metricLabel}>TICKETS VENDIDOS (MES)</span>
              <div className={styles.metricIconWrapper}>
                <TicketIcon size={16} color="#FFFFFF" />
              </div>
            </div>
            <div className={styles.metricValue} style={{ color: "var(--ds-color-text-primary)" }}>{ticketsSold}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricCardHeader}>
              <span className={styles.metricLabel}>CAPACIDAD PROMEDIO</span>
              <div className={styles.metricIconWrapper}>
                <PeopleIcon size={16} color="#A855F7" />
              </div>
            </div>
            <div className={styles.metricValue} style={{ color: "#A855F7" }}>{fillRate}%</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricCardHeader}>
              <span className={styles.metricLabel}>INGRESOS TOTALES</span>
              <div className={styles.metricIconWrapper}>
                <DollarIcon size={16} color="#00FF9F" />
              </div>
            </div>
            <div className={styles.metricValue} style={{ color: "#00FF9F" }}>{formattedRevenue}</div>
          </div>
        </div>

        {/* Core Content */}
        <h2 className={styles.sectionTitle}>Tus Shows y Eventos</h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "30px", color: "#666" }}>Cargando eventos de la base de datos...</div>
        ) : events.length === 0 ? (
          <div className={styles.emptyStateCard}>
            <p className={styles.emptyStateText}>No tenés ningún evento creado todavía en la plataforma.</p>
            <Link to="/events/create" className={styles.createBtn} style={{ display: "inline-block" }}>
              + Crear mi primer show
            </Link>
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map((evt) => {
              const capacity = evt.capacity || 100;
              const ticketsRemaining = evt.stock !== undefined ? evt.stock : capacity;
              const remainingPercentage = capacity > 0 ? Math.round((ticketsRemaining / capacity) * 100) : 0;
              const isPaused = evt.status === "PAUSADO";
              const isAgotado = evt.status === "AGOTADO";
              
              const progressLabel = (ticketsRemaining < 20 && ticketsRemaining > 0) ? "Últimas entradas" : "Entradas";

              return (
                <div key={evt.id} className={styles.eventCard}>
                  {/* Banner Image with Overlay Title */}
                  <div 
                    className={styles.cardBanner}
                    style={{ backgroundImage: `url(${evt.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80"})` }}
                  >
                    <div className={styles.cardBannerOverlay} />
                    <span className={`${styles.statusBadge} ${
                      isPaused 
                        ? styles.statusPaused 
                        : isAgotado 
                          ? styles.statusCancelled 
                          : styles.statusActive
                    }`}>
                      {evt.status}
                    </span>

                    {/* Title placed cleanly over image */}
                    <h3 className={styles.eventTitleBanner}>{evt.title}</h3>
                  </div>

                  {/* Card Content with 4 Info Rows */}
                  <div className={styles.cardContent}>
                    <div className={styles.eventDetails}>
                      {/* Row 1: Fecha */}
                      <div className={styles.detailItem}>
                        <CalendarIcon size={14} color="var(--ds-color-cyan-400)" />
                        <span>{evt.date}</span>
                      </div>

                      {/* Row 2: Hora */}
                      <div className={styles.detailItem}>
                        <ClockIcon size={14} color="var(--ds-color-cyan-400)" />
                        <span>{evt.time || "21:00 HS"}</span>
                      </div>

                      {/* Row 3: Lugar */}
                      <div className={styles.detailItem}>
                        <MapPinIcon size={14} color="var(--ds-color-cyan-400)" />
                        <span>{evt.venue}</span>
                      </div>

                      {/* Row 4: Precio */}
                      <div className={styles.detailItem}>
                        <TicketIcon size={14} color="var(--ds-color-cyan-400)" />
                        <span>Precio: {evt.price}</span>
                      </div>
                    </div>

                    {/* Progress capacity */}
                    <div className={styles.progressContainer}>
                      <div className={styles.progressText}>
                        <span style={progressLabel === "Últimas entradas" ? { color: "var(--ds-color-brand-lime, #a3e635)", fontWeight: "bold" } : {}}>
                          {progressLabel}: {ticketsRemaining}/{capacity}
                        </span>
                        <span>{remainingPercentage}%</span>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div 
                          className={styles.progressBarFill} 
                          style={{ 
                            width: `${remainingPercentage}%`,
                            background: isPaused ? "var(--ds-color-yellow-300)" : (ticketsRemaining < 20 ? "var(--ds-color-brand-lime, #a3e635)" : "var(--ds-color-cyan-400)")
                          }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <Link to={`/events/edit/${evt.id}`} className={styles.actionBtn}>
                      <EditIcon size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                      Editar
                    </Link>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleTogglePause(evt.id, evt.status)}
                    >
                      {isPaused ? "Reactivar" : "Pausar"}
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      onClick={() => handleCancelEvent(evt.id)}
                    >
                      <TrashIcon size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>

      {/* Toast Alert Feedback */}
      {toast && (
        <div className={styles.toastContainer}>
          <div className={`${styles.toast} ${toast.error ? styles.toastError : ""}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
