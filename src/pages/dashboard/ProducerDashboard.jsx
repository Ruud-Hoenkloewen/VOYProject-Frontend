import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import Container from "../../design-system/layout/Container/Container";
import { useAuth } from "../../context/AuthContext";
import { fetchEvents, deleteEvent } from "../../services/eventService";
import { CalendarIcon, MapPinIcon, TicketIcon, EditIcon, TrashIcon } from "../../components/icons";
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
    }, 4000);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      // Como no hay campo creador/owner en el modelo Event del backend, 
      // mostramos todos los eventos de la base de datos (aplica para desarrollo local)
      setEvents(data);
    } catch (err) {
      console.error(err);
      showToastMsg("Error al obtener tus eventos del servidor.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePause = (id, currentStatus) => {
    const isPaused = currentStatus === "PAUSADO";
    const nextStatus = isPaused ? "DISPONIBLE" : "PAUSADO";
    
    // Cambiamos el estado localmente para simulación visual
    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        return { 
          ...evt, 
          status: nextStatus,
          statusTone: nextStatus === "PAUSADO" ? "warning" : "success"
        };
      }
      return evt;
    }));
    
    showToastMsg(`Venta de entradas ${isPaused ? "reactivada" : "pausada"} con éxito`);
  };

  const handleCancelEvent = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar este evento? Esto lo eliminará permanentemente del servidor.")) {
      return;
    }
    
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(evt => evt.id !== id));
      showToastMsg("Evento cancelado y eliminado correctamente");
    } catch (err) {
      console.error(err);
      showToastMsg("Error al eliminar el evento del servidor.", true);
    }
  };

  // Métricas en tiempo real calculadas de los eventos cargados
  const totalShows = events.length;
  const ticketsSold = events.reduce((acc, evt) => acc + (Math.max(0, (evt.capacity || 0) - (evt.stock || 0))), 0);
  const totalCapacity = events.reduce((acc, evt) => acc + (evt.capacity || 0), 0);
  const fillRate = totalCapacity > 0 ? Math.round((ticketsSold / totalCapacity) * 100) : 0;
  const totalRevenue = events.reduce((acc, evt) => acc + (Math.max(0, (evt.capacity || 0) - (evt.stock || 0)) * (evt.rawPrice || 0)), 0);

  const formattedRevenue = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(totalRevenue);

  return (
    <div className={styles.root}>
      <EditorialHeader />

      <Container>
        {/* Header Section */}
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
            <span className={styles.metricLabel}>SHOWS PROGRAMADOS</span>
            <div className={styles.metricValue} style={{ color: "#00E5FF" }}>{totalShows}</div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>TICKETS VENDIDOS (MES)</span>
            <div className={styles.metricValue} style={{ color: "#ffffff" }}>{ticketsSold}</div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>CAPACIDAD PROMEDIO</span>
            <div className={styles.metricValue} style={{ color: "#C6F92B" }}>{fillRate}%</div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>INGRESOS TOTALES</span>
            <div className={styles.metricValue} style={{ color: "var(--ds-color-accent-secondary)" }}>{formattedRevenue}</div>
          </div>
        </div>

        {/* Core Content */}
        <h2 className={styles.sectionTitle}>Tus Shows y Eventos</h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Cargando eventos de la base de datos...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", border: "1px dashed #222", background: "#0c0c0c" }}>
            <span style={{ fontSize: "24px", display: "block", marginBottom: "12px" }}>🎫</span>
            <p style={{ color: "#666", margin: "0 0 20px 0" }}>No tenés ningún evento creado todavía en la plataforma.</p>
            <Link to="/events/create" className={styles.createBtn} style={{ display: "inline-block" }}>
              Crear mi primer show
            </Link>
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map((evt) => {
              const ticketsVendidos = Math.max(0, (evt.capacity || 0) - (evt.stock || 0));
              const fillPercentage = evt.capacity > 0 ? Math.round((ticketsVendidos / evt.capacity) * 100) : 0;
              const isPaused = evt.status === "PAUSADO";
              const isAgotado = evt.status === "AGOTADO";

              return (
                <div key={evt.id} className={styles.eventCard}>
                  {/* Banner Image */}
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
                  </div>

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.eventTitle}>{evt.title}</h3>
                    
                    <div className={styles.eventDetails}>
                      <div className={styles.detailItem}>
                        <CalendarIcon size={14} color="#666" />
                        <span>{evt.date} • {evt.time}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <MapPinIcon size={14} color="#666" />
                        <span>{evt.venue}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <TicketIcon size={14} color="#666" />
                        <span>Precio: {evt.price}</span>
                      </div>
                    </div>

                    {/* Progress capacity */}
                    <div className={styles.progressContainer}>
                      <div className={styles.progressText}>
                        <span>Entradas: {ticketsVendidos}/{evt.capacity || 100}</span>
                        <span>{fillPercentage}%</span>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div 
                          className={styles.progressBarFill} 
                          style={{ 
                            width: `${fillPercentage}%`,
                            background: isPaused ? "#FFAA00" : "#00E5FF"
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
