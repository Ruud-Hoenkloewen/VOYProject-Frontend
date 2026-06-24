import { useState, useEffect } from "react";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import Container from "../../design-system/layout/Container/Container";
import { useAuth } from "../../context/AuthContext";
import { fetchEvents } from "../../services/eventService";
import { getUsers, updateUserStatus, getMetrics } from "../../services/adminService";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [metrics, setMetrics] = useState({ ventasTotales: 0, recaudacion: 0 });
  const [toast, setToast] = useState(null); // { message: string, error: boolean }
  const [featuredEventIds, setFeaturedEventIds] = useState(() => {
    const saved = localStorage.getItem("voy_featured_events");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const showToastMsg = (message, isError = false) => {
    setToast({ message, error: isError });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load events, users, and metrics from real API
  useEffect(() => {
    Promise.all([fetchEvents(), getUsers(), getMetrics()])
      .then(([eventsData, usersData, metricsData]) => {
        setEvents(eventsData);
        setUsers(usersData);
        setMetrics(metricsData || { ventasTotales: 0, recaudacion: 0 });
      })
      .catch(err => {
        console.error(err);
        showToastMsg("Error al obtener datos del servidor", true);
      })
      .finally(() => {
        setLoadingEvents(false);
      });
  }, []);

  // Action: Toggle Suspend
  const handleToggleSuspend = (id, email) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus = !u.isSuspended;
        showToastMsg(`Usuario ${email} ${nextStatus ? "suspendido" : "activado"} con éxito`);
        return { ...u, isSuspended: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("voy_admin_users", JSON.stringify(updated));
  };

  // Action: Promote to Producer
  const handlePromoteToProducer = (id, email) => {
    const updated = users.map(u => {
      if (u.id === id) {
        showToastMsg(`Usuario ${email} ascendido a Productor`);
        return { ...u, role: "producer", isVerifiedProducer: true };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("voy_admin_users", JSON.stringify(updated));
  };

  // Action: Approve Producer request
  const handleApproveProducer = (id, email) => {
    const updated = users.map(u => {
      if (u.id === id) {
        showToastMsg(`Productor ${email} aprobado con éxito`);
        return { ...u, role: "producer", isVerifiedProducer: true, isPendingApproval: false };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("voy_admin_users", JSON.stringify(updated));
  };

  // Action: Reject Producer request
  const handleRejectProducer = (id, email) => {
    const updated = users.map(u => {
      if (u.id === id) {
        showToastMsg(`Solicitud de productor ${email} rechazada`, true);
        return { ...u, isPendingApproval: false };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("voy_admin_users", JSON.stringify(updated));
  };

  // Action: Toggle Featured status
  const handleToggleFeatured = (id) => {
    let updated;
    if (featuredEventIds.includes(id)) {
      updated = featuredEventIds.filter(itemId => itemId !== id);
      showToastMsg("Evento removido de destacados");
    } else {
      updated = [...featuredEventIds, id];
      showToastMsg("Evento marcado como destacado");
    }
    setFeaturedEventIds(updated);
    localStorage.setItem("voy_featured_events", JSON.stringify(updated));
  };

  // Dynamic KPIs calculations
  const totalUsers = users.length;
  const activeEventsCount = events.length;
  const ticketsSold = events.reduce((acc, evt) => acc + (Math.max(0, (evt.capacity || 0) - (evt.stock || 0))), 0);
  const totalRevenue = events.reduce((acc, evt) => acc + (Math.max(0, (evt.capacity || 0) - (evt.stock || 0)) * (evt.rawPrice || 0)), 0);

  const formattedRevenue = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(totalRevenue);

  // Filter users
  const pendingProducers = users.filter(u => u.isPendingApproval);
  const generalUsers = users.filter(u => !u.isPendingApproval);

  return (
    <div className={styles.root}>
      <EditorialHeader />

      <Container>
        {/* Header Section */}
        <div className={styles.headerRow}>
          <div className={styles.titleArea}>
            <span className={styles.eyebrow}>PANEL DE CONTROL</span>
            <h1 className={styles.title}>ADMINISTRACIÓN VOY</h1>
          </div>
          <div className={styles.sessionInfo}>
            SESIÓN: {currentUser?.nombre?.toUpperCase()} [ADMIN]
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>USUARIOS REGISTRADOS</span>
            <div className={styles.metricValue} style={{ color: "var(--ds-color-accent-primary)" }}>{totalUsers}</div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>EVENTOS ACTIVOS</span>
            <div className={styles.metricValue} style={{ color: "var(--ds-color-text-primary)" }}>{activeEventsCount}</div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>TICKETS VENDIDOS</span>
            <div className={styles.metricValue} style={{ color: "#f43f5e" }}>{ticketsSold}</div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>RECAUDACIÓN TOTAL</span>
            <div className={styles.metricValue} style={{ color: "var(--ds-color-cyan-400)" }}>{formattedRevenue}</div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className={styles.dashboardLayout}>
          
          {/* SECCIÓN 1: Solicitudes de Productores Pendientes */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                🛡️ Productores Pendientes
              </h2>
              <span className={styles.badgeCount}>{pendingProducers.length}</span>
            </div>

            {pendingProducers.length === 0 ? (
              <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>No hay solicitudes de productores pendientes de aprobación.</p>
            ) : (
              <div className={styles.pendingList}>
                {pendingProducers.map(u => (
                  <div key={u.id} className={styles.pendingCard}>
                    <div className={styles.userMeta}>
                      <span className={styles.username}>{u.nombre}</span>
                      <span className={styles.email}>@{u.username} • {u.email}</span>
                    </div>
                    <div className={styles.btnRow}>
                      <button 
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={() => handleApproveProducer(u.id, u.email)}
                      >
                        Aprobar
                      </button>
                      <button 
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={() => handleRejectProducer(u.id, u.email)}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECCIÓN 2: Tabla General de Usuarios */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                👥 Gestión de Usuarios
              </h2>
              <span className={styles.badgeCount}>{generalUsers.length}</span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th style={{ textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {generalUsers.map(u => {
                    const isClient = u.role === "client";
                    const isProducer = u.role === "producer";
                    const isAdmin = u.role === "admin";
                    
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className={styles.userMeta}>
                            <span className={styles.username}>{u.nombre}</span>
                            <span className={styles.email}>{u.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.roleBadge} ${
                            isAdmin 
                              ? styles.roleAdmin 
                              : isProducer 
                                ? styles.roleProducer 
                                : styles.roleClient
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <div className={styles.statusIndicator}>
                            <span className={`${styles.statusDot} ${
                              u.isSuspended ? styles.statusSuspended : styles.dotActive
                            }`} />
                            <span>{u.isSuspended ? "Suspendido" : "Activo"}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className={styles.btnRow} style={{ justifyContent: "flex-end" }}>
                            {isClient && (
                              <button 
                                className={styles.btn}
                                onClick={() => handlePromoteToProducer(u.id, u.email)}
                              >
                                Ascender a Prod
                              </button>
                            )}
                            
                            {!isAdmin && (
                              <button 
                                className={`${styles.btn} ${u.isSuspended ? styles.btnPrimary : styles.btnDanger}`}
                                onClick={() => handleToggleSuspend(u.id, u.email, u.isSuspended)}
                              >
                                {u.isSuspended ? "Activar" : "Suspender"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECCIÓN 3: Gestión de Eventos */}
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                🎸 Gestión de Eventos
              </h2>
              <span className={styles.badgeCount}>{events.length}</span>
            </div>

            {loadingEvents ? (
              <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>Cargando eventos...</p>
            ) : events.length === 0 ? (
              <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>No hay eventos cargados en la plataforma.</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Fecha / Hora</th>
                      <th>Precio</th>
                      <th>Ventas</th>
                      <th style={{ textAlign: "right" }}>Destacado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(evt => {
                      const isFeatured = featuredEventIds.includes(evt.id);
                      const ticketsSold = Math.max(0, (evt.capacity || 0) - (evt.stock || 0));
                      const capacity = evt.capacity || 0;
                      
                      return (
                        <tr key={evt.id}>
                          <td>
                            <div className={styles.userMeta}>
                              <span className={styles.username}>{evt.title}</span>
                              <span className={styles.email}>{evt.venue}</span>
                            </div>
                          </td>
                          <td>
                            <div className={styles.userMeta}>
                              <span style={{ color: "var(--ds-color-text-primary)", fontWeight: 500 }}>{evt.date}</span>
                              <span className={styles.email}>{evt.time}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ color: "var(--ds-color-cyan-400)", fontWeight: 700 }}>
                              {evt.price}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: "12px", color: "#ccc" }}>
                              {ticketsSold} / {capacity}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <label className={styles.switch}>
                              <input 
                                type="checkbox" 
                                checked={isFeatured}
                                onChange={() => handleToggleFeatured(evt.id)}
                              />
                              <span className={styles.slider}></span>
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </Container>

      {/* Toast notifications */}
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
