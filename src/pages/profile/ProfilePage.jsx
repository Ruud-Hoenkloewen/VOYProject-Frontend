import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchEvents } from '../../services/eventService';
import { getProfileByUsername, getMyProfile, GRADIENTS } from '../../services/userService';
import { EventCard } from '../../design-system';
import { TicketIcon, HeartIcon, StarIcon, EditIcon, MapPinIcon } from '../../components/icons';
import FollowButton from '../../components/FollowButton/FollowButton';
import styles from './ProfilePage.module.css';

const InstagramSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const SpotifySVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 11.5c2.5-1.5 5.5-1.5 8 0"/>
    <path d="M9 14c2-1 4-1 6 0"/>
    <path d="M7 9c3-2 7-2 10 0"/>
  </svg>
);

const YoutubeSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const LinkSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();
  
  const [activeTab, setActiveTab] = useState('MI MOVIDA');
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // ¿Es este mi propio perfil?
  const isMyProfile = isAuthenticated && user && (
    username === 'me' || 
    username === user.username || 
    username === user._id || 
    username === user.id
  );

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        let data;
        if (isMyProfile) {
          try {
            data = await getMyProfile();
          } catch (e) {
            if (username && username !== 'me') {
              data = await getProfileByUsername(username);
            } else {
              throw e;
            }
          }
        } else {
          data = await getProfileByUsername(username);
        }
        setProfile(data);
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setProfileError("No se pudo cargar el perfil o no existe.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (username) {
      loadProfile();
    }
  }, [username, isMyProfile]);

  useEffect(() => {
    fetchEvents()
      .then(events => {
        setAllEvents(events);
        setRecommendedEvents(events.slice(0, 4));
      })
      .catch(console.error);
  }, []);

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
    return (
      <div className={styles.pageRoot} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2>Cargando perfil...</h2>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className={styles.pageRoot} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2>{profileError || "Perfil no encontrado"}</h2>
        <Link to="/" style={{ color: 'var(--ds-color-accent-primary)' }}>Volver al inicio</Link>
      </div>
    );
  }

  const safeName = profile.nombre || profile.username || 'Usuario';
  const initial = safeName.charAt(0).toUpperCase();
  const displayUsername = profile.username ? `@${profile.username}` : `@${safeName.toLowerCase().replace(/\s/g, '')}`;
  const avatarColor = profile.avatarColor || 'var(--ds-color-accent-primary, #C6F92B)';
  const bannerGradient = profile.bannerGradiente ? GRADIENTS[profile.bannerGradiente] : 'linear-gradient(90deg, #C6F92B 0%, #A044FF 100%)';
  
  const followersCount = profile.seguidores?.length || 0;
  const followingCount = profile.siguiendo?.length || 0;

  // ¿El usuario logueado ya sigue a este perfil?
  const isFollowing = profile.seguidores?.some(
    (s) => s === user?._id || s._id === user?._id
  ) ?? false;

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles.headerContainer}>
        <div className={styles.navbarOpaque}>
          <Link to="/" className={styles.brandTextOnly}>
            VOY PROJECT
          </Link>
          
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

        <div className={styles.banner} style={{ background: bannerGradient }} />
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <div className={styles.userInfoCol}>
            <div className={styles.avatarSquare} style={{ backgroundColor: avatarColor }}>
              {initial}
            </div>
            
            <div className={styles.nameBlock}>
              <h1 className={styles.displayName}>{profile.nombreArtistico || profile.nombreProductora || profile.nombre || 'Usuario'}</h1>
              <span className={styles.username}>{displayUsername}</span>
            </div>

            {profile.ubicacion && (
              <div style={{ color: 'var(--ds-color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <MapPinIcon size={14} /> {profile.ubicacion}
              </div>
            )}
            
            {profile.bio && (
              <p style={{ maxWidth: '400px', fontSize: '14px', lineHeight: '1.5', marginTop: '8px' }}>
                {profile.bio}
              </p>
            )}

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
              <div className={styles.badgeFan}>
                <TicketIcon size={14} /> {profile.rol ? profile.rol.toUpperCase() : 'FAN'}
              </div>
              {profile.rol === 'artista' && profile.generosMusicales?.map((g) => (
                <div key={g} className={styles.pogoBadge} style={{ border: '1px solid var(--ds-color-text-secondary)', color: 'var(--ds-color-text-primary)' }}>
                  {g}
                </div>
              ))}
            </div>

            <div className={styles.userStatsRow}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '14px' }}><strong className={styles.statNumber}>{followersCount}</strong> seguidores</span>
                <span style={{ fontSize: '14px' }}><strong className={styles.statNumber}>{followingCount}</strong> siguiendo</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
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
            
            {/* Action Button: Editar Perfil vs FollowButton */}
            <div style={{ marginTop: '16px' }}>
              {!isMyProfile && (
                <FollowButton
                  userId={profile._id}
                  isFollowing={isFollowing}
                />
              )}
            </div>

          </div>

          <div className={styles.statsBoxes}>
            <div className={styles.statBox}>
              <span className={`${styles.statBoxVal} ${styles.valSaved}`}>{profile.favoritos?.length || 0}</span>
              <span className={styles.statBoxLabel}>EVENTOS<br/>GUARDADOS</span>
            </div>
            <div className={styles.statBox}>
              <span className={`${styles.statBoxVal} ${styles.valGenres}`}>{profile.generosFavoritos?.length || 1}</span>
              <span className={styles.statBoxLabel}>GÉNEROS<br/>FAVORITOS</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          {['MI MOVIDA', 'GUSTOS', 'HISTORIAL'].map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'MI MOVIDA' && (
          <>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <HeartIcon size={16} className={styles.sectionIcon} />
                  EVENTOS GUARDADOS
                </h2>
                <Link to="/events" className={styles.exploreLink}>Explorar &gt;</Link>
              </div>

              {favoriteEvents.length === 0 ? (
                <div className={styles.emptyState}>
                  <HeartIcon size={32} className={styles.emptyIcon} />
                  <span className={styles.emptyText}>Todavía no hay eventos guardados.</span>
                  <Link to="/events" className={styles.emptyLink}>Explorar cartelera &rarr;</Link>
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

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <StarIcon size={16} className={styles.sectionIcon} />
                  PARA VOS
                </h2>
              </div>
              
              <div className={styles.eventsGrid}>
                {recommendedEvents.map(evt => (
                  <EventCard 
                    key={evt.id} 
                    {...evt}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'GUSTOS' && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>GUSTOS Y VIBES</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              {profile.vibeEnShows && profile.vibeEnShows.length > 0 ? (
                profile.vibeEnShows.map(vibe => (
                  <div key={vibe} className={styles.pogoBadge} style={{ border: '1px solid var(--ds-color-text-secondary)', color: 'var(--ds-color-text-primary)' }}>
                    {vibe}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState} style={{ width: '100%' }}>
                  <span className={styles.emptyText}>No configuraste tus gustos musicales todavía.</span>
                  {isMyProfile && <Link to="/profile/edit" className={styles.emptyLink}>Editar Perfil &rarr;</Link>}
                </div>
              )}
            </div>
            {profile.generosMusicales && profile.generosMusicales.length > 0 && (
               <div style={{marginTop: '24px'}}>
                  <h3 style={{fontSize: '12px', marginBottom: '12px', color: 'var(--ds-color-text-secondary)', letterSpacing: '0.1em', fontWeight: 800}}>GÉNEROS</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profile.generosMusicales.map(g => (
                    <div key={g} className={styles.pogoBadge} style={{ border: '1px solid var(--ds-color-text-secondary)', color: 'var(--ds-color-text-primary)' }}>
                      {g}
                    </div>
                  ))}
                  </div>
               </div>
            )}
          </div>
        )}

        {activeTab === 'HISTORIAL' && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>HISTORIAL DE COMPRAS</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              {orders.length === 0 ? (
                <div className={styles.emptyState}>
                  <TicketIcon size={32} className={styles.emptyIcon} />
                  <span className={styles.emptyText}>Aún no tienes compras realizadas.</span>
                </div>
              ) : (
                orders.map(order => {
                  const isPagada = order.estadoPago === 'PAGADA';
                  const badgeBg = isPagada ? '#C6F92B' : (order.estadoPago === 'RECHAZADA' ? '#FF4444' : '#FFAA00');
                  const badgeColor = '#000';
                  
                  return (
                    <div key={order._id} style={{ 
                      background: 'var(--ds-color-bg-surface)', 
                      border: `1px solid ${isPagada ? 'var(--ds-color-accent-primary)' : 'var(--ds-color-border-editorial)'}`, 
                      padding: '20px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '16px',
                      borderRadius: '8px'
                    }}>
                      {/* Fila superior: ID y Estado */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--ds-color-border-editorial-mid)', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '12px', fontFamily: 'var(--ds-font-family-mono)', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>
                            {order.numeroOrden}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)' }}>
                            Comprado el: {new Date(order.createdAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                        <span style={{ 
                          fontSize: '11px', fontWeight: 800, padding: '6px 12px', borderRadius: '20px', letterSpacing: '0.05em',
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          boxShadow: isPagada ? '0 0 10px rgba(198, 249, 43, 0.4)' : 'none'
                        }}>
                          {order.estadoPago}
                        </span>
                      </div>
                      
                      {/* Detalles del Evento */}
                      <div>
                        <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>{order.eventId?.nombre || 'Evento Desconocido'}</h3>
                        <p style={{ fontSize: '14px', margin: 0, color: 'var(--ds-color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span>📅 Fecha del evento: {order.eventId?.fecha ? new Date(order.eventId.fecha).toLocaleDateString() : 'Por confirmar'}</span>
                          <span>📍 Lugar: {order.eventId?.lugar || 'Por confirmar'}</span>
                        </p>
                      </div>

                      {/* Resumen de la compra */}
                      <div style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        paddingTop: '16px', borderTop: '1px dotted var(--ds-color-border-editorial-mid)' 
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '14px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>
                            {order.cantidad} x Entrada{order.cantidad > 1 ? 's' : ''}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', textTransform: 'uppercase' }}>
                            Método: {order.metodoPago || 'No especificado'}
                          </span>
                        </div>
                        <strong style={{ fontSize: '24px', color: 'var(--ds-color-text-primary)' }}>
                          ${order.total}
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
