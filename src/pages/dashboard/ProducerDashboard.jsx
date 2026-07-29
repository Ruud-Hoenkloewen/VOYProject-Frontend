import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { useDashboardData } from '../../hooks/useDashboardData';
import styles from './ProducerDashboard.module.css';

export default function ProducerDashboard() {
  const { metrics, events, loading } = useDashboardData('producer');

  return (
    <DashboardLayout
      eyebrow="PANEL DE PRODUCTORA"
      title="GESTIÓN DE FECHAS Y METRICAS"
      subtitle="Administrá tus eventos, monitoreá ventas y gestioná tus publicaciones."
      metrics={metrics}
      actions={
        <Link to="/events/create" className={styles.createBtn}>
          + CREAR NUEVO EVENTO
        </Link>
      }
    >
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Tus Shows Programados</h2>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <span>Cargando eventos de la productora...</span>
        </div>
      ) : events.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No tenés eventos creados actualmente.</p>
          <Link to="/events/create" className={styles.createBtn} style={{ marginTop: 12 }}>
            Crear primer show
          </Link>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {events.map((evt) => {
            const sold = evt.ticketsSold || 0;
            const cap = evt.totalCapacity || 100;
            const pct = Math.min(100, Math.round((sold / cap) * 100));

            return (
              <div key={evt.id} className={styles.eventCard}>
                <div
                  className={styles.cardBanner}
                  style={{
                    backgroundImage: `url(${evt.image || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80'})`,
                  }}
                >
                  <div className={styles.cardBannerOverlay} />
                  <span className={styles.statusBadge}>{evt.status || 'Publicado'}</span>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.eventTitle}>{evt.title}</h3>
                  <div className={styles.metaRow}>
                    <span>📅 {evt.date}</span>
                    <span>📍 {evt.venue}{evt.city ? `, ${evt.city}` : ''}</span>
                  </div>

                  <div className={styles.salesBar}>
                    <div className={styles.salesText}>
                      <span>Entradas: {sold} / {cap}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <Link to={`/events/edit/${evt.id}`} className={styles.actionBtn}>
                    EDITAR
                  </Link>
                  <Link to={`/events/${evt.id}`} className={styles.actionBtn}>
                    VER PÁGINA
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
