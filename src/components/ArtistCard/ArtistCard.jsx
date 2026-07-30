import { Link } from 'react-router-dom';
import FollowButton from '../FollowButton/FollowButton';
import { GRADIENTS } from '../../services/userService';
import styles from './ArtistCard.module.css';

export default function ArtistCard({ artist }) {
  if (!artist) return null;

  const {
    _id,
    id,
    nombre,
    nombreArtistico,
    username,
    bio,
    avatarUrl,
    fotoPerfil,
    avatarColor,
    bannerGradiente,
    bannerUrl,
    generosMusicales = [],
    seguidoresCount = 0,
    isFollowing = false,
  } = artist;

  const artistId = _id || id;
  const displayName = nombreArtistico || nombre || username || 'Artista';
  const displayHandle = username ? `@${username}` : `@${displayName.toLowerCase().replace(/\s+/g, '')}`;
  const initial = displayName.charAt(0).toUpperCase();

  const bannerStyle = bannerUrl
    ? { backgroundImage: `url(${bannerUrl})` }
    : { background: GRADIENTS[bannerGradiente] || 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)' };

  return (
    <article className={styles.card}>
      <div className={styles.banner} style={bannerStyle}>
        <div className={styles.bannerOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.avatarWrapper}>
            {(avatarUrl || fotoPerfil) ? (
              <img src={avatarUrl || fotoPerfil} alt={displayName} className={styles.avatarImg} />
            ) : (
              <div
                className={styles.avatarFallback}
                style={{ backgroundColor: avatarColor || 'var(--ds-color-accent-primary)' }}
              >
                {initial}
              </div>
            )}
          </div>
          <span className={styles.badgeArtist}>🎸 ARTISTA</span>
        </div>

        <div>
          <h3 className={styles.artistName}>
            <Link to={`/profile/${username || artistId}`} className={styles.artistNameLink}>
              {displayName}
            </Link>
          </h3>
          <span className={styles.username}>{displayHandle}</span>
        </div>

        {bio && <p className={styles.bio}>{bio}</p>}

        {generosMusicales.length > 0 && (
          <div className={styles.genresRow}>
            {generosMusicales.slice(0, 3).map((g) => (
              <span key={g} className={styles.genreChip}>
                {g}
              </span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.stats}>
            <span>
              <strong className={styles.statNumber}>{seguidoresCount}</strong> seguidores
            </span>
          </div>

          <div className={styles.actions}>
            <Link to={`/profile/${username || artistId}`} className={styles.btnProfile}>
              VER PERFIL
            </Link>
            <FollowButton userId={artistId} isFollowing={isFollowing} />
          </div>
        </div>
      </div>
    </article>
  );
}
