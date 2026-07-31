import { Link } from "react-router-dom";
import styles from "./EmptyState.module.css";

/**
 * Componente: EmptyState
 * Ilustración o mensaje cuando no hay resultados de eventos con botón de acción opcional.
 */
export default function EmptyState({ 
  icon, 
  title = "No encontramos eventos", 
  description = "No hay coincidencias con los filtros aplicados.", 
  actionLabel, 
  actionTo, 
  onAction,
  compact = false 
}) {
  return (
    <div className={`${styles.emptyState} ${compact ? styles.compact : ""}`}>
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      <div className={styles.emptyContent}>
        <h4 className={styles.emptyTitle}>{title}</h4>
        {description && <p className={styles.emptyDesc}>{description}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className={styles.emptyAction}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <button type="button" onClick={onAction} className={styles.emptyActionButton}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
