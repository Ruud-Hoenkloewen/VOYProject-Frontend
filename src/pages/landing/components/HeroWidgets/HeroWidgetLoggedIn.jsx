import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../LandingPage.module.css";
import { TicketIcon, PeopleIcon } from "../../../../components/icons";
import { getMyOrders } from "../../../../services/orderService";
import { fetchMyEvents } from "../../../../services/eventService";
import EmptyState from "../../../../components/EmptyState/EmptyState";

export default function HeroWidgetLoggedIn({ user, activeShowsCount = 0 }) {
  const navigate = useNavigate();
  const userName = user?.nombre || user?.name || user?.email?.split('@')[0] || "USUARIO";
  const userRole = user?.role || user?.rol || "client";
  
  const [myOrders, setMyOrders] = useState([]);
  const [producerEvents, setProducerEvents] = useState([]);
  
  useEffect(() => {
    if (userRole === "client") {
      getMyOrders()
        .then(data => setMyOrders(data))
        .catch(err => console.error(err));
    } else if (userRole === "producer") {
      fetchMyEvents()
        .then(data => setProducerEvents(data))
        .catch(err => console.error(err));
    }
  }, [userRole]);

  const savedShows = user?.favoritos?.length || 0;
  const recommendedShows = 0;

  // Real producer stats
  const totalShows = producerEvents.length;
  const ticketsSold = producerEvents.reduce((acc, evt) => acc + (Math.max(0, (evt.capacity || 0) - (evt.stock || 0))), 0);
  const totalRevenue = producerEvents.reduce((acc, evt) => acc + (Math.max(0, (evt.capacity || 0) - (evt.stock || 0)) * (evt.rawPrice || 0)), 0);

  const formattedRevenue = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(totalRevenue);


  // Greeting based on system hour
  const getGreetingByHour = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "BUENOS DÍAS";
    if (hour >= 12 && hour < 20) return "BUENAS TARDES";
    return "BUENAS NOCHES";
  };

  // Render options based on role
  const greetingSub = userRole === "producer" ? "PRODUCTOR" : userRole === "artist" ? "ARTISTA" : getGreetingByHour();
  const avatarChar = userRole === "producer" ? "P" : userRole === "artist" ? "A" : userName.charAt(0).toUpperCase();
  const avatarBg = userRole === "producer" ? "var(--ds-color-cyan-400)" : userRole === "artist" ? "var(--ds-color-accent-secondary)" : "var(--ds-color-accent-primary)";
  const avatarColor = userRole === "producer" ? "var(--ds-color-bg-canvas)" : "var(--ds-color-bg-editorial)";

  const avatarPhoto = user?.avatar || user?.avatarUrl || user?.fotoPerfil;

  return (
    <div className={styles.heroWidget}>
      <div className={styles.hwLoggedInContainer}>
        
        {/* Top Row: Greeting & Profile */}
        <div className={styles.hwTopRow}>
          <div className={styles.hwTopLeft}>
            <div 
              className={styles.hwUserLevel} 
              style={{ 
                backgroundColor: avatarPhoto ? 'transparent' : avatarBg, 
                color: avatarColor, 
                borderRadius: '6px',
                overflow: 'hidden' 
              }}
            >
              {avatarPhoto ? (
                <img 
                  src={avatarPhoto} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
              ) : (
                avatarChar
              )}
            </div>
            <div className={styles.hwGreeting}>
              <span className={styles.hwGreetingSub}>{greetingSub}</span>
              <span className={styles.hwGreetingName}>
                {userName} <span className={styles.hwDiamond} style={{ color: userRole === "producer" ? "var(--ds-color-cyan-400)" : userRole === "artist" ? "var(--ds-color-accent-secondary)" : "var(--ds-color-accent-primary)" }}>♦</span>
              </span>
            </div>
          </div>
          <Link to={`/profile/${user?.username || user?._id || user?.id || 'me'}`} className={styles.hwProfileLink}>PERFIL &gt;</Link>
        </div>

        {/* Stats Row */}
        {userRole === "producer" ? (
          <div className={styles.hwStatsRow}>
            <div className={styles.hwStatBox}>
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-cyan-400)" }}>{totalShows}</span>
              <span className={styles.hwStatLabel}>SHOWS ACTIVOS</span>
            </div>
            <div className={styles.hwStatBox}>
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-text-primary)" }}>{ticketsSold}</span>
              <span className={styles.hwStatLabel}>VENDIDOS</span>
            </div>
            <div className={styles.hwStatBox}>
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-accent-secondary)" }}>{formattedRevenue}</span>
              <span className={styles.hwStatLabel}>INGRESOS</span>
            </div>
          </div>
        ) : (
          <div className={styles.hwStatsRow}>
            <div className={styles.hwStatBox}>
              <span className={`${styles.hwStatValue} ${styles.active}`}>{activeShowsCount}</span>
              <span className={styles.hwStatLabel}>SHOWS ACTIVOS</span>
            </div>
            <div className={styles.hwStatBox}>
              <span className={`${styles.hwStatValue} ${styles.fuchsia}`}>{recommendedShows}</span>
              <span className={styles.hwStatLabel}>PARA VOS</span>
            </div>
            <div className={styles.hwStatBox}>
              <span className={`${styles.hwStatValue} ${styles.cyan}`}>{savedShows}</span>
              <span className={styles.hwStatLabel}>GUARDADOS</span>
            </div>
          </div>
        )}

        {/* Section 1 & 2 conditionally rendered based on role */}
        {userRole === "producer" ? (
          <>
            <div className={styles.hwSection}>
              <div className={styles.hwSectionHeader}>
                <h3 className={styles.hwSectionTitle}>MIS SHOWS ACTIVOS</h3>
                <Link to="/dashboard/producer" className={styles.hwSectionLink}>VER PANEL</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem", color: "var(--ds-color-text-editorial-subtle)" }}>
                {producerEvents.length === 0 ? (
                  <EmptyState 
                    icon={<TicketIcon size={24} />}
                    title="Sin shows activos"
                    compact
                  />
                ) : (
                  producerEvents.slice(0, 2).map((evt) => {
                    const capacity = evt.capacity || 100;
                    const stock = evt.stock !== undefined ? evt.stock : capacity;
                    const sold = Math.max(0, capacity - stock);
                    const percentage = capacity > 0 ? Math.round((sold / capacity) * 100) : 0;
                    const isLowStock = stock < 20 && stock > 0;
                    const isSoldOut = stock === 0;

                    const statusColor = isSoldOut ? "var(--ds-color-danger, #ff4444)" 
                                      : isLowStock ? "var(--ds-color-warning, #ffaa00)" 
                                      : "var(--ds-color-cyan-400)";
                    
                    const artistName = evt.artists && evt.artists.length > 0 ? evt.artists[0].nombre : "Varios Artistas";

                    return (
                      <div key={evt.id} style={{ display: "flex", gap: "10px", alignItems: "center", paddingBottom: "12px", borderBottom: "1px dashed var(--ds-color-border-editorial-mid)" }}>
                        <div style={{ width: "45px", height: "60px", flexShrink: 0, borderRadius: "4px", overflow: "hidden", background: "#1a1a1a" }}>
                          <img src={evt.imageUrl} alt={evt.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, justifyContent: "center" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                            <strong style={{ color: "var(--ds-color-text-primary)", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.2" }}>
                              {evt.title}
                            </strong>
                            <span style={{ fontSize: "0.75rem", color: statusColor, fontWeight: "bold", flexShrink: 0, marginLeft: "8px" }}>
                              {isSoldOut ? "Agotado" : isLowStock ? "Últimas entradas" : `${stock} restantes`}
                            </span>
                          </div>
                          
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.7rem", color: "var(--ds-color-text-editorial-subtle)" }}>
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "8px" }}>
                              {artistName}
                            </span>
                            <span style={{ fontWeight: "bold" }}>{percentage}% vendido</span>
                          </div>

                          <div style={{ width: "100%", height: "4px", background: "var(--ds-color-border-editorial)", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ width: `${percentage}%`, height: "100%", background: statusColor }} />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className={styles.hwSection}>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link to="/dashboard/producer" className={styles.hwBtnPrimary} style={{ textDecoration: "none", textAlign: "center", fontSize: "0.75rem", padding: "0.6rem 0", flex: 1, margin: 0 }}>
                  + CREAR EVENTO
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Section 1: Próxima Fecha / Entradas */}
            <div className={styles.hwSection}>
              <div className={styles.hwSectionHeader}>
                <h3 className={styles.hwSectionTitle}>MIS ENTRADAS</h3>
                <Link to={`/profile/${user?.username || user?._id || user?.id || 'me'}?tab=HISTORIAL`} className={styles.hwSectionLink}>VER HISTORIAL</Link>
              </div>
              {myOrders.length === 0 ? (
                <EmptyState 
                  icon={<TicketIcon size={24} />}
                  title="Sin tickets activos"
                  compact
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {myOrders.slice(0, 3).map((order) => {
                    const ev = order.evento || {};
                    const isPaid = (order.estado === 'completado' || order.estado === 'paid' || order.estado === 'pagado' || order.status === 'completed');
                    const statusLabel = isPaid ? "PAGADO" : "PENDIENTE";
                    const statusBg = isPaid ? "rgba(0, 255, 159, 0.12)" : "rgba(255, 193, 7, 0.12)";
                    const statusColor = isPaid ? "#00FF9F" : "#FFC107";
                    const statusBorder = isPaid ? "1px solid rgba(0, 255, 159, 0.3)" : "1px solid rgba(255, 193, 7, 0.3)";

                    let imageUrl = ev.imagen || ev.imageUrl || '';
                    if (imageUrl.startsWith('/public/') || !imageUrl) {
                      const titleLower = (ev.nombre || '').toLowerCase();
                      if (titleLower.includes('danny') || titleLower.includes('proyectil') || titleLower.includes('oqlta')) imageUrl = '/flyer-danny-proyectil.png';
                      else if (titleLower.includes('lacrifagia') || titleLower.includes('hardcore')) imageUrl = '/flyer-lacrifagia.png';
                      else imageUrl = '/flyer-sabbath-fest.png';
                    }

                    // Format date
                    const dateObj = new Date(ev.fecha);
                    const isDateValid = !isNaN(dateObj.getTime());
                    const dateStr = isDateValid ? dateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).toUpperCase() : (ev.fecha || "A CONFIRMAR");

                    return (
                      <div key={order._id} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 10px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--ds-color-border-editorial-mid)", borderRadius: "8px" }}>
                        <div style={{ width: "42px", height: "54px", flexShrink: 0, borderRadius: "5px", overflow: "hidden", background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <img src={imageUrl} alt={ev.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, gap: "2px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                            <strong style={{ color: "var(--ds-color-text-primary)", fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "uppercase" }}>
                              {ev.nombre}
                            </strong>
                          </div>

                          <span style={{ fontSize: "0.7rem", color: "var(--ds-color-text-editorial-subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            📍 {ev.venue || "Tucumán"}
                          </span>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--ds-color-text-editorial-muted)" }}>
                            <span>🗓 {dateStr} {ev.hora ? `• ${ev.hora} HS` : ''}</span>
                            <span style={{ fontWeight: "800", color: "var(--ds-color-accent-primary)" }}>x{order.cantidad}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                          <span style={{ fontSize: "0.58rem", fontWeight: "900", letterSpacing: "0.06em", padding: "2px 6px", borderRadius: "4px", background: statusBg, color: statusColor, border: statusBorder }}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 3: Mis Conexiones */}
            <div className={styles.hwSection}>
              <div className={styles.hwSectionHeader}>
                <h3 className={styles.hwSectionTitle}>MIS CONEXIONES</h3>
                <Link to={`/profile/${user?.username || user?._id || user?.id || 'me'}`} className={styles.hwSectionLink}>MI PERFIL</Link>
              </div>
              {(() => {
                const siguiendoList = user?.siguiendo || [];
                const followedArtistsCount = user?.siguiendoArtistasCount ?? (
                  siguiendoList.filter(item => typeof item === 'object' ? (item.role === 'producer' || item.rol === 'producer' || item.isArtist) : true).length
                );
                const followedUsersCount = user?.siguiendoPersonasCount ?? (
                  siguiendoList.filter(item => typeof item === 'object' ? (item.role === 'client' || item.rol === 'client' || item.role === 'user') : false).length
                );

                const hasConnections = followedArtistsCount > 0 || followedUsersCount > 0;

                if (!hasConnections) {
                  return (
                    <EmptyState 
                      icon={<PeopleIcon size={24} />}
                      title="Sin conexiones activas"
                      compact
                    />
                  );
                }

                return (
                  <div className={styles.hwCommunity} style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                    {followedArtistsCount > 0 && (
                      <span className={styles.hwCommunityText} style={{ fontSize: "0.78rem" }}>
                        Siguiendo a <strong>{followedArtistsCount} artista{followedArtistsCount > 1 ? 's' : ''} {followedArtistsCount > 1 ? 'locales' : 'local'}</strong>
                      </span>
                    )}
                    {followedUsersCount > 0 && (
                      <span className={styles.hwCommunityText} style={{ fontSize: "0.78rem" }}>
                        Siguiendo a <strong>{followedUsersCount} persona{followedUsersCount > 1 ? 's' : ''}</strong>
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
