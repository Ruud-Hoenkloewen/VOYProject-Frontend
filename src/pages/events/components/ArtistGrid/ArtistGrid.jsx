import { useNavigate } from "react-router-dom";
import { InstagramIcon, ExternalLinkIcon } from "../../../../components/icons";
import styles from "../../EventDetailPage.module.css";

const ARTIST_REGISTERED_REGISTRY = {
  'bogardus': {
    username: 'bogardus.ok',
    avatar: '/bogardus-avatar.png',
    bannerImagen: '/bogardus-banner.png',
    lema: 'VIVA EL DIAVLO.',
    bio: 'Icónica banda tucumana de surf punk, grunge y rock psicodélico.',
    avatarColor: '#00FF9F',
    instagram: '@bogardus.ok'
  },
  'lacrifagia': {
    username: 'lacrifagia.banda',
    avatar: '/lacrifagia-avatar.png',
    bannerImagen: '/lacrifagia-banner.png',
    lema: 'Cuarteto de emo, post-hardcore y rock alternativo.',
    bio: 'Cuarteto de emo, post-hardcore y rock alternativo.',
    avatarColor: '#FF2D78',
    instagram: '@lacrifagia.banda'
  },
  'plutonio jam': {
    username: 'plutoniojam',
    avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    lema: 'Reggae, ska y fusión rítmica con vientos al frente.',
    bio: 'Reggae, ska y fusión rítmica tucumana.',
    avatarColor: '#00FF9F',
    instagram: '@plutoniojam'
  },
  'danny proyectil': {
    username: 'danny_proyectil',
    avatar: '/dannyproyectil-avatar.png',
    bannerImagen: '/dannyproyectil-banner.png',
    lema: 'Hacemos música instrumental.',
    bio: 'Hacemos música instrumental.',
    avatarColor: '#33FF57',
    instagram: '@danny_proyectil'
  },
  'mientras el lobo': {
    username: 'mientraselobo',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    lema: 'Canciones directas, hermandad y rock alternativo de cepa tucumana.',
    bio: 'Hermandad, canciones directas y rock alternativo.',
    avatarColor: '#FFD600',
    instagram: '@mientraselobo'
  },
  'utópico amanecer': {
    username: 'utopico.amanecer',
    avatar: '/utopicoamanecer-avatar.png',
    bannerImagen: '/utopicoamanecer-banner.png',
    lema: 'EUSTALGIA ya disponible en todas nuestras plataformas.',
    bio: 'EUSTALGIA ya disponible en todas nuestras plataformas.',
    avatarColor: '#00E5FF',
    instagram: '@utopico.amanecer',
    spotifyTrack: 'https://open.spotify.com/track/5PCoH5xzGhciRy1KWgkLY7?si=d7e13045248f46eb'
  },
  'las maldiciones': {
    username: 'las.maldiciones',
    avatar: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=400&q=80',
    bannerImagen: '/flyer-sabbath-fest.png',
    lema: 'Stoner rock, doom metal y riffs pesados del centro.',
    bio: 'Stoner rock, doom y metal oscuro.',
    avatarColor: '#A044FF',
    instagram: '@las.maldiciones'
  },
  'black midi': {
    username: 'bmblackmidi',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    bannerImagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    lema: 'Math rock, post-punk avant-garde y caos instrumental.',
    bio: 'black midi easter egg',
    avatarColor: '#FF2D78',
    instagram: '@bmblackmidi'
  },
  'la mugre': {
    username: 'lamugre',
    avatar: 'https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?auto=format&fit=crop&w=400&q=80',
    lema: 'Indie de barrio y canciones urbanas del centro.',
    bio: 'Indie del barrio.',
    avatarColor: '#FFD600',
    instagram: '@lamugre'
  },
  'palco roto': {
    username: 'palcoroto',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    lema: 'Shoegaze tucumano. Ruido, distorsión y paredes de sonido.',
    bio: 'Shoegaze tucumano.',
    avatarColor: '#00E5FF',
    instagram: '@palcoroto'
  },
  'siesta de agosto': {
    username: 'siestadeagosto',
    avatar: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=400&q=80',
    lema: 'Indie folk y canciones íntimas de la tarde tucumana.',
    bio: 'Indie folk y melodías íntimas.',
    avatarColor: '#A044FF',
    instagram: '@siestadeagosto'
  },
  'maleza': {
    username: 'maleza',
    avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80',
    lema: 'Indie rock del NOA. Riffs frescos y espíritu festivalero.',
    bio: 'Indie rock del NOA.',
    avatarColor: '#00FF9F',
    instagram: '@maleza'
  },
  'costas': {
    username: 'costas',
    avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    lema: 'Shoegaze e indie en los rincones más lindos del under.',
    bio: 'Shoegaze e indie.',
    avatarColor: '#FF2D78',
    instagram: '@costas'
  },
  'entre penumbras': {
    username: 'entrepenumbras',
    avatar: '/entrepenumbras-avatar.png',
    bannerImagen: '/entrepenumbras-banner.png',
    lema: 'Banda hardcore de San Miguel de Tucumán que nace en dic de 2020, en un contexto particular del mundo.',
    bio: 'Banda hardcore de San Miguel de Tucumán que nace en dic de 2020, en un contexto particular del mundo.',
    avatarColor: '#00E5FF',
    instagram: '@entrepenumbras',
    spotifyTrack: 'https://open.spotify.com/track/6KvF0h8DZI7FBONenQ0Afq?si=10867e047af74d85'
  },
  'para salir de la oscuridad': {
    username: 'parasalirdelaoscuridad',
    avatar: '/parasalirdelaoscuridad-avatar.png',
    bannerImagen: '/parasalirdelaoscuridad-banner.png',
    lema: 'ESCUCHÁ NUESTRO SINGLE "HERMANO" EN TODAS LAS PLATAFORMAS',
    bio: 'ESCUCHÁ NUESTRO SINGLE "HERMANO" EN TODAS LAS PLATAFORMAS',
    avatarColor: '#FF2D78',
    instagram: '@parasalirdelaoscuridad',
    spotifyTrack: 'https://open.spotify.com/track/03bDbfkojQCELp6tYhWJzt?si=084caf87f4a74b0e'
  },
  'las cosas inexplicables': {
    username: 'lascosasinexplicables',
    avatar: '/lascosasinexplicables-avatar.png',
    bannerImagen: '/lascosasinexplicables-banner.png',
    lema: 'Las cosas inexplicables suceden a pesar de todo.',
    bio: 'Las cosas inexplicables suceden a pesar de todo.',
    avatarColor: '#00FF9F',
    instagram: '@lascosasinexplicables',
    spotifyTrack: 'https://open.spotify.com/track/6aOQ9UpwxQLk8eNEbYdsKT?si=36544c1eafc140f9'
  }
};

