import { InstagramIcon, ExternalLinkIcon } from "../../../../components/icons";
import { igSlug } from "../../../../utils/helpers";
import styles from "../../EventDetailPage.module.css";

export default function ArtistGrid({ artists, concertPhotos, bandDescriptions }) {
  if (!artists || artists.length === 0) return null;
  const n = artists.length;

  return (
    <div className={styles.artistsGrid}>
      {artists.map((artist, idx) => {
        const isHeadliner = idx === n - 1;
        const isApertura  = idx === 0;
        const isInvitada  = idx === 1 && n > 2;
        const badgeColor  = isHeadliner ? "magenta" : isApertura ? "green" : "grey";
        const badgeText   = isHeadliner ? "HEADLINER" : isApertura ? "APERTURA" : isInvitada ? "INVITADA" : null;
        const photo  = concertPhotos[idx % concertPhotos.length];
        const desc   = bandDescriptions[idx % bandDescriptions.length];

        return (
          <div key={artist._id || `artist-${idx}`} className={styles.artistCard}>
            <div className={styles.artistCardBg}>
              <img src={photo} alt={artist.nombre} className={styles.artistCardImg} />
              <div className={styles.artistCardGradient} />
              {badgeText && (
                <span className={`${styles.artistCardBadge} ${styles[`bg_${badgeColor}`]}`}>
                  {badgeText}
                </span>
              )}
            </div>

            <div className={styles.artistCardContent}>
              <div className={styles.artistCardInfo}>
                <h3 className={styles.artistCardName}>{artist.nombre}</h3>
                <p className={styles.artistCardDesc}>{desc}</p>
              </div>
              <div className={styles.artistCardFooter}>
                <div className={styles.artistIgBadge}>
                  <InstagramIcon />
                  <span>@{igSlug(artist.nombre)}</span>
                </div>
                <button className={styles.artistProfileBtn}>
                  Ver perfil <ExternalLinkIcon />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
