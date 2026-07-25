import { useAuth } from "../../context/AuthContext";
import styles from "./ArtistDashboard.module.css";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";

export default function ArtistDashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.dashboardPage}>
      <EditorialHeader transparent={false} />
      
      <main className={styles.mainContent}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.pageTitle}>Dashboard del Artista</h1>
          <p className={styles.pageSubtitle}>
            ¡Hola, {user?.nombre}! Desde aquí podés administrar tu perfil y tus fechas.
          </p>
        </div>

        <section className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🎸</div>
            <h3 className={styles.cardTitle}>Mi Perfil Artístico</h3>
            <p className={styles.cardDesc}>
              Actualizá tus fotos, bio y links para conectar con productoras y fans.
            </p>
            <button className={styles.cardBtn} onClick={() => window.location.href='/profile/edit'}>
              Editar Perfil
            </button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📅</div>
            <h3 className={styles.cardTitle}>Próximas Fechas</h3>
            <p className={styles.cardDesc}>
              Eventos en los que estás tocando próximamente.
            </p>
            <button className={styles.cardBtnSecondary} disabled>
              Próximamente
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
