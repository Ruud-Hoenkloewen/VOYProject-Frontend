import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./ArtistDashboard.module.css";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import { UserIcon, CalendarIcon, MusicIcon, ArrowRightIcon } from "../../components/icons";

export default function ArtistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.nombre || user?.username || "Artista";

  return (
    <div className={styles.dashboardPage}>
      <EditorialHeader transparent={false} />
      
      <main className={styles.mainContent}>
        <div className={styles.dashboardHeader}>
          <div className={styles.badgeLabel}>
            <MusicIcon size={14} />
            <span>PANEL DE GESTIÓN ARTÍSTICA</span>
          </div>
          <h1 className={styles.pageTitle}>DASHBOARD DEL ARTISTA</h1>
          <p className={styles.pageSubtitle}>
            ¡Hola, <strong className={styles.highlightName}>{userName}</strong>! Administrá tu perfil, tus géneros y tus fechas.
          </p>
        </div>

        <section className={styles.grid}>
          {/* Tarjeta 1: Perfil Artístico */}
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <UserIcon size={28} className={styles.iconPrimary} />
            </div>
            <h3 className={styles.cardTitle}>Mi Perfil Artístico</h3>
            <p className={styles.cardDesc}>
              Actualizá tus fotos, lema, bio y redes sociales para conectar con productoras y fans.
            </p>
            <button 
              className={styles.cardBtn} 
              onClick={() => navigate('/profile/edit')}
            >
              <span>EDITAR PERFIL</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>

          {/* Tarjeta 2: Próximas Fechas */}
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <CalendarIcon size={28} className={styles.iconCyan} />
            </div>
            <h3 className={styles.cardTitle}>Próximas Fechas</h3>
            <p className={styles.cardDesc}>
              Gestión de fechas y recitales en los que estás tocando próximamente.
            </p>
            <button className={styles.cardBtnDisabled} disabled>
              <span>PRÓXIMAMENTE</span>
            </button>
          </div>

          {/* Tarjeta 3: Vista de Perfil Público */}
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <MusicIcon size={28} className={styles.iconFuchsia} />
            </div>
            <h3 className={styles.cardTitle}>Ver mi Perfil</h3>
            <p className={styles.cardDesc}>
              Visualizá cómo se ve tu perfil público para los fans y productores de la plataforma.
            </p>
            <button 
              className={styles.cardBtnSecondary} 
              onClick={() => navigate(`/profile/${user?.username || 'me'}`)}
            >
              <span>VER PERFIL</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
