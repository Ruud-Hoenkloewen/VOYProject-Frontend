import { Link, useNavigate } from "react-router-dom";
import styles from "../../LandingPage.module.css";
import { ZapIcon, TicketIcon, UsersIcon } from "../../../../components/icons";

export default function HeroWidgetLoggedIn({ user, activeShowsCount = 0 }) {
  const navigate = useNavigate();
  const userName = user?.nombre || user?.name || user?.email?.split('@')[0] || "USUARIO";
  
  // Fake stats for now, could be passed as props later
  const savedShows = 0;
  const recommendedShows = 0;

  return (
    <div className={styles.heroWidget}>
      <div className={styles.hwLoggedInContainer}>
        
        {/* Top Row: Greeting & Profile */}
        <div className={styles.hwTopRow}>
          <div className={styles.hwTopLeft}>
            <div className={styles.hwUserLevel}>{userName.charAt(0).toUpperCase()}</div>
            <div className={styles.hwGreeting}>
              <span className={styles.hwGreetingSub}>BUENAS TARDES</span>
              <span className={styles.hwGreetingName}>
                {userName} <span className={styles.hwDiamond}>♦</span>
              </span>
            </div>
          </div>
          <Link to="/profile" className={styles.hwProfileLink}>PERFIL &gt;</Link>
        </div>

        {/* Stats Row */}
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

        {/* Section 1: Próxima Fecha / Entradas */}
        <div className={styles.hwSection}>
          <div className={styles.hwSectionHeader}>
            <h3 className={styles.hwSectionTitle}>MIS ENTRADAS</h3>
            <Link to="/profile/tickets" className={styles.hwSectionLink}>VER BILLETERA</Link>
          </div>
          <div className={styles.hwTicketEmpty}>
            <span className={styles.hwTicketEmptyIcon}><TicketIcon /></span>
            No tienes tickets activos. ¡Buscá tu próximo pogo!
          </div>
        </div>

        {/* Section 3: Comunidad */}
        <div className={styles.hwSection}>
          <div className={styles.hwSectionHeader}>
            <h3 className={styles.hwSectionTitle}>COMUNIDAD</h3>
            <Link to="/profile/following" className={styles.hwSectionLink}>VER TODOS</Link>
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

      </div>
    </div>
  );
}
