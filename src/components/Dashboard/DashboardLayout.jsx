import EditorialHeader from '../../design-system/composites/EditorialHeader/EditorialHeader';
import StatCard from './StatCard';
import styles from './DashboardLayout.module.css';

/**
 * DashboardLayout — Layout genérico y reutilizable para Paneles de Control.
 * Props:
 *   eyebrow   {string}          — Categoría superior (ej. "PANEL DE PRODUCTORA")
 *   title     {string}          — Título principal del dashboard
 *   subtitle  {string}          — Descripción corta
 *   metrics   {Array<Object>}   — Lista de objetos métrica para renderizar StatCards
 *   actions   {React.ReactNode} — Botones de acción principales (ej. "Crear Evento")
 *   children  {React.ReactNode} — Secciones principales de la vista (tablas, gráficos, etc.)
 */
export default function DashboardLayout({
  eyebrow = "PANEL DE CONTROL",
  title,
  subtitle,
  metrics = [],
  actions,
  children,
}) {
  return (
    <div className={styles.pageRoot}>
      <EditorialHeader />

      <main className={styles.mainContent}>
        <header className={styles.headerSection}>
          <div className={styles.titleBlock}>
            {eyebrow && <span className={styles.eyebrow}>◆ {eyebrow}</span>}
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          {actions && <div className={styles.actionsGroup}>{actions}</div>}
        </header>

        {metrics.length > 0 && (
          <section className={styles.metricsGrid}>
            {metrics.map((metric) => (
              <StatCard key={metric.id || metric.title} {...metric} />
            ))}
          </section>
        )}

        <section className={styles.bodySection}>{children}</section>
      </main>
    </div>
  );
}
