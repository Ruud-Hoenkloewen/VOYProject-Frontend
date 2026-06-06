import styles from "../../EventDetailPage.module.css";

export default function Timeline({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.timeline}>
      {items.map((item, idx) => {
        const isPast   = item.role === "cierre";
        const isGreen  = item.role === "puertas";
        const isMag    = item.role === "headliner";
        const timeClass = isGreen
          ? styles.tlTimeGreen
          : isMag
          ? styles.tlTimeMagenta
          : isPast
          ? styles.tlTimeGrey
          : styles.tlTimeWhite;
        const dotClass = isGreen
          ? styles.dotGreen
          : isMag
          ? styles.dotMagenta
          : styles.dotGrey;
        const titleClass = isPast
          ? styles.tlTitleGrey
          : isMag
          ? styles.tlTitleMagenta
          : styles.tlTitleWhite;

        return (
          <div key={`${item.time}-${idx}`} className={styles.tlRow}>
            {/* Hora */}
            <div className={`${styles.tlTime} ${timeClass}`}>{item.time}</div>

            {/* Dot + line */}
            <div className={styles.tlDivider}>
              <div className={`${styles.tlDot} ${dotClass}`} />
              {idx !== items.length - 1 && (
                <div className={styles.tlLine} />
              )}
            </div>

            {/* Content */}
            <div className={styles.tlContent}>
              <div className={styles.tlTitleRow}>
                <span className={`${styles.tlTitle} ${titleClass}`}>{item.title}</span>
                {item.badge && (
                  <span className={`${styles.tlBadge} ${
                    item.role === "headliner"
                      ? styles.badgeMagenta
                      : item.role === "apertura"
                      ? styles.badgeGreen
                      : styles.badgeCyan
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={styles.tlSubtitle}>{item.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
