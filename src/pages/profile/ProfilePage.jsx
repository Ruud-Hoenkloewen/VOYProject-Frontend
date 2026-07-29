import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchEvents } from '../../services/eventService';
import { getProfileByUsername, getMyProfile, GRADIENTS } from '../../services/userService';
import { EventCard } from '../../design-system';
import { TicketIcon, HeartIcon, StarIcon, EditIcon, MapPinIcon, ZapIcon, MusicIcon } from '../../components/icons';
import FollowButton from '../../components/FollowButton/FollowButton';
import LogoVoy from '../../components/LogoVoy/LogoVoy';
import styles from './ProfilePage.module.css';

const InstagramSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const SpotifySVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 11.5c2.5-1.5 5.5-1.5 8 0"/>
    <path d="M9 14c2-1 4-1 6 0"/>
    <path d="M7 9c3-2 7-2 10 0"/>
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
  
  const [activeTab, setActiveTab] = useState('MI MOVIDA');
  const [allEvents, setAllEvents] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (tabParam) {
      const upperTab = tabParam.toUpperCase();
      if (['MI MOVIDA', 'GUSTOS', 'HISTORIAL', 'CARTELERA', 'INFO'].includes(upperTab)) {
        setActiveTab(upperTab);
      }
    }
  }, [tabParam]);
  
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

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
  const avatarColor = profile.avatarColor || 'transparent';
  const hasAvatarColor = avatarColor !== 'transparent' && avatarColor !== 'none';
  const avatarStyle = hasAvatarColor
    ? { background: avatarColor, padding: '3px' }
    : { background: 'transparent', padding: 0 };
  const bannerBg = profile.bannerImagen
    ? `url("${profile.bannerImagen}") center/cover no-repeat`
    : (GRADIENTS[profile.bannerGradiente] || profile.bannerGradiente || profile.bannerColor || GRADIENTS.g1);
  
  const followersCount = profile.seguidores?.length || 0;
  const followingCount = profile.siguiendo?.length || 0;

  const isProducer = profile.role === 'producer' || profile.rol === 'producer' || profile.isVerifiedProducer;
  const isArtist = profile.role === 'artist' || profile.rol === 'artist';
  const producerEvents = allEvents.filter(e => {
    const creatorId = e.creador?._id || e.creador;
    return creatorId === profile._id;
  });

  const validTabs = isProducer ? ['CARTELERA', 'INFO'] : ['MI MOVIDA', 'GUSTOS', 'HISTORIAL'];
  const currentTab = validTabs.includes(activeTab) ? activeTab : validTabs[0];

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

        <div className={styles.banner} style={{ background: bannerBg }} />
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
                  />
                ) : (
                  initial
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

                  <span className={styles.statItemClickable}>
                    <strong className={styles.statNumber}>{followersCount}</strong> seguidores
                  </span>

                  <span className={styles.metaDivider}>|</span>

                  <span className={styles.statItemClickable}>
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
                
                {!isMyProfile && (
                  <div className={styles.followWrapper}>
                    <FollowButton
                      userId={profile._id}
                      isFollowing={isFollowing}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Lower Section: Bio & Profile Tag/Badges */}
            {profile.bio && (
              <p className={styles.bioText}>
                {profile.bio}
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

          <div className={styles.statsBoxes}>
            <div className={styles.statBox}>
              <span className={`${styles.statBoxVal} ${styles.valSaved}`}>
                {isProducer ? producerEvents.length : (profile.favoritos?.length || 0)}
              </span>
              <span className={styles.statBoxLabel}>
                {isProducer ? <>SHOWS<br/>PUBLICADOS</> : <>EVENTOS<br/>GUARDADOS</>}
              </span>
            </div>
            {!isProducer && (
              <div className={styles.statBox}>
                <span className={`${styles.statBoxVal} ${styles.valGenres}`}>{profile.generosFavoritos?.length || profile.generosMusicales?.length || 1}</span>
                <span className={styles.statBoxLabel}>GÉNEROS<br/>FAVORITOS</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          {validTabs.map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${currentTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {currentTab === 'CARTELERA' && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <StarIcon size={18} className={styles.sectionIcon} />
                NUESTROS EVENTOS
              </h2>
            </div>
            
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
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <StarIcon size={18} className={styles.sectionIcon} />
                SOBRE NOSOTROS
              </h2>
            </div>
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

        {currentTab === 'MI MOVIDA' && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <HeartIcon size={18} className={styles.sectionIcon} />
                EVENTOS GUARDADOS
              </h2>
            </div>

            {favoriteEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  <HeartIcon size={36} className={styles.emptyIcon} />
                </div>
                <span className={styles.emptyTitle}>Tus guardados están vacíos</span>
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

        {currentTab === 'GUSTOS' && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <ZapIcon size={18} className={styles.sectionIcon} />
                GUSTOS Y VIBES
              </h2>
            </div>
            {profile.vibeEnShows && profile.vibeEnShows.length > 0 ? (
              <div className={styles.badgesFlex}>
                {profile.vibeEnShows.map(vibe => (
                  <div key={vibe} className={styles.pogoBadge}>
                    {vibe}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  <ZapIcon size={36} className={styles.emptyIcon} />
                </div>
                <span className={styles.emptyTitle}>Tus gustos no están configurados</span>
                <span className={styles.emptyText}>Personalizá tus géneros y vibes favoritas para recibir mejores recomendaciones.</span>
                {isMyProfile && (
                  <Link to="/profile/edit" className={styles.emptyLinkButton}>
                    EDITAR PERFIL →
                  </Link>
                )}
              </div>
            )}
             {profile.generosMusicales && profile.generosMusicales.length > 0 && (
               <div className={styles.badgesGroupBlock}>
                  <h3 className={styles.subHeadingLabel}>GÉNEROS</h3>
                  <div className={styles.badgesFlex}>
                  {profile.generosMusicales.map(g => (
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
          </div>
        )}

        {currentTab === 'HISTORIAL' && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <TicketIcon size={18} className={styles.sectionIcon} />
                HISTORIAL DE COMPRAS
              </h2>
            </div>
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
    </div>
  );
}
