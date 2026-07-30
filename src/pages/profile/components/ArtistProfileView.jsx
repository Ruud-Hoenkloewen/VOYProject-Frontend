import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import LogoVoy from '../../../components/LogoVoy/LogoVoy';
import FollowButton from '../../../components/FollowButton/FollowButton';
import { useFollowArtist } from '../../../hooks/useFollowArtist';
import { GRADIENTS } from '../../../services/userService';
import { EditIcon } from '../../../components/icons';
import styles from './ArtistProfileView.module.css';

const InstagramSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const SpotifySVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 11.5c2.5-1.5 5.5-1.5 8 0"/>
    <path d="M9 14c2-1 4-1 6 0"/>
    <path d="M7 9c3-2 7-2 10 0"/>
  </svg>
);

const YoutubeSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

export default function ArtistProfileView({ artist, isMyProfile = false }) {
  const [activeTab, setActiveTab] = useState('MÚSICA');
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const audioRef = useRef(null);

  const artistId = artist._id || artist.id;
  const {
    isFollowing,
    followersCount,
  } = useFollowArtist(
    artistId,
    artist.isFollowing || false,
    artist.seguidoresCount || artist.seguidores?.length || 0
  );

  const displayName = artist.nombreArtistico || artist.nombre || artist.username || 'Artista';
  const displayHandle = artist.username ? `@${artist.username}` : `@${displayName.toLowerCase().replace(/\s+/g, '')}`;
  const initial = displayName.charAt(0).toUpperCase();

  const bannerStyle = artist.bannerUrl
    ? { backgroundImage: `url(${artist.bannerUrl})` }
    : { background: GRADIENTS[artist.bannerGradiente] || 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)' };

  const tracks = artist.tracks || [];
  const events = artist.events || [];
  const interactions = artist.interactions || [];

  const handlePlayPause = (track) => {
    if (!track.audioUrl) return;

    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(track.audioUrl);
      audioRef.current = newAudio;
      newAudio.play().catch(console.error);
      setPlayingTrackId(track.id);

      newAudio.onended = () => setPlayingTrackId(null);
    }
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles.headerContainer}>
        <div style={{ position: 'absolute', top: 16, left: 24, zIndex: 10 }}>
          <LogoVoy inverse={true} />
        </div>
        <div className={styles.banner} style={bannerStyle}>
          <div className={styles.bannerOverlay} />
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            <div
              className={styles.avatarSquare}
              style={{ backgroundColor: artist.avatarColor || 'var(--ds-color-accent-primary)' }}
            >
              {(artist.avatarUrl || artist.fotoPerfil) ? (
                <img src={artist.avatarUrl || artist.fotoPerfil} alt={displayName} className={styles.avatarImage} />
              ) : (
                initial
              )}
            </div>

            <div className={styles.actionsGroup}>
              {isMyProfile ? (
                <Link to="/profile/edit" className={styles.editBtn}>
                  <EditIcon size={14} /> EDITAR PERFIL ARTÍSTICO
                </Link>
              ) : (
                <FollowButton userId={artistId} isFollowing={isFollowing} />
              )}
            </div>
          </div>

          <div className={styles.nameBlock}>
            <h1 className={styles.displayName}>{displayName}</h1>
            <span className={styles.username}>{displayHandle}</span>
          </div>

          <div className={styles.badgesRow}>
            <span className={styles.badgeArtist}>🎸 ARTISTA</span>
            {artist.generosMusicales?.map((g) => (
              <span key={g} className={styles.genreTag}>
                {g}
              </span>
            ))}
          </div>

          {artist.bio && <p className={styles.bio}>{artist.bio}</p>}

          <div className={styles.statsAndSocial}>
            <div className={styles.statsRow}>
              <div>
                <span className={styles.statVal}>{followersCount}</span> seguidores
              </div>
              <div>
                <span className={styles.statVal}>{artist.siguiendoCount || artist.siguiendo?.length || 0}</span> siguiendo
              </div>
              {artist.ubicacion && (
                <div style={{ color: 'var(--ds-color-text-subtle)' }}>
                  📍 {artist.ubicacion}
                </div>
              )}
            </div>

            <div className={styles.socialRow}>
              {artist.redesSociales?.instagram && (
                <a
                  href={`https://instagram.com/${artist.redesSociales.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialBtn}
                  aria-label="Instagram"
                >
                  <InstagramSVG />
                </a>
              )}
              {artist.redesSociales?.spotify && (
                <a
                  href={artist.redesSociales.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialBtn}
                  aria-label="Spotify"
                >
                  <SpotifySVG />
                </a>
              )}
              {artist.redesSociales?.youtube && (
                <a
                  href={artist.redesSociales.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialBtn}
                  aria-label="YouTube"
                >
                  <YoutubeSVG />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modular Tabs */}
        <div className={styles.tabsContainer}>
          {['INTERACCIONES', 'MÚSICA', 'EVENTOS'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'MÚSICA' && (
          <div className={styles.sectionBlock}>
            {tracks.length === 0 ? (
              <div className={styles.emptyState}>
                <span>Este artista aún no ha subido temas musicales.</span>
              </div>
            ) : (
              <div className={styles.trackList}>
                {tracks.map((track) => (
                  <div key={track.id} className={styles.trackCard}>
                    <div className={styles.trackInfo}>
                      {track.coverUrl && (
                        <img src={track.coverUrl} alt={track.title} className={styles.trackCover} />
                      )}
                      <div>
                        <h4 className={styles.trackTitle}>{track.title}</h4>
                        <span className={styles.trackAlbum}>
                          {track.album || 'Single'} • {(track.playsCount || 0).toLocaleString()} reproducciones
                        </span>
                      </div>
                    </div>

                    <div className={styles.trackControls}>
                      <span className={styles.trackDuration}>{track.duration}</span>
                      <button
                        className={styles.playBtn}
                        onClick={() => handlePlayPause(track)}
                        aria-label={playingTrackId === track.id ? "Pausar" : "Reproducir"}
                      >
                        {playingTrackId === track.id ? '❚❚' : '▶'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'INTERACCIONES' && (
          <div className={styles.sectionBlock}>
            {interactions.length === 0 ? (
              <div className={styles.emptyState}>
                <span>Aún no hay publicaciones o interacciones de la comunidad para este artista.</span>
              </div>
            ) : (
              <div className={styles.interactionList}>
                {interactions.map((inter) => (
                  <article key={inter.id} className={styles.interactionCard}>
                    <div className={styles.interactionHeader}>
                      <div className={styles.interactionAuthor}>
                        {inter.authorAvatar && (
                          <img
                            src={inter.authorAvatar}
                            alt={inter.authorName}
                            className={styles.interactionAvatar}
                          />
                        )}
                        <div>
                          <span className={styles.authorName}>{inter.authorName}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--ds-color-accent-primary)', marginLeft: 8 }}>
                            {inter.authorRole}
                          </span>
                        </div>
                      </div>
                      <span className={styles.interactionTime}>{inter.timestamp}</span>
                    </div>

                    <p className={styles.interactionContent}>{inter.content}</p>

                    {inter.mediaUrl && (
                      <img src={inter.mediaUrl} alt="Publicación" className={styles.interactionMedia} />
                    )}

                    <div className={styles.interactionFooter}>
                      <button className={styles.likeBtn}>
                        ❤️ {inter.likesCount || 0}
                      </button>
                      <span>💬 {inter.commentsCount || 0} comentarios</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'EVENTOS' && (
          <div className={styles.sectionBlock}>
            {events.length === 0 ? (
              <div className={styles.emptyState}>
                <span>No hay shows programados actualmente para este artista.</span>
              </div>
            ) : (
              <div className={styles.eventsGrid}>
                {events.map((evt) => (
                  <div key={evt.id} className={styles.eventCard}>
                    {evt.image && (
                      <img src={evt.image} alt={evt.title} className={styles.eventImage} />
                    )}
                    <div className={styles.eventBody}>
                      <h4 className={styles.eventTitle}>{evt.title}</h4>
                      <div className={styles.eventMeta}>
                        <span>📅 {evt.date} - {evt.time || '22:00 HS'}</span>
                        <span>📍 {evt.venue}, {evt.city}</span>
                        {evt.roleInEvent && <span>🎸 {evt.roleInEvent}</span>}
                      </div>
                      <Link to={evt.ticketUrl || '/events'} className={styles.eventBtn}>
                        VER ENTRADAS →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
