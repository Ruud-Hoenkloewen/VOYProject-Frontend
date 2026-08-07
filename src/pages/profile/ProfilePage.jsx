import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchEvents } from '../../services/eventService';
import { getProfileByUsername, getMyProfile, GRADIENTS } from '../../services/userService';
import { EventCard } from '../../design-system';
import { TicketIcon, HeartIcon, StarIcon, EditIcon, MapPinIcon, ZapIcon, MusicIcon, PeopleIcon, ExternalLinkIcon } from '../../components/icons';
import FollowButton from '../../components/FollowButton/FollowButton';
import LogoVoy from '../../components/LogoVoy/LogoVoy';
import ImageLightboxModal from '../../components/ImageLightboxModal/ImageLightboxModal';
import styles from './ProfilePage.module.css';

const InstagramSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const SpotifySVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.341c-.218.359-.684.473-1.043.254-2.857-1.746-6.455-2.141-10.692-1.171-.409.094-.817-.163-.911-.572-.094-.409.163-.817.572-.911 4.636-1.06 8.608-.609 11.796 1.341.359.219.473.684.254 1.059zm1.472-3.275c-.275.448-.863.592-1.311.317-3.268-2.008-8.251-2.592-12.118-1.418-.506.153-1.041-.137-1.194-.643-.153-.506.137-1.041.643-1.194 4.417-1.34 9.904-.691 13.663 1.62.448.275.592.863.317 1.318zm.145-3.411c-3.921-2.328-10.384-2.543-14.137-1.404-.613.186-1.258-.168-1.444-.781-.186-.613.168-1.258.781-1.444 4.312-1.309 11.449-1.049 15.961 1.63.55.326.732 1.037.406 1.587-.326.55-1.037.732-1.587.406z"/>
  </svg>
);

const YoutubeSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const LinkSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const CalendarIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const getSpotifyEmbedUrl = (raw) => {
  if (!raw) return null;
  const str = String(raw).trim();
  
  if (/^[a-zA-Z0-9]{22}$/.test(str)) {
    return `https://open.spotify.com/embed/track/${str}?utm_source=generator&theme=0`;
  }
  
  const matchTrack = str.match(/(?:track\/|spotify:track:)([a-zA-Z0-9]{22})/);
  if (matchTrack && matchTrack[1]) {
    return `https://open.spotify.com/embed/track/${matchTrack[1]}?utm_source=generator&theme=0`;
  }
  
  const matchAlbum = str.match(/(?:album\/|spotify:album:)([a-zA-Z0-9]{22})/);
  if (matchAlbum && matchAlbum[1]) {
    return `https://open.spotify.com/embed/album/${matchAlbum[1]}?utm_source=generator&theme=0`;
  }
  
  const matchPlaylist = str.match(/(?:playlist\/|spotify:playlist:)([a-zA-Z0-9]{22})/);
  if (matchPlaylist && matchPlaylist[1]) {
    return `https://open.spotify.com/embed/playlist/${matchPlaylist[1]}?utm_source=generator&theme=0`;
  }

  const matchArtist = str.match(/(?:artist\/|spotify:artist:)([a-zA-Z0-9]{22})/);
  if (matchArtist && matchArtist[1]) {
    return `https://open.spotify.com/embed/artist/${matchArtist[1]}?utm_source=generator&theme=0`;
  }
  
  return null;
};