export default function ArtistGrid({ artists, concertPhotos = [], bandDescriptions = [] }) {
  const navigate = useNavigate();
  if (!artists || artists.length === 0) return null;
  const n = artists.length;

  return (
    <div className={styles.artistsGrid}>
      {artists.map((artist, idx) => {
        const isHeadliner = idx === n - 1 || artist.headliner || artist.debut;
        const isApertura  = idx === 0 && !isHeadliner;
        const isInvitada  = idx === 1 && n > 2 && !isHeadliner;
        const badgeColor  = isHeadliner ? "magenta" : isApertura ? "green" : "grey";
        const badgeText   = isHeadliner ? "DEBUT" : isApertura ? "APERTURA" : isInvitada ? "INVITADA" : null;

        const normName = (artist.nombre || '').toLowerCase().trim();
        const registryMatch = ARTIST_REGISTERED_REGISTRY[normName] || {};
        const userObj = artist.usuario || {};

        const username = userObj.username || registryMatch.username || normName.replace(/\s+/g, '');
        const avatar = userObj.avatar || userObj.avatarUrl || userObj.fotoPerfil || registryMatch.avatar || concertPhotos[idx % concertPhotos.length];
        const rawColor = userObj.avatarColor || registryMatch.avatarColor;
        const avatarColor = (rawColor && rawColor !== 'none' && rawColor !== 'transparent') ? rawColor : 'transparent';
        const bannerImagen = userObj.bannerImagen || registryMatch.bannerImagen || concertPhotos[(idx + 1) % concertPhotos.length];
        const lema = userObj.lema || registryMatch.lema || registryMatch.bio || 'Artista de la escena independiente.';
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
                <p className={styles.artistCardDesc}>{lema}</p>
              </div>

              <div className={styles.artistCardFooter}>
                <div className={styles.artistIgBadge}>
                  <InstagramIcon />
                  <span>{instagram.startsWith('@') ? instagram : `@${instagram}`}</span>
                </div>
                <button
                  className={styles.artistProfileBtn}
                  onClick={() => navigate(`/profile/${username}?tab=MUSICA`)}
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
