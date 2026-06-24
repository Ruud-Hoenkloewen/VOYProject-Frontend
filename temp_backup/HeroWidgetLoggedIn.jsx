import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../LandingPage.module.css";
import { TicketIcon } from "../../../../components/icons";
import { getMyOrders } from "../../../../services/orderService";
import EmptyState from "../../../../components/EmptyState/EmptyState";

export default function HeroWidgetLoggedIn({ user, activeShowsCount = 0 }) {
  const navigate = useNavigate();
  const userName = user?.nombre || user?.name || user?.email?.split('@')[0] || "USUARIO";
  const userRole = user?.role || user?.rol || "client";
  
  const [myOrders, setMyOrders] = useState([]);
  
  useEffect(() => {
    if (userRole === "client") {
      getMyOrders()
        .then(data => setMyOrders(data))
        .catch(err => console.error(err));
    }
  }, [userRole]);

  const savedShows = user?.favoritos?.length || 0;
  const recommendedShows = 0;

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
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-cyan-400)" }}>2</span>
              <span className={styles.hwStatLabel}>SHOWS ACTIVOS</span>
            </div>
            <div className={styles.hwStatBox}>
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-text-primary)" }}>200</span>
              <span className={styles.hwStatLabel}>VENDIDOS</span>
            </div>
            <div className={styles.hwStatBox}>
              <span className={styles.hwStatValue} style={{ color: "var(--ds-color-accent-secondary)" }}>$450K</span>
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
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>Tucumán Shoegaze Night</span>
                    <strong style={{ color: "var(--ds-color-cyan-400)" }}>80%</strong>
                  </div>
                  <div style={{ width: "100%", height: "4px", background: "var(--ds-color-border-editorial)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "80%", height: "100%", background: "var(--ds-color-cyan-400)" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>Pogo en el Barrio</span>
                    <strong style={{ color: "var(--ds-color-cyan-400)" }}>40%</strong>
                  </div>
                  <div style={{ width: "100%", height: "4px", background: "var(--ds-color-border-editorial)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "40%", height: "100%", background: "var(--ds-color-cyan-400)" }} />
                  </div>
                </div>
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
                  actionLabel="Buscar pogo"
                  actionTo="/events"
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem", color: "var(--ds-color-text-editorial-subtle)" }}>
                  {myOrders.slice(0, 2).map((order) => (
                    <div key={order._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--ds-color-border-editorial-mid)", paddingBottom: "4px" }}>
                      <span>
                        <strong style={{ color: "var(--ds-color-text-primary)", display: "block" }}>{order.evento?.nombre || "Evento Eliminado"}</strong>
                        {order.cantidad}x tickets
                      </span>
                      <span style={{ color: "var(--ds-color-accent-primary)", fontWeight: "bold" }}>ACTIVO</span>
                    </div>
                  ))}
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
