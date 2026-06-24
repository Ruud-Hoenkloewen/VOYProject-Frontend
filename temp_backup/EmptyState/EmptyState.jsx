import { Link } from "react-router-dom";
import styles from "./EmptyState.module.css";

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionTo, 
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
    </div>
  );
}
