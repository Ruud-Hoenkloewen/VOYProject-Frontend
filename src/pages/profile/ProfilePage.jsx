import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchEvents } from '../../services/eventService';
import { getProfileByUsername, getMyProfile } from '../../services/userService';
import { EventCard } from '../../design-system';
import { TicketIcon, HeartIcon, FlameIcon, StarIcon, EditIcon, MapPinIcon } from '../../components/icons';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();
  
  const [activeTab, setActiveTab] = useState('MI MOVIDA');
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  
  // Perfil público actual que estamos viendo
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
          // Si estamos viendo nuestro perfil, intentamos traer /me para tener toda la info
          try {
            data = await getMyProfile();
          } catch (e) {
            // Fallback si /me falla, intentar por username si lo tenemos
            if (username && username !== 'me') {
              data = await getProfileByUsername(username);
            } else {
              throw e;
            }
          }
        } else {
          // Viendo el perfil de otra persona
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
    // Fetch some events for "PARA VOS" o similar
    fetchEvents()
      .then(events => {
        setRecommendedEvents(events.slice(0, 1));
      })
      .catch(console.error);
  }, []);

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

  // Parsear datos de forma segura
  const safeName = profile.nombre || profile.username || 'Usuario';
  const initial = safeName.charAt(0).toUpperCase();
  const displayUsername = profile.username ? `@${profile.username}` : `@${safeName.toLowerCase().replace(/\s/g, '')}`;
  const avatarColor = profile.avatarColor || 'var(--ds-color-accent-primary, #C6F92B)';
  const bannerGradient = profile.bannerGradiente || 'linear-gradient(90deg, #C6F92B 0%, #A044FF 100%)';
  
  // Métricas
  const followersCount = profile.seguidores?.length || 0;
  const followingCount = profile.siguiendo?.length || 0;

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles.headerContainer}>
        {/* Header Opaco */}
        <div className={styles.navbarOpaque}>
          <Link to="/" className={styles.brandTextOnly}>
            VOY PROJECT
          </Link>
          
          <div className={styles.navActions}>
            <Link to="/events" className={styles.navLink}>CARTELERA</Link>
            
            {isAuthenticated && (
              <button className={styles.logoutIconBtn} onClick={handleLogout} aria-label="Cerrar sesión">
                <span style={{ fontSize: '20px' }}>&rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Banner con gradiente debajo del header */}
        <div className={styles.banner} style={{ background: bannerGradient }} />
      </div>

      <div className={styles.profileContent}>
        {/* Header Profile Info */}
        <div className={styles.profileHeader}>
          <div className={styles.userInfoCol}>
            <div className={styles.avatarSquare} style={{ backgroundColor: avatarColor }}>
              {initial}
            </div>
            
            <div className={styles.nameBlock}>
              <h1 className={styles.displayName}>{profile.nombreArtistico || profile.nombreProductora || profile.nombre || 'Usuario'}</h1>
              <span className={styles.username}>{displayUsername}</span>
            </div>

            {/* Ubicación y Bio */}
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

            {/* Badges y Rol */}
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

            {/* Stats (Seguidores / Redes) */}
            <div className={styles.userStatsRow}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '14px' }}><strong className={styles.statNumber}>{followersCount}</strong> seguidores</span>
                <span style={{ fontSize: '14px' }}><strong className={styles.statNumber}>{followingCount}</strong> siguiendo</span>
              </div>

              {profile.redesSociales?.instagram && (
                <a 
                  href={profile.redesSociales.instagram.startsWith('http') ? profile.redesSociales.instagram : `https://instagram.com/${profile.redesSociales.instagram.replace('@','')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className={styles.socialBtn}
                >
                  <span style={{ fontSize: '14px' }}>&#64;</span>
                  {profile.redesSociales.instagram.replace('@','')}
                </a>
              )}
            </div>
            
            {/* Action Button: Editar Perfil vs Seguir */}
            <div style={{ marginTop: '16px' }}>
              {isMyProfile ? (
                <button className={styles.editBtn} style={{ background: 'var(--ds-color-border)', border: 'none' }}>
                  <EditIcon size={14} /> EDITAR PERFIL
                </button>
              ) : (
                <button className={styles.editBtn} style={{ background: 'var(--ds-color-accent-primary)', color: '#000', border: 'none', fontWeight: 'bold' }}>
                  <HeartIcon size={14} /> SEGUIR
                </button>
              )}
            </div>

          </div>

          {/* Stats Boxes a la derecha (pueden ser dinámicas en el futuro) */}
          <div className={styles.statsBoxes}>
            <div className={styles.statBox}>
              <span className={`${styles.statBoxVal} ${styles.valSaved}`}>{profile.eventosGuardados?.length || 0}</span>
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

        {/* Contenido de la Tab Activa */}
        {activeTab === 'MI MOVIDA' && (
          <>
            {/* Eventos Guardados */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <HeartIcon size={16} className={styles.sectionIcon} />
                  EVENTOS GUARDADOS
                </h2>
                <Link to="/events" className={styles.exploreLink}>Explorar &gt;</Link>
              </div>

              {/* Empty state porque en Figma dice "0 EVENTOS GUARDADOS" */}
              <div className={styles.emptyState}>
                <HeartIcon size={32} className={styles.emptyIcon} />
                <span className={styles.emptyText}>Todavía no hay eventos guardados.</span>
                <Link to="/events" className={styles.emptyLink}>Explorar cartelera &rarr;</Link>
              </div>
            </div>

            {/* Para Vos */}
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
                    id={evt.id}
                    title={evt.title}
                    date={evt.date}
                    time={evt.time}
                    venue={evt.venue}
                    price={evt.price}
                    genres={evt.genres}
                    status={evt.status}
                    statusTone={evt.statusTone}
                    imageUrl={evt.imageUrl}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
