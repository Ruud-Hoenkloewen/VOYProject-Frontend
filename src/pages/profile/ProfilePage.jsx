import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfileByUsername } from "../../services/userService";
import {
  Button,
  Typography,
  Badge,
  Chip,
  Card,
  Stack,
  Container,
  Divider,
  Navbar
} from "../../design-system";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import {
  MapPinIcon,
  HeartIcon,
  UsersIcon,
  ZapIcon,
  StarIcon,
  WarningIcon,
  EditIcon
} from "../../components/icons";
import styles from "./ProfilePage.module.css";

// SVG Locales para redes sociales que no están en icons.jsx
const InstagramSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
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
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("movida");

  // Determinar si es el perfil del propio usuario logueado
  const isOwnProfile = isAuthenticated && user && 
    (user.nombre?.toLowerCase().replace(/\s+/g, '') === username?.toLowerCase().trim() ||
     user.username?.toLowerCase() === username?.toLowerCase().trim());

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfileByUsername(username);
      if (data) {
        setProfile(data);
      } else {
        setError("Usuario no encontrado");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Error de red o servidor");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username, fetchProfile]);

  // Redirección si se hace click en editar perfil
  const handleEditProfile = () => {
    alert("Función para editar perfil disponible en la próxima entrega.");
  };

  // Renderizar ícono de red social según la plataforma
  const renderSocialIcon = (plataforma) => {
    switch (plataforma.toLowerCase()) {
      case 'instagram':
        return <InstagramSVG />;
      case 'twitter':
      case 'x':
        return <TwitterSVG />;
      case 'spotify':
        return <SpotifySVG />;
      case 'youtube':
        return <YoutubeSVG />;
      default:
        return <LinkSVG />;
    }
  };

  // ─── Loading Skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.root}>
        <EditorialHeader />
        <div className={styles.skeletonBanner} />
        <Container className={styles.container}>
          <div className={styles.headerBlock}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonInfo}>
              <div className={styles.skeletonText} style={{ width: "200px", height: "32px" }} />
              <div className={styles.skeletonText} style={{ width: "120px", height: "18px", marginTop: "8px" }} />
              <div className={styles.skeletonText} style={{ width: "350px", height: "16px", marginTop: "16px" }} />
            </div>
          </div>
          <Divider className={styles.divider} />
          <div className={styles.skeletonBody} />
        </Container>
      </div>
    );
  }

  // ─── Error State (404 / General) ───────────────────────────────────────────
  if (error || !profile) {
    return (
      <div className={styles.root}>
        <EditorialHeader />
        <div className={styles.errorState}>
          <Typography variant="display" className={styles.errorTitle}>404</Typography>
          <Typography variant="h2" className={styles.errorSubtitle}>{error || "Perfil no encontrado"}</Typography>
          <Typography variant="body" tone="muted" className={styles.errorDesc}>
            El usuario @{username} no existe o no tiene un perfil configurado en VOY.
          </Typography>
          <Button onClick={() => navigate("/events")} variant="primary">
            Explorar eventos
          </Button>
        </div>
      </div>
    );
  }

  // Fallback de banner gradiente (diseño oscuro elegante)
  const bannerBackground = profile.bannerGradiente || "linear-gradient(135deg, var(--ds-color-neutral-200) 0%, var(--ds-color-neutral-300) 100%)";
  const initials = profile.nombre ? profile.nombre.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase();

  return (
    <div className={styles.root}>
      {/* HEADER PRINCIPAL */}
      <EditorialHeader />

      {/* BANNER SUPERIOR CON GRADIENTE */}
      <div 
        className={styles.banner} 
        style={{ background: bannerBackground }}
        aria-label="Banner del perfil"
      />

      <Container className={styles.container}>
        {/* CABECERA DEL PERFIL: AVATAR Y DETALLES */}
        <div className={styles.profileHeader}>
          <div className={styles.headerMain}>
            
            {/* AVATAR COLOR CON INICIAL */}
            <div 
              className={styles.avatar}
              style={{ backgroundColor: profile.avatarColor || "var(--ds-color-neutral-300)" }}
            >
              <span className={styles.avatarInitial}>{initials}</span>
            </div>

            {/* INFORMACIÓN DEL USUARIO */}
            <div className={styles.userInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.nombre}>{profile.nombre}</h1>
                
                {/* ROL BADGE */}
                <span className={`${styles.roleBadge} ${styles[`roleBadge_${profile.rol}`]}`}>
                  {profile.rol.toUpperCase()}
                </span>
              </div>
              
              <p className={styles.username}>@{profile.username}</p>

              {/* BIO */}
              <p className={styles.bio}>{profile.bio}</p>

              {/* METADATOS: Ubicación y Redes */}
              <div className={styles.metaRow}>
                {profile.ubicacion && (
                  <div className={styles.location}>
                    <MapPinIcon size={14} className={styles.locationIcon} />
                    <span>{profile.ubicacion}</span>
                  </div>
                )}

                {profile.redes && profile.redes.length > 0 && (
                  <div className={styles.socials}>
                    {profile.redes.map((red, idx) => (
                      <a 
                        key={idx} 
                        href={red.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        title={`Visitar ${red.plataforma}`}
                      >
                        {renderSocialIcon(red.plataforma)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* BOTÓN DE ACCIÓN (EDITAR PERFIL O ESPACIO PARA FOLLOW) */}
          <div className={styles.actionColumn}>
            {isOwnProfile ? (
              <Button 
                variant="secondary" 
                onClick={handleEditProfile} 
                className={styles.editBtn}
              >
                <EditIcon size={16} />
                <span>EDITAR PERFIL</span>
              </Button>
            ) : (
              /* Espacio reservado para el FollowButton (US-005B) */
              <div className={styles.followButtonPlaceholder} title="Espacio para botón Seguir (US-005B)">
                <UsersIcon size={16} className={styles.followIcon} />
                <span>SEGUIR</span>
                <span className={styles.placeholderTag}>MOCK</span>
              </div>
            )}
          </div>
        </div>

        {/* DETALLE ARTISTA / PRODUCTOR SI APLICA */}
        {(profile.rol === 'artista' || profile.rol === 'productor') && (
          <div className={styles.professionalSection}>
            {profile.rol === 'artista' && (
              <Card className={styles.profCard}>
                <Typography variant="caption" className={styles.profCardEyebrow}>◆ INFORMACIÓN ARTÍSTICA</Typography>
                <div className={styles.profCardContent}>
                  <div className={styles.profItem}>
                    <Typography variant="body" tone="muted">Nombre Artístico</Typography>
                    <Typography variant="h3" className={styles.profValue}>{profile.nombreArtistico || profile.nombre}</Typography>
                  </div>
                  {profile.generos && profile.generos.length > 0 && (
                    <div className={styles.profItem}>
                      <Typography variant="body" tone="muted" style={{ marginBottom: "6px" }}>Géneros</Typography>
                      <div className={styles.genreChips}>
                        {profile.generos.map((gen) => (
                          <Chip key={gen} active={true}>{gen}</Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {profile.rol === 'productor' && (
              <Card className={styles.profCard}>
                <Typography variant="caption" className={styles.profCardEyebrow}>◆ DETALLES DE PRODUCTORA</Typography>
                <div className={styles.profCardContent}>
                  <div className={styles.profItem}>
                    <Typography variant="body" tone="muted">Productora</Typography>
                    <Typography variant="h3" className={styles.profValue}>{profile.nombreProductora || profile.nombre}</Typography>
                  </div>
                  <div className={styles.profItem}>
                    <Typography variant="body" tone="muted">Enfoque</Typography>
                    <Typography variant="body">Organización de shows, logística y difusión de la escena local.</Typography>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* SECCIÓN DE TABS E INFORMACIÓN COMPLEMENTARIA */}
        <div className={styles.mainLayout}>
          
          {/* COLUMNA IZQUIERDA: PESTAÑAS Y CONTENIDOS */}
          <div className={styles.tabsColumn}>
            
            {/* TABS SELECTOR */}
            <div className={styles.tabsNav} role="tablist">
              {[
                { id: "movida", label: "MI MOVIDA" },
                { id: "gustos", label: "GUSTOS" },
                { id: "historial", label: "HISTORIAL" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className={styles.tabContent}>
              
              {/* PESTAÑA: MI MOVIDA */}
              {activeTab === "movida" && (
                <div className={styles.tabPanel}>
                  
                  {/* Eventos Guardados */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <span className={styles.sectionIconMagenta}><HeartIcon size={18} /></span>
                      <h3 className={styles.sectionTitleText}>EVENTOS GUARDADOS</h3>
                      <Link to="/events" className={styles.exploreLink}>Explorar ›</Link>
                    </div>

                    {/* Estado Vacío */}
                    <div className={styles.emptyStateBox}>
                      <HeartIcon size={32} className={styles.emptyIcon} />
                      <p className={styles.emptyText}>Todavía no guardaste ningún evento.</p>
                      <Link to="/events" className={styles.emptyCtaLink}>
                        Explorar cartelera →
                      </Link>
                    </div>
                  </div>

                  {/* Recomendador: PARA VOS */}
                  <div className={styles.sectionBlock}>
                    <div className={styles.sectionLabelRow}>
                      <span className={styles.sectionIconLime}><StarIcon size={18} /></span>
                      <h3 className={styles.sectionTitleText}>PARA VOS</h3>
                    </div>
                    <div className={styles.recommendationsText}>
                      Seleccioná géneros en tu perfil para ver recomendaciones.
                    </div>
                  </div>

                </div>
              )}

              {/* PESTAÑA: GUSTOS */}
              {activeTab === "gustos" && (
                <div className={styles.tabPanel}>
                  <div className={styles.emptyTabState}>
                    <ZapIcon size={24} className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No hay géneros o gustos seleccionados aún.</p>
                    {isOwnProfile && (
                      <Button variant="secondary" size="sm" onClick={handleEditProfile} style={{ marginTop: "12px" }}>
                        Elegir mis géneros
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* PESTAÑA: HISTORIAL */}
              {activeTab === "historial" && (
                <div className={styles.tabPanel}>
                  <div className={styles.emptyTabState}>
                    <WarningIcon size={24} className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No has asistido a ningún show registrado en la plataforma.</p>
                    <Link to="/events" className={styles.emptyCtaLink} style={{ marginTop: "8px" }}>
                      ¡Buscá tu próximo show!
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* COLUMNA DERECHA: TARJETAS DE CONTADORES */}
          <div className={styles.sidebarColumn}>
            
            {/* STATS CONTADORES */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>
                  {profile.seguidoresCount >= 1000000 
                    ? `${(profile.seguidoresCount / 1000000).toFixed(1)}M` 
                    : profile.seguidoresCount >= 1000 
                    ? `${(profile.seguidoresCount / 1000).toFixed(1)}K` 
                    : profile.seguidoresCount}
                </span>
                <span className={styles.statLabel}>SEGUIDORES</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statNumber}>
                  {profile.siguiendoCount >= 1000 
                    ? `${(profile.siguiendoCount / 1000).toFixed(1)}K` 
                    : profile.siguiendoCount}
                </span>
                <span className={styles.statLabel}>SIGUIENDO</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statNumber}>{profile.eventosGuardados ?? 0}</span>
                <span className={styles.statLabel}>EVENTOS GUARDADOS</span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statNumber}>
                  {profile.rol === 'artista' && profile.generos ? profile.generos.length : (profile.generosFavoritos ?? 0)}
                </span>
                <span className={styles.statLabel}>GÉNEROS FAVORITOS</span>
              </div>
            </div>

          </div>

        </div>

      </Container>
    </div>
  );
}
