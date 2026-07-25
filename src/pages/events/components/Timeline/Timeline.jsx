import styles from "../../EventDetailPage.module.css";

export default function Timeline({ doorsOpenTime = "22:00", venueCloseTime = "01:15", artists = [] }) {
  return (
    <div className={styles.timeline}>
      
      {/* 1. INGRESO AL VENUE */}
      <div className={styles.tlRow}>
        <div className={`${styles.tlTime} ${styles.tlTimeGreen}`}>{doorsOpenTime}</div>
        <div className={styles.tlDivider}>
          <div className={`${styles.tlDot} ${styles.dotGreen}`} />
          <div className={styles.tlLine} />
        </div>
        <div className={styles.tlContent}>
          <div className={styles.tlTitleRow}>
            <span className={`${styles.tlTitle} ${styles.tlTitleWhite}`}>PUERTAS ABREN</span>
          </div>
          <span className={styles.tlSubtitle}>Ingreso al venue</span>
        </div>
      </div>

      {/* 2. ORDEN DE BANDAS NUMERADAS EN LA MISMA LÍNEA */}
      {artists && artists.length > 0 && (
        <div className={styles.tlRow}>
          <div className={styles.tlTime}></div>
          <div className={styles.tlDivider}>
            <div className={styles.lineupLine} />
          </div>
          <div className={styles.lineupContent}>
            <div className={styles.lineupList}>
              {artists.map((artist, idx) => {
                const num = String(idx + 1).padStart(2, "0");
                const isHeadliner = artist.headliner || idx === artists.length - 1;
                const isApertura = artist.apertura || idx === 0;

                return (
                  <div key={idx} className={styles.artistRow}>
                    <span className={styles.artistNum}>
                      {num}
                    </span>
                    <span className={`${styles.artistName} ${isHeadliner ? styles.artistHeadliner : ""}`}>
                      {artist.nombre}
                    </span>
                    {isHeadliner && (
                      <span className={`${styles.tlBadge} ${styles.badgeMagenta}`}>HEADLINER</span>
                    )}
                    {!isHeadliner && isApertura && artists.length > 1 && (
                      <span className={`${styles.tlBadge} ${styles.badgeGreen}`}>APERTURA</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. CIERRE DEL VENUE */}
      <div className={styles.tlRow}>
        <div className={`${styles.tlTime} ${styles.tlTimeGrey}`}>{venueCloseTime}</div>
        <div className={styles.tlDivider}>
          <div className={`${styles.tlDot} ${styles.dotGrey}`} />
        </div>
        <div className={styles.tlContent}>
          <div className={styles.tlTitleRow}>
            <span className={`${styles.tlTitle} ${styles.tlTitleGrey}`}>CIERRE DEL VENUE</span>
          </div>
          <span className={styles.tlSubtitle}>Fin del evento</span>
        </div>
      </div>

    </div>
  );
}
