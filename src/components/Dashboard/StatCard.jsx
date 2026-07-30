import styles from './StatCard.module.css';

/**
 * StatCard — Tarjeta de métrica genérica y reutilizable para dashboards.
 * Props:
 *   title        {string}  — Título de la métrica
 *   value        {string|number} — Valor a mostrar
 *   change       {string}  — Variación procentual o texto (+12%, -3%)
 *   isPositive   {boolean} — Define si el cambio es verde (+) o rojo (-)
 *   icon         {string}  — Emoji o ícono decorativo
 *   subtext      {string}  — Leyenda complementaria
 */
export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon = "📊",
  subtext,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.title}>{title}</span>
        <div className={styles.iconBox}>{icon}</div>
      </div>

      <h3 className={styles.value}>{value}</h3>

      {(change || subtext) && (
        <div className={styles.bottomRow}>
          {change && (
            <span className={isPositive ? styles.badgePositive : styles.badgeNegative}>
              {change}
            </span>
          )}
          {subtext && <span className={styles.subtext}>{subtext}</span>}
        </div>
      )}
    </div>
  );
}
