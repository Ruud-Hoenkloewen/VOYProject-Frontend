import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../context/AuthContext';
import styles from './ArtistDashboard.module.css';

export default function ArtistDashboard() {
  const { user } = useAuth();
  const { metrics, events, loading } = useDashboardData('artist');

  const artistName = user?.nombreArtistico || user?.nombre || 'Artista';

  return (
    <DashboardLayout
      eyebrow="PANEL DE ARTISTA"
      title={`¡HOLA, ${artistName.toUpperCase()}!`}
      subtitle="Monitoreá tus métricas de audiencia, próximas fechas y administración de tu perfil."
      metrics={metrics}
      actions={
        <Link to="/profile/edit" className={styles.profileBtn}>
          ✏️ EDITAR PERFIL Y MÚSICA
        </Link>
      }
    >
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Próximos Shows Confirmados</h2>
        <Link to={`/profile/${user?.username || 'me'}`} className={styles.actionBtn}>
          VER MI PERFIL PÚBLICO →
        </Link>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <span>Cargando fechas del artista...</span>
        </div>
      ) : events.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No tenés presentaciones agendadas próximamente.</p>
        </div>
      ) : (
        <div className={styles.gigsGrid}>
          {events.map((evt) => (
            <div key={evt.id} className={styles.gigCard}>
              <div
                className={styles.cardBanner}
                style={{
                  backgroundImage: `url(${evt.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'})`,
                }}
              >
                <div className={styles.cardBannerOverlay} />
                <span className={styles.statusBadge}>{evt.status || 'Confirmado'}</span>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.gigTitle}>{evt.title}</h3>
                <div className={styles.metaRow}>
                  <span>📅 {evt.date}</span>
                  <span>📍 {evt.venue}{evt.city ? `, ${evt.city}` : ''}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link to="/events" className={styles.actionBtn}>
                  VER CARTELERA
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
