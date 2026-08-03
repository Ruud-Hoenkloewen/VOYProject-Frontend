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
            <span className={styles.hwListItemIcon}><HeartIcon size={18} /></span>
            <span>Guardá tus shows favoritos</span>
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><TicketIcon size={18} /></span>
            <span>Comprá entradas sin fila</span>
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><UsersIcon size={18} /></span>
            <span>Seguí artistas locales</span>
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><UserCheckIcon size={18} /></span>
            <span>Creá tu perfil de la escena</span>
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><MusicIcon size={18} /></span>
            <span>Conocé a nuestros artistas</span>
          </li>
          <li className={styles.hwListItem}>
            <span className={styles.hwListItemIcon}><ZapIcon size={18} /></span>
            <span>Hacete parte de nuestra comunidad</span>
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
          YA TENGO CUENTA | INGRESAR
        </button>
      </div>
    </div>
  );
}
