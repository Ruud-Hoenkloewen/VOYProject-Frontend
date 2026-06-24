import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../LandingPage.module.css";
import { TicketIcon } from "../../../../components/icons";
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


  // Render options based on role
  const greetingSub = userRole === "admin" ? "ADMINISTRADOR" : userRole === "producer" ? "PRODUCTOR" : "BUENAS TARDES";
  const avatarChar = userRole === "admin" ? "A" : userRole === "producer" ? "P" : userName.charAt(0).toUpperCase();
  const avatarBg = userRole === "producer" ? "var(--ds-color-cyan-400)" : "var(--ds-color-accent-primary)";
  const avatarColor = userRole === "producer" ? "var(--ds-color-bg-canvas)" : "var(--ds-color-bg-editorial)";

  return (
    <div className={styles.heroWidget}>
      <div className={styles.hwLoggedInContainer}>
        
        {/* Top Row: Greeting & Profile */}
        <div className={styles.hwTopRow}>
          <div className={styles.hwTopLeft}>
            <div className={styles.hwUserLevel} style={{ backgroundColor: avatarBg, color: avatarColor }}>
              {avatarChar}
            </div>
            <div className={styles.hwGreeting}>
              <span className={styles.hwGreetingSub}>{greetingSub}</span>
              <span className={styles.hwGreetingName}>
                {userName} <span className={styles.hwDiamond} style={{ color: userRole === "producer" ? "var(--ds-color-cyan-400)" : "var(--ds-color-accent-primary)" }}>♦</span>
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
        ) : userRole === "admin" ? (
          <div className={styles.hwStatsRow}>
            <div className={styles.hwStatBox}>
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-accent-primary)" }}>1.2K</span>
              <span className={styles.hwStatLabel}>USUARIOS</span>
            </div>
            <div className={styles.hwStatBox}>
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-text-primary)" }}>{activeShowsCount}</span>
              <span className={styles.hwStatLabel}>EVENTOS</span>
            </div>
            <div className={styles.hwStatBox}>
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-accent-secondary)" }}>$4.8M</span>
              <span className={styles.hwStatLabel}>RECAUDACIÓN</span>
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
        ) : userRole === "admin" ? (
          <>
            <div className={styles.hwSection}>
              <div className={styles.hwSectionHeader}>
                <h3 className={styles.hwSectionTitle}>PANEL DE CONTROL</h3>
                <Link to="/dashboard/admin" className={styles.hwSectionLink}>VER PANEL</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem", color: "var(--ds-color-text-editorial-subtle)" }}>
                <div style={{ borderBottom: "1px solid #141414", paddingBottom: "4px" }}>
                  <strong>Usuario reg:</strong> carlos_pogo@email.com
                </div>
                <div style={{ borderBottom: "1px solid #141414", paddingBottom: "4px" }}>
                  <strong>Evento pub:</strong> Festival Tucumán Hardcore
                </div>
              </div>
            </div>
            <div className={styles.hwSection}>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link to="/dashboard/admin" className={styles.hwBtnPrimary} style={{ textDecoration: "none", textAlign: "center", fontSize: "0.75rem", padding: "0.6rem 0", flex: 1, margin: 0 }}>
                  AUDITAR LOGS
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
                <Link to={`/profile/${user?.username || user?._id || user?.id || 'me'}`} className={styles.hwSectionLink}>VER BILLETERA</Link>
              </div>
              {myOrders.length === 0 ? (
                <EmptyState 
                  icon={<TicketIcon size={24} />}
                  title="Sin tickets activos"
                  compact
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "var(--ds-color-text-editorial-subtle)" }}>
                  {myOrders.slice(0, 3).map((order) => {
                    const ev = order.evento;
                    if (!ev) return null;
                    const artistName = ev.artistas && ev.artistas.length > 0 ? (typeof ev.artistas[0] === 'string' ? ev.artistas[0] : ev.artistas[0].nombre) : "Varios Artistas";
                    // Sanitize backend image
                    let imageUrl = ev.imagen || '';
                    if (imageUrl.startsWith('/public/') || !imageUrl) {
                      const titleLower = (ev.nombre || '').toLowerCase();
                      if (titleLower.includes('danny') || titleLower.includes('proyectil')) imageUrl = '/flyer-danny-proyectil.png';
                      else if (titleLower.includes('lacrifagia') || titleLower.includes('oscuridad')) imageUrl = '/flyer-lacrifagia.png';
                      else if (titleLower.includes('inexplicables')) imageUrl = '/flyer-las-cosas-inexplicables.png';
                      else imageUrl = '/flyer-sabbath-fest.png';
                    }

                    // Format date
                    const dateObj = new Date(ev.fecha);
                    const isDateValid = !isNaN(dateObj.getTime());
                    const dateStr = isDateValid ? dateObj.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase() : (ev.fecha || "Fecha a confirmar");

                    return (
                      <div key={order._id} style={{ display: "flex", gap: "10px", alignItems: "center", paddingBottom: "8px", borderBottom: "1px dashed var(--ds-color-border-editorial-mid)" }}>
                        <div style={{ width: "45px", height: "60px", flexShrink: 0, borderRadius: "4px", overflow: "hidden", background: "#1a1a1a" }}>
                          <img src={imageUrl} alt={ev.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, justifyContent: "center" }}>
                          <strong style={{ color: "var(--ds-color-text-primary)", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.2", marginBottom: "2px" }}>{ev.nombre}</strong>
                          <span style={{ fontSize: "0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--ds-color-text-editorial-subtle)", marginBottom: "4px" }}>{artistName}</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--ds-color-text-primary)", fontWeight: "500" }}>{dateStr} {ev.hora ? `• ${ev.hora}hs` : ''}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                          <span style={{ color: "var(--ds-color-accent-primary)", fontWeight: "900", fontSize: "1rem", lineHeight: "1" }}>x{order.cantidad}</span>
                          <span style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ds-color-text-editorial-subtle)", marginTop: "2px" }}>TICKETS</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 3: Comunidad */}
            <div className={styles.hwSection}>
              <div className={styles.hwSectionHeader}>
                <h3 className={styles.hwSectionTitle}>COMUNIDAD</h3>
                <Link to={`/profile/${user?.username || user?._id || user?.id || 'me'}`} className={styles.hwSectionLink}>VER TODOS</Link>
              </div>
              <div className={styles.hwCommunity}>
                <div className={styles.hwAvatarGroup}>
                  <div className={styles.hwAvatarMini}>DP</div>
                  <div className={styles.hwAvatarMini}>LC</div>
                  <div className={styles.hwAvatarMini}>+3</div>
                </div>
                <span className={styles.hwCommunityText}>Siguiendo a <strong>5 artistas locales</strong></span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
