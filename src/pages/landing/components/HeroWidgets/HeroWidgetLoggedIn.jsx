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
                    const ev = (typeof order.eventId === 'object' && order.eventId !== null) ? order.eventId : (order.evento || {});
                    const title = ev.nombre || order.nombreEvento || "EVENTO VOY";
                    const venue = ev.lugar || ev.venue || "San Miguel de Tucumán";

                    const isPaid = (order.estadoPago === 'PAGADA' || order.estado === 'completado' || order.estado === 'paid' || order.estado === 'pagado' || order.status === 'completed');
                    const statusLabel = isPaid ? "PAGADO" : "PENDIENTE";
                    const statusBg = isPaid ? "rgba(0, 200, 100, 0.12)" : "rgba(217, 119, 6, 0.12)";
                    const statusColor = isPaid ? "var(--ds-color-state-success, #059669)" : "var(--ds-color-state-warning, #d97706)";
                    const statusBorder = isPaid ? "1px solid rgba(5, 150, 105, 0.4)" : "1px solid rgba(217, 119, 6, 0.4)";

                    let imageUrl = ev.imagen || ev.imageUrl || order.imagen || '';
                    if (!imageUrl || imageUrl.startsWith('/public/')) {
                      const titleLower = title.toLowerCase();
                      if (titleLower.includes('danny') || titleLower.includes('proyectil')) imageUrl = '/flyer-danny-proyectil.png';
                      else if (titleLower.includes('lacrifagia')) imageUrl = '/flyer-lacrifagia.png';
                      else imageUrl = '/flyer-sabbath-fest.png';
                    }

                    // Format date
                    const rawDate = ev.fecha || order.fecha;
                    const dateObj = new Date(rawDate);
                    const isDateValid = Boolean(rawDate) && !isNaN(dateObj.getTime());
                    const dateStr = isDateValid ? dateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : "A CONFIRMAR";

                    return (
                      <div key={order._id} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 10px", background: "transparent", border: "1px solid var(--ds-color-border-editorial-mid, rgba(0, 0, 0, 0.12))", borderRadius: "8px" }}>
                        <div style={{ width: "38px", height: "50px", flexShrink: 0, borderRadius: "5px", overflow: "hidden", background: "#111", border: "1px solid rgba(0,0,0,0.1)" }}>
                          <img src={imageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, gap: "2px" }}>
                          <strong style={{ color: "var(--ds-color-text-primary, #050811)", fontSize: "0.74rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {title}
                          </strong>

                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.66rem", color: "var(--ds-color-accent-secondary, #0284c7)", fontWeight: "700" }}>
                            <span>🗓 {dateStr}</span>
                            <span style={{ color: "var(--ds-color-state-success, #15803d)", fontWeight: "800" }}>• x{order.cantidad || 1}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                          <span style={{ fontSize: "0.58rem", fontWeight: "900", letterSpacing: "0.06em", padding: "3px 6px", borderRadius: "4px", background: statusBg, color: statusColor, border: statusBorder }}>
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
                <Link to={`/profile/${user?.username || user?._id || user?.id || 'me'}/following`} className={styles.hwSectionLink}>VER SEGUIDOS</Link>
              </div>
              {(() => {
                const siguiendoList = user?.siguiendo || [];
                if (!Array.isArray(siguiendoList) || siguiendoList.length === 0) {
                  return (
                    <EmptyState 
                      icon={<PeopleIcon size={24} />}
                      title="Sin conexiones activas"
                      compact
                    />
                  );
                }

                const artistsList = siguiendoList.filter(u => {
                  const r = typeof u === 'object' ? (u.role || u.rol) : '';
                  return r === 'artist' || r === 'artista';
                });

                const personsList = siguiendoList.filter(u => {
                  const r = typeof u === 'object' ? (u.role || u.rol) : '';
                  return r !== 'artist' && r !== 'artista';
                });

                const artistsCount = artistsList.length;
                const personsCount = personsList.length;

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {/* Texto resumen de seguimiento */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px", paddingLeft: "2px" }}>
                      {artistsCount > 0 && (
                        <span style={{ fontSize: "0.74rem", color: "var(--ds-color-text-secondary)" }}>
                          Siguiendo a <strong style={{ color: "var(--ds-color-accent-secondary, #0284c7)", fontWeight: "800" }}>{artistsCount} artista{artistsCount > 1 ? 's' : ''}</strong>
                        </span>
                      )}
                      {personsCount > 0 && (
                        <span style={{ fontSize: "0.74rem", color: "var(--ds-color-text-secondary)" }}>
                          Siguiendo a <strong style={{ color: "var(--ds-color-state-success, #15803d)", fontWeight: "800" }}>{personsCount} persona{personsCount > 1 ? 's' : ''}</strong>
                        </span>
                      )}
                    </div>

                    {/* Tarjetas de conexiones seguidas (hasta 3) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "2px" }}>
                      {siguiendoList.slice(0, 3).map((conn, idx) => {
                        const cObj = typeof conn === 'object' ? conn : { username: String(conn) };
                        const name = cObj.nombre || cObj.username || 'Usuario';
                        const handle = cObj.username ? `@${cObj.username}` : '';
                        const avatar = cObj.avatarUrl || cObj.fotoPerfil || cObj.avatar || '';
                        const cRole = cObj.role || cObj.rol || 'fan';
                        const isArt = cRole === 'artist' || cRole === 'artista';
                        const isProd = cRole === 'producer';
                        const badgeLabel = isArt ? 'ARTISTA' : isProd ? 'PRODUCTOR' : 'FAN';
                        const badgeColor = isArt ? 'var(--ds-color-state-success, #059669)' : isProd ? '#A855F7' : 'var(--ds-color-text-editorial-muted, #64748b)';

                        return (
                          <Link 
                            key={cObj._id || idx}
                            to={`/profile/${cObj.username || cObj._id}`}
                            style={{ 
                              display: "flex", 
                              alignItems: "center", 
                              gap: "10px", 
                              padding: "6px 10px", 
                              background: "transparent", 
                              border: "1px solid var(--ds-color-border-editorial-mid, rgba(0, 0, 0, 0.12))", 
                              borderRadius: "8px", 
                              textDecoration: "none",
                              transition: "background 0.2s"
                            }}
                          >
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden", background: "var(--ds-color-bg-surface-muted, #181a26)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${badgeColor}` }}>
                              {avatar ? (
                                <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--ds-color-text-primary, #050811)" }}>{name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <strong style={{ color: "var(--ds-color-text-primary, #050811)", fontSize: "0.74rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</strong>
                                <span style={{ fontSize: "0.54rem", fontWeight: "900", padding: "1px 4px", borderRadius: "3px", border: `1px solid ${badgeColor}`, color: badgeColor, letterSpacing: "0.04em" }}>{badgeLabel}</span>
                              </div>
                              {handle && <span style={{ fontSize: "0.65rem", color: "var(--ds-color-magenta-400, #FF2D78)", fontFamily: "monospace" }}>{handle}</span>}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
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