// Componente de carga con porcentaje animado para el perfil
function ProfileLoader() {
  const [pct, setPct] = useState(10);
  const idRef = useRef(null);

  useEffect(() => {
    idRef.current = setInterval(() => {
      setPct(prev => {
        if (prev >= 92) { clearInterval(idRef.current); return prev; }
        const step = prev < 50 ? 10 : prev < 75 ? 4 : 1;
        return Math.min(prev + step, 92);
      });
    }, 100);
    return () => clearInterval(idRef.current);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--ds-color-bg-canvas)',
      backgroundImage: 'none',
      zIndex: 9999,
    }}>
      <span style={{
        color: '#4b5563',
        fontFamily: 'monospace',
        fontSize: '0.78rem',
        letterSpacing: '0.06em',
      }}>
        cargando...{' '}
        <span style={{ color: '#00FF9F' }}>{pct}%</span>
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [socialModalType, setSocialModalType] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const [activeTab, setActiveTab] = useState('MI INFO');
  const [allEvents, setAllEvents] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (tabParam) {
      const upperTab = tabParam.toUpperCase();
      if (['MÚSICA', 'MUSICA', 'PRÓXIMOS SHOWS', 'MI INFO', 'EVENTOS GUARDADOS', 'HISTORIAL', 'CARTELERA', 'INFO'].includes(upperTab)) {
        setActiveTab(upperTab === 'MUSICA' ? 'MÚSICA' : upperTab);
      }
    } else if (profile) {
      const isArtist = profile.role === 'artist' || profile.rol === 'artist' || profile.rol === 'artista';
      if (isArtist) {
        setActiveTab('MÚSICA');
      }
    }
  }, [tabParam, profile]);

  const isMyProfile = isAuthenticated && user && (
    username === 'me' || 
    username === user.username || 
    username === user._id || 
    username === user.id
  );

  useEffect(() => {
    const loadAll = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        // Cargamos perfil y eventos en paralelo para reducir tiempo de espera
        const profilePromise = isMyProfile
          ? getMyProfile().catch(() =>
              username && username !== 'me'
                ? getProfileByUsername(username)
                : Promise.reject(new Error('No se pudo cargar el perfil'))
            )
          : getProfileByUsername(username);

        const [data, events] = await Promise.all([
          profilePromise,
          fetchEvents().catch(() => []),
        ]);

        setProfile(data);
        setAllEvents(events);
      } catch (err) {
        console.error('Error cargando perfil:', err);
        setProfileError('No se pudo cargar el perfil o no existe.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (username) {
      loadAll();
    }
  }, [username, isMyProfile]);

  useEffect(() => {
    if (profile?.favoritos && allEvents.length > 0) {
      setFavoriteEvents(allEvents.filter(e => profile.favoritos.includes(e.id)));
    }
  }, [profile, allEvents]);

  useEffect(() => {
    if (isMyProfile && activeTab === 'HISTORIAL' && orders.length === 0) {
      import('../../services/orderService').then(({ getMyOrders }) => {
        getMyOrders().then(setOrders).catch(console.error);
      });
    }
  }, [isMyProfile, activeTab, orders.length]);

  if (isLoadingProfile) {
    return <ProfileLoader />;
  }

  if (profileError || !profile) {
    return (
      <div className={styles.errorState}>
        <h2>{profileError || "Perfil no encontrado"}</h2>
        <Link to="/" className={styles.errorLink}>Volver al inicio</Link>
      </div>
    );
  }

  const safeName = profile.nombre || profile.username || 'Usuario';
  const initial = safeName.charAt(0).toUpperCase();
  const displayUsername = profile.username ? `@${profile.username}` : `@${safeName.toLowerCase().replace(/\s/g, '')}`;
  const isProducer = profile.role === 'producer' || profile.rol === 'producer' || profile.isVerifiedProducer;
  const isArtist = profile.role === 'artist' || profile.rol === 'artist' || profile.rol === 'artista';

  const hasCustomBorder = profile.avatarColor && profile.avatarColor !== 'transparent' && profile.avatarColor !== 'none';
  const avatarStyle = hasCustomBorder 
    ? { background: profile.avatarColor, color: '#ffffff', padding: '3px' } 
    : { background: '#1e2433', color: '#ffffff', padding: 0 };
  const bannerBg = profile.bannerImagen
    ? `url("${profile.bannerImagen}") center/cover no-repeat`
    : (GRADIENTS[profile.bannerGradiente] || profile.bannerGradiente || profile.bannerColor || GRADIENTS.g1);
  
  const followersCount = profile.seguidores?.length || 0;
  const followingCount = profile.siguiendo?.length || 0;

  const producerEvents = allEvents.filter(e => {
    const creatorId = e.creador?._id || e.creador;
    return creatorId === profile._id;
  });

  const artistEvents = allEvents.filter(e => {
    const nameMatch = (name) => name && (
      (e.lineup && Array.isArray(e.lineup) && e.lineup.some(artist => String(artist).toLowerCase().includes(name.toLowerCase()))) ||
      (e.lineup && typeof e.lineup === 'string' && e.lineup.toLowerCase().includes(name.toLowerCase())) ||
      (e.nombre && e.nombre.toLowerCase().includes(name.toLowerCase())) ||
      (e.titulo && e.titulo.toLowerCase().includes(name.toLowerCase())) ||
      (e.artistas && Array.isArray(e.artistas) && e.artistas.some(a => String(a.nombre || a).toLowerCase().includes(name.toLowerCase())))
    );
    const creatorId = e.creador?._id || e.creador;
    return (creatorId === profile._id) || nameMatch(profile.nombreArtistico) || nameMatch(profile.nombre) || nameMatch(profile.username);
  });

  const validTabs = isProducer 
    ? ['CARTELERA', 'INFO'] 
    : isArtist 
    ? ['MÚSICA', 'PRÓXIMOS SHOWS', 'MI INFO'] 
    : ['MI INFO', 'EVENTOS GUARDADOS', 'HISTORIAL'];
  const isSocialTab = activeTab === 'SEGUIDORES' || activeTab === 'SIGUIENDO';
  const currentTab = isSocialTab ? activeTab : (validTabs.includes(activeTab) ? activeTab : validTabs[0]);

  const isFollowing = profile.seguidores?.some(
    (s) => s === user?._id || s._id === user?._id
  ) ?? false;

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/');
    }
  };

  const roleDisplay = (profile.role === 'producer' || profile.rol === 'producer')
    ? 'PRODUCTORA'
    : (profile.role === 'artist' || profile.rol === 'artist')
    ? 'ARTISTA'
    : 'FAN';

  return (
    <div className={styles.pageRoot}>
      <div className={styles.headerContainer}>
        <div className={styles.navbarOpaque}>
          <LogoVoy inverse={true} />
          
          <div className={styles.navActions}>
            {isMyProfile && (
              <Link
                to="/profile/edit"
                className={styles.editBtn}
              >
                <EditIcon size={14} /> EDITAR PERFIL
              </Link>
            )}
            {isAuthenticated && (
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                CERRAR SESIÓN
              </button>
            )}
          </div>
        </div>

        <div 
          className={styles.banner} 
          style={{ background: bannerBg, cursor: profile.bannerImagen ? "zoom-in" : "default" }} 
          onClick={() => profile.bannerImagen && setLightboxImage({ src: profile.bannerImagen, caption: `Banner de ${safeName}` })}
          title={profile.bannerImagen ? "Clic para ampliar banner en alta resolución" : ""}
        />
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <div className={styles.userInfoCol}>
            {/* Upper Row: Avatar + Name / Location / Stats to the side */}
            <div className={styles.avatarAndHeaderRow}>
              <div className={styles.avatarSquare} style={avatarStyle}>
                {(profile.avatarUrl || profile.fotoPerfil || profile.avatar) ? (
                  <img 
                    src={profile.avatarUrl || profile.fotoPerfil || profile.avatar} 
                    alt={safeName} 
                    className={styles.avatarImage} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.parentNode) {
                        const span = document.createElement('span');
                        span.style.fontSize = '2.5rem';
                        span.style.fontWeight = '900';
                        span.style.color = '#ffffff';
                        span.innerText = initial;
                        e.currentTarget.parentNode.appendChild(span);
                      }
                    }}
                    onClick={() => setLightboxImage({ src: profile.avatarUrl || profile.fotoPerfil || profile.avatar, caption: safeName })}
                    title="Clic para ampliar foto de perfil en alta resolución"
                    style={{ cursor: "zoom-in" }}
                  />
                ) : (
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff' }}>{initial}</span>
                )}

                {isAuthenticated && !isMyProfile && (
                  <FollowButton
                    userId={profile._id}
                    isFollowing={isFollowing}
                    compact={true}
                  />
                )}
              </div>
              
              <div className={styles.headerDetailsCol}>
                <div className={styles.nameBlock}>
                  <h1 className={styles.displayName}>{profile.nombreArtistico || profile.nombreProductora || profile.nombre || 'Usuario'}</h1>
                  <span className={styles.username}>{displayUsername}</span>
                  <div className={isProducer ? styles.badgeProducer : isArtist ? styles.badgeArtist : styles.badgeFan}>
                    {isProducer ? (
                      <ZapIcon size={14} />
                    ) : isArtist ? (
                      <MusicIcon size={14} />
                    ) : (
                      <TicketIcon size={14} />
                    )}
                    <span>{roleDisplay}</span>
                  </div>
                </div>

                <div className={styles.metaInlineRow}>
                  {profile.ubicacion && (
                    <>
                      <div className={styles.locationBlock}>
                        <MapPinIcon size={15} /> {profile.ubicacion}
                      </div>
                      <span className={styles.metaDivider}>|</span>
                    </>
                  )}

                  <span 
                    className={styles.statItemClickable} 
                    onClick={() => navigate(`/profile/${profile.username || username}/followers`)}
                  >
                    <strong className={styles.statNumber}>{followersCount}</strong> seguidores
                  </span>

                  <span className={styles.metaDivider}>|</span>

                  <span 
                    className={styles.statItemClickable} 
                    onClick={() => navigate(`/profile/${profile.username || username}/following`)}
                  >
                    <strong className={styles.statNumber}>{followingCount}</strong> siguiendo
                  </span>

                  <div className={styles.socialIconsGroup}>
                    {profile.redesSociales?.instagram && (
                      <a href={profile.redesSociales.instagram.startsWith('http') ? profile.redesSociales.instagram : `https://instagram.com/${profile.redesSociales.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Instagram">
                        <InstagramSVG />
                      </a>
                    )}
                    {profile.redesSociales?.spotify && (
                      <a href={profile.redesSociales.spotify} target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Spotify">
                        <SpotifySVG />
                      </a>
                    )}
                    {profile.redesSociales?.youtube && (
                      <a href={profile.redesSociales.youtube} target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Youtube">
                        <YoutubeSVG />
                      </a>
                    )}
                    {profile.redesSociales?.web && (
                      <a href={profile.redesSociales.web} target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Web">
                        <LinkSVG />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Section: Motto/Lema */}
            {profile.lema && (
              <p className={styles.bioText} style={{ fontStyle: 'italic', opacity: 0.95 }}>
                "{profile.lema}"
              </p>
            )}

            {(profile.role === 'artist' || profile.rol === 'artist') && profile.generosMusicales?.length > 0 && (
              <div className={styles.badgesRow}>
                {profile.generosMusicales.map((g) => (
                  <div key={g} className={styles.pogoBadge}>
                    {g}
                  </div>
                ))}
              </div>
            )}



          </div>
        </div>

        {/* Tabs con Iconos a la izquierda y separadores | */}
        <div className={styles.tabsContainer}>
          {validTabs.map((tab, idx) => (
            <div key={tab} className={styles.tabItemWrapper}>
              {idx > 0 && <span className={styles.tabDivider}>|</span>}
              <button
                className={`${styles.tab} ${currentTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'MÚSICA' && <MusicIcon size={16} className={styles.tabIcon} />}
                {tab === 'PRÓXIMOS SHOWS' && <CalendarIcon size={16} className={styles.tabIcon} />}
                {tab === 'MI INFO' && <StarIcon size={16} className={styles.tabIcon} />}
                {tab === 'EVENTOS GUARDADOS' && <HeartIcon size={16} className={styles.tabIcon} />}
                {tab === 'HISTORIAL' && <TicketIcon size={16} className={styles.tabIcon} />}
                {tab === 'CARTELERA' && <StarIcon size={16} className={styles.tabIcon} />}
                {tab === 'INFO' && <StarIcon size={16} className={styles.tabIcon} />}
                <span>{tab}</span>
              </button>
            </div>
          ))}
        </div>

        {currentTab === 'MÚSICA' && (
          <div className={styles.sectionBlock}>
            {(() => {
              const rawTrack = profile.redesSociales?.spotifyTrack || profile.redesSociales?.spotify || "";
              const embedUrl = getSpotifyEmbedUrl(rawTrack);

              if (!embedUrl) {
                return (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyText}>
                      Este artista aún no ha vinculado una canción, álbum o playlist de Spotify.
                    </span>
                  </div>
                );
              }

              return (
                <div className={styles.spotifyPlayerCard}>
                  <div className={styles.spotifyPlayerHeader}>
                    <SpotifySVG />
                    <span className={styles.spotifyPlayerLabel}>SOUNDTRACK PREVIEW</span>
                  </div>
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: '12px', border: 'none', width: '100%', marginTop: '6px' }}
                    title="Spotify Track Preview Player"
                  />
                </div>
              );
            })()}
          </div>
        )}

        {currentTab === 'PRÓXIMOS SHOWS' && (
          <div className={styles.sectionBlock}>
            {artistEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyText}>
                  No hay fechas confirmadas por el momento para este artista. ¡Volvé pronto para más novedades!
                </span>
              </div>
            ) : (
              <div className={styles.eventsGrid}>
                {artistEvents.map(evt => (
                  <EventCard key={evt.id} {...evt} />
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'CARTELERA' && (
          <div className={styles.sectionBlock}>
            {producerEvents.length === 0 ? (
                <div className={styles.emptyState}>
                  <TicketIcon size={32} className={styles.emptyIcon} />
                  <span className={styles.emptyText}>Esta productora aún no ha publicado eventos.</span>
                </div>
            ) : (
                <div className={styles.eventsGrid}>
                  {producerEvents.map(evt => (
                    <EventCard key={evt.id} {...evt} />
                  ))}
                </div>
            )}
          </div>
        )}

        {currentTab === 'INFO' && (
          <div className={styles.sectionBlock}>
            {profile.bio ? (
              <p className={styles.bioText}>
                {profile.bio}
              </p>
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.emptyText}>Esta productora aún no ha agregado una descripción.</span>
              </div>
            )}

            {profile.vibeEnShows && profile.vibeEnShows.length > 0 && (
              <div className={styles.badgesGroupBlock}>
                <h3 className={styles.subHeadingLabel}>VIBES</h3>
                <div className={styles.badgesFlex}>
                  {profile.vibeEnShows.map(vibe => (
                    <div key={vibe} className={styles.pogoBadge}>
                      {vibe}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profile.generosMusicales && profile.generosMusicales.length > 0 && (
               <div className={styles.badgesGroupBlock}>
                  <h3 className={styles.subHeadingLabel}>GÉNEROS MUSICALES</h3>
                  <div className={styles.badgesFlex}>
                  {profile.generosMusicales.map(g => (
                    <div key={g} className={styles.pogoBadge}>
                      {g}
                    </div>
                  ))}
                  </div>
               </div>
            )}
          </div>
        )}

        {currentTab === 'MI INFO' && (
          <div className={styles.sectionBlock}>
            {profile.bio ? (
              <p className={styles.bioText} style={{ marginBottom: '1.5rem' }}>
                {profile.bio}
              </p>
            ) : (
              <div className={styles.emptyState} style={{ padding: '1.5rem 0' }}>
                <span className={styles.emptyText}>Este usuario aún no ha agregado una biografía.</span>
              </div>
            )}

            {((profile.vibeEnShows && profile.vibeEnShows.length > 0) || (profile.vibes && profile.vibes.length > 0)) && (
              <div className={styles.badgesGroupBlock}>
                <h3 className={styles.subHeadingLabel}>MI VIBRA</h3>
                <div className={styles.badgesFlex}>
                  {(profile.vibeEnShows || profile.vibes).map(vibe => (
                    <div key={vibe} className={styles.pogoBadge}>
                      {vibe}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {((profile.generosMusicales && profile.generosMusicales.length > 0) || (profile.generos && profile.generos.length > 0)) && (
               <div className={styles.badgesGroupBlock}>
                  <h3 className={styles.subHeadingLabel}>GUSTOS MUSICALES</h3>
                  <div className={styles.badgesFlex}>
                  {(profile.generosMusicales || profile.generos).map(g => (
                    <div key={g} className={styles.pogoBadge}>
                      {g}
                    </div>
                  ))}
                  </div>
               </div>
            )}

            {profile.artistasFavoritos && (
               <div className={styles.badgesGroupBlock}>
                  <h3 className={styles.subHeadingLabel}>ARTISTAS FAVORITOS</h3>
                  <p className={styles.bioText} style={{ color: 'var(--ds-color-text-primary)', fontWeight: 700 }}>
                    {profile.artistasFavoritos}
                  </p>
               </div>
            )}

            {profile.recitalMemorable && (
               <div className={styles.badgesGroupBlock}>
                  <h3 className={styles.subHeadingLabel}>RECITAL MEMORABLE</h3>
                  <p className={styles.bioText} style={{ color: 'var(--ds-color-text-primary)', fontWeight: 700 }}>
                    {profile.recitalMemorable}
                  </p>
               </div>
            )}
          </div>
        )}

        {currentTab === 'EVENTOS GUARDADOS' && (
          <div className={styles.sectionBlock}>
            {favoriteEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  <HeartIcon size={36} className={styles.emptyIcon} />
                </div>
                <span className={styles.emptyTitle}>TUS GUARDADOS ESTÁN VACÍOS</span>
                <span className={styles.emptyText}>Explorá la cartelera y guardá tus recitales o fechas favoritas para no perderte nada.</span>
                <Link to="/events" className={styles.emptyLinkButton}>
                  EXPLORAR CARTELERA →
                </Link>
              </div>
            ) : (
              <div className={styles.eventsGrid}>
                {favoriteEvents.map(evt => (
                  <EventCard 
                    key={evt.id} 
                    {...evt}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'HISTORIAL' && (
          <div className={styles.sectionBlock}>
            <div className={styles.historyList}>
              {orders.length === 0 ? (
                <div className={styles.emptyState}>
                  <TicketIcon size={32} className={styles.emptyIcon} />
                  <span className={styles.emptyText}>Aún no tienes compras realizadas.</span>
                </div>
              ) : (
                orders.map((order, idx) => {
                  if (!order) return null;
                  const orderState = order.estadoPago || order.estado || order.status || 'PAGADA';
                  const isPagada = (orderState === 'PAGADA' || orderState === 'completado' || orderState === 'paid' || orderState === 'pagado');
                  
                  const createdDate = order.createdAt ? new Date(order.createdAt) : null;
                  const isCreatedValid = createdDate && !isNaN(createdDate.getTime());
                  const formattedCreated = isCreatedValid ? createdDate.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : 'Fecha reciente';

                  const ev = order.eventId || order.evento || {};
                  const evNombre = typeof ev === 'object' ? (ev.nombre || ev.title || 'Evento Recital') : 'Evento Recital';
                  const evLugar = typeof ev === 'object' ? (ev.lugar || ev.venue || 'Tucumán') : 'Tucumán';
                  const evDateObj = typeof ev === 'object' && ev.fecha ? new Date(ev.fecha) : null;
                  const isEvDateValid = evDateObj && !isNaN(evDateObj.getTime());
                  const formattedEvDate = isEvDateValid ? evDateObj.toLocaleDateString('es-AR') : (typeof ev === 'object' && ev.fecha ? ev.fecha : 'Por confirmar');

                  return (
                    <div key={order._id || idx} className={`${styles.orderCard} ${isPagada ? styles.orderCardPaid : ""}`}>
                      <div className={styles.orderCardHeader}>
                        <div className={styles.orderNumberBlock}>
                          <span className={styles.orderNumber}>
                            {order.numeroOrden || `#ORD-${order._id ? order._id.slice(-6).toUpperCase() : idx + 1}`}
                          </span>
                          <span className={styles.orderDate}>
                            Comprado el: {formattedCreated}
                          </span>
                        </div>
                        <span className={isPagada ? styles.orderBadgePaid : styles.orderBadgeOther}>
                          {orderState.toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className={styles.orderEventTitle}>{evNombre}</h3>
                        <p className={styles.orderEventDetails}>
                          <span>📅 Fecha del evento: {formattedEvDate}</span>
                          <span>📍 Lugar: {evLugar}</span>
                        </p>
                      </div>

                      <div className={styles.orderFooter}>
                        <div>
                          <span className={styles.orderQuantity}>
                            {order.cantidad || 1} x Entrada{order.cantidad > 1 ? 's' : ''}
                          </span>
                          <span className={styles.orderMethod}>
                            Método: {order.metodoPago || 'MercadoPago'}
                          </span>
                        </div>
                        <strong className={styles.orderTotal}>
                          ${order.total || (order.montoTotal ? order.montoTotal : '0')}
                        </strong>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {lightboxImage && (
        <ImageLightboxModal
          src={lightboxImage.src}
          caption={lightboxImage.caption}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
