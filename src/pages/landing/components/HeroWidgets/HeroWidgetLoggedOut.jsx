import { Link, useNavigate } from "react-router-dom";
import styles from "../../LandingPage.module.css";
import { HeartIcon, TicketIcon, UsersIcon, UserCheckIcon, MusicIcon, ZapIcon } from "../../../../components/icons";

export default function HeroWidgetLoggedOut() {
  const navigate = useNavigate();

  return (
    <div className={styles.heroWidget}>
      <div className={styles.hwLoggedOutCard}>
        <span className={styles.hwEyebrow}><span style={{color: 'var(--ds-color-accent-secondary)'}}>♦</span> UNITE A LA ESCENA</span>
        <h2 className={styles.hwTitle}>
          VOLVETE PARTE DE LA MOVIDA
        </h2>

        <ul className={styles.hwList}>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><HeartIcon /></span>
            Guardá tus shows favoritos
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><TicketIcon /></span>
            Comprá entradas sin fila
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><UsersIcon /></span>
            Seguí artistas locales
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><UserCheckIcon /></span>
            Creá tu perfil de la escena
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><MusicIcon /></span>
            Conocé a nuestros artistas
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><ZapIcon /></span>
            Hacete parte de nuestra comunidad
          </li>
        </ul>

        <button 
          className={styles.hwBtnPrimary}
          onClick={() => navigate("/register")}
        >
          CREAR MI CUENTA →
        </button>
        <button 
          className={styles.hwBtnSecondary}
          onClick={() => navigate("/login")}
        >
          YA TENGO CUENTA — INGRESAR
        </button>
      </div>
    </div>
  );
}
