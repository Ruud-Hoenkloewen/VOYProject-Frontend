import { useNavigate } from "react-router-dom";
import { InstagramIcon, ExternalLinkIcon } from "../../../../components/icons";
import styles from "../../EventDetailPage.module.css";

const ARTIST_REGISTERED_REGISTRY = {
  'bogardus': {
    username: 'bogardus.ok',
    avatar: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=1200&q=80',
    bio: 'Rock crudo, surf punk y psicodelia tucumana. Dos décadas haciendo arder los escenarios del under.',
    avatarColor: '#00FF9F',
    instagram: '@bogardus.ok'
  },
  'lacrifagia': {
    username: 'lacrifagia.banda',
    avatar: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80',
    bannerImagen: '/flyer-lacrifagia.png',
    bio: 'Hardcore, emo y rock alternativo tucumano. Expresando catarsis, enojo y verdad en cada fecha.',
    avatarColor: '#FF2D78',
    instagram: '@lacrifagia.banda'
  },
  'plutonio jam': {
    username: 'plutoniojam',
    avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    bio: 'Reggae, ska y fusión rítmica tucumana. Buenas vibras y vientos al frente para hacer bailar al under.',
    avatarColor: '#00FF9F',
    instagram: '@plutoniojam'
  },
  'danny proyectil': {
    username: 'danny_proyectil',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    bannerImagen: '/flyer-danny-proyectil.png',
    bio: 'Post-punk y grunge tucumano. Riffs oscuros, bajos pulsantes y la actitud del New Direction.',
    avatarColor: '#33FF57',
    instagram: '@danny_proyectil'
  },
  'mientras el lobo': {
    username: 'mientraselobo',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    bio: 'Hermandad, canciones directas y rock alternativo de pura cepa tucumana.',
    avatarColor: '#FFD600',
    instagram: '@mientraselobo'
  },
  'utópico amanecer': {
    username: 'utopico.amanecer',
    avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    bio: 'Dream rock y synth pop alternativo. Oscilando entre la nostalgia, la euforia y las texturas envolventes.',
    avatarColor: '#00E5FF',
    instagram: '@utopico.amanecer'
  },
  'las maldiciones': {
    username: 'las.maldiciones',
    avatar: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=400&q=80',
    bannerImagen: '/flyer-sabbath-fest.png',
    bio: 'Stoner rock, doom y metal oscuro del centro tucumano. Riffs lentos y pesados que retumban en el suelo.',
    avatarColor: '#A044FF',
    instagram: '@las.maldiciones'
  },
  'black midi': {
    username: 'bmblackmidi',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    bio: 'black midi easter egg',
    avatarColor: '#FF2D78',
    instagram: '@bmblackmidi'
  },
  'la mugre': {
    username: 'lamugre',
    avatar: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=400&q=80',
    bio: 'Indie del barrio. Letras de caño y de tarde en el centro.',
    avatarColor: '#FFD600',
    instagram: '@lamugre'
  },
  'palco roto': {
    username: 'palcoroto',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    bio: 'Shoegaze tucumano. Suenan como si el calor se volviera ruido.',
    avatarColor: '#00E5FF',
    instagram: '@palcoroto'
  },
  'siesta de agosto': {
    username: 'siestadeagosto',
    avatar: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=400&q=80',
    bio: 'Indie folk y melodías íntimas de la siesta tucumana.',
    avatarColor: '#A044FF',
    instagram: '@siestadeagosto'
  },
  'maleza': {
    username: 'maleza',
    avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80',
    bio: 'Indie rock del NOA. Riffs frescos, juventud y espíritu festivalero.',
    avatarColor: '#00FF9F',
    instagram: '@maleza'
  },
  'costas': {
    username: 'costas',
    avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    bio: 'Shoegaze e indie en los escenarios más chicos y más lindos del under.',
    avatarColor: '#FF2D78',
    instagram: '@costas'
  }
};

export default function ArtistGrid({ artists, concertPhotos = [], bandDescriptions = [] }) {
  const navigate = useNavigate();
  if (!artists || artists.length === 0) return null;
  const n = artists.length;

  return (
    <div className={styles.artistsGrid}>
      {artists.map((artist, idx) => {
        const isHeadliner = idx === n - 1 || artist.headliner;
        const isApertura  = idx === 0 && !isHeadliner;
        const isInvitada  = idx === 1 && n > 2 && !isHeadliner;
        const badgeColor  = isHeadliner ? "magenta" : isApertura ? "green" : "grey";
        const badgeText   = isHeadliner ? "HEADLINER" : isApertura ? "APERTURA" : isInvitada ? "INVITADA" : null;

        const normName = (artist.nombre || '').toLowerCase().trim();
        const registryMatch = ARTIST_REGISTERED_REGISTRY[normName] || {};
        const userObj = artist.usuario || {};

        const username = userObj.username || registryMatch.username || normName.replace(/\s+/g, '');
        const avatar = userObj.avatar || userObj.avatarUrl || userObj.fotoPerfil || registryMatch.avatar || concertPhotos[idx % concertPhotos.length];
        const avatarColor = userObj.avatarColor || registryMatch.avatarColor || '#FF2D78';
        const bannerImagen = userObj.bannerImagen || registryMatch.bannerImagen || concertPhotos[(idx + 1) % concertPhotos.length];
        const bio = userObj.bio || registryMatch.bio || bandDescriptions[idx % bandDescriptions.length] || 'Artista de la escena independiente.';
        const instagram = userObj.redesSociales?.instagram || registryMatch.instagram || `@${username}`;

        return (
          <div key={artist.id || artist._id || `artist-${idx}`} className={styles.artistCard}>
            <div className={styles.artistCardBg}>
              <img src={bannerImagen} alt={`Banner ${artist.nombre}`} className={styles.artistCardImg} />
              <div className={styles.artistCardGradient} />
              {badgeText && (
                <span className={`${styles.artistCardBadge} ${styles[`bg_${badgeColor}`]}`}>
                  {badgeText}
                </span>
              )}
            </div>

            <div className={styles.artistCardContent}>
              <div className={styles.artistCardInfo}>
                <div className={styles.artistHeaderRow}>
                  <div className={styles.artistAvatarCircle} style={{ borderColor: avatarColor }}>
                    {avatar ? (
                      <img src={avatar} alt={artist.nombre} className={styles.artistAvatarImg} />
                    ) : (
                      <span className={styles.artistAvatarInitials}>
                        {(artist.nombre || 'A').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className={styles.artistTitleMeta}>
                    <h3 className={styles.artistCardName}>{artist.nombre}</h3>
                    <span className={styles.artistHandle}>@{username}</span>
                  </div>
                </div>
                <p className={styles.artistCardDesc}>{bio}</p>
              </div>

              <div className={styles.artistCardFooter}>
                <div className={styles.artistIgBadge}>
                  <InstagramIcon />
                  <span>{instagram.startsWith('@') ? instagram : `@${instagram}`}</span>
                </div>
                <button
                  className={styles.artistProfileBtn}
                  onClick={() => navigate(`/profile/${username}`)}
                >
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
