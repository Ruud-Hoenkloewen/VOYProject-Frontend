import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, getCommunityUsers, GRADIENTS } from '../../services/userService';
import EditorialHeader from '../../design-system/composites/EditorialHeader/EditorialHeader';
import FollowButton from '../../components/FollowButton/FollowButton';
import { MusicIcon, TicketIcon, ZapIcon } from '../../components/icons';
import styles from './CommunityPage.module.css';

function SearchSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function CommunityPage() {
  const { user: authUser } = useAuth();
  const [myProfile, setMyProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ARTISTS' | 'PEOPLE'

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [meData, communityData] = await Promise.all([
          getMyProfile().catch(() => null),
          getCommunityUsers().catch(() => []),
        ]);
        setMyProfile(meData);
        setUsers(communityData);
      } catch (err) {
        console.error('Error al cargar la comunidad:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const myGenres = myProfile?.generosMusicales || authUser?.generosMusicales || [];

  // Función para calcular géneros en común y puntuación de afinidad
  function calculateAffinity(targetUser) {
    const targetGenres = targetUser.generosMusicales || [];
    if (myGenres.length === 0 || targetGenres.length === 0) {
      return { score: 0, matches: [] };
    }
    const matches = targetGenres.filter((g) =>
      myGenres.some((mg) => mg.toLowerCase() === g.toLowerCase())
    );
    return { score: matches.length, matches };
  }

  // Filtrado y ordenamiento de usuarios
  const otherUsers = users.filter(
    (u) => u._id !== authUser?._id && u.username !== authUser?.username
  );

  const processedUsers = otherUsers.map((u) => {
    const { score, matches } = calculateAffinity(u);
    return { ...u, affinityScore: score, sharedGenres: matches };
  });

  // Filtrado por búsqueda
  const filteredUsers = processedUsers.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = u.nombre?.toLowerCase().includes(q);
    const usernameMatch = u.username?.toLowerCase().includes(q);
    const bioMatch = u.bio?.toLowerCase().includes(q);
    const genreMatch = u.generosMusicales?.some((g) => g.toLowerCase().includes(q));
    return nameMatch || usernameMatch || bioMatch || genreMatch;
  });

  // Separación en Artistas y Gente, ordenados por afinidad (mayor coincidencia primero)
  const artists = filteredUsers
    .filter((u) => u.role === 'artist' || u.rol === 'artist' || u.rol === 'artista')
    .sort((a, b) => b.affinityScore - a.affinityScore);

  const people = filteredUsers
    .filter((u) => u.role !== 'artist' && u.rol !== 'artist' && u.rol !== 'artista' && u.role !== 'producer' && u.rol !== 'producer')
    .sort((a, b) => b.affinityScore - a.affinityScore);

  const followingIds = myProfile?.siguiendo || authUser?.siguiendo || [];

  return (
    <div className={styles.pageRoot}>
      <EditorialHeader />

      <main className={styles.mainContainer}>
        {/* Hero Banner */}
        <section className={styles.heroSection}>
          <div className={styles.heroGlow} />
          <h1 className={styles.heroTitle}>COMUNIDAD VOY</h1>
          <p className={styles.heroSubtitle}>
            Descubrí artistas y personas del under que comparten tu misma vibra y gustos musicales.
          </p>

          <div className={styles.tastesBox}>
            <div className={styles.tastesInfo}>
              <span className={styles.tastesLabel}>
                <ZapIcon size={16} /> TUS GUSTOS:
              </span>
              {myGenres.length > 0 ? (
                <div className={styles.tastesChips}>
                  {myGenres.map((g) => (
                    <span key={g} className={styles.userTasteChip}>
                      {g}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#a0a5b5' }}>
                  Aún no agregaste géneros a tu perfil.
                </span>
              )}
            </div>
            <Link to="/profile/edit" className={styles.editTasteBtn}>
              {myGenres.length > 0 ? 'EDITAR MIS GUSTOS' : 'AGREGAR GUSTOS →'}
            </Link>
          </div>
        </section>

        {/* Toolbar: Buscar y Pestañas */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <SearchSVG />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar por artista, usuario o género musical..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.categoryTabs}>
            <button
              className={`${styles.categoryTab} ${activeTab === 'ALL' ? styles.categoryTabActive : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              TODOS ({artists.length + people.length})
            </button>
            <button
              className={`${styles.categoryTab} ${activeTab === 'ARTISTS' ? styles.categoryTabActive : ''}`}
              onClick={() => setActiveTab('ARTISTS')}
            >
              ARTISTAS ({artists.length})
            </button>
            <button
              className={`${styles.categoryTab} ${activeTab === 'PEOPLE' ? styles.categoryTabActive : ''}`}
              onClick={() => setActiveTab('PEOPLE')}
            >
              GENTE ({people.length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.emptyState}>Cargando la comunidad...</div>
        ) : (
          <>
            {/* Sección: ARTISTAS SEGÚN TUS GUSTOS */}
            {(activeTab === 'ALL' || activeTab === 'ARTISTS') && (
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <MusicIcon size={22} className={styles.sectionTitleIcon} />
                    ARTISTAS SEGÚN TUS GUSTOS
                  </h2>
                  {myGenres.length > 0 && (
                    <span className={styles.matchBadgeTitle}>
                      Basado en tus {myGenres.length} géneros
                    </span>
                  )}
                </div>

                {artists.length === 0 ? (
                  <div className={styles.emptyState}>
                    No se encontraron artistas que coincidan con los criterios.
                  </div>
                ) : (
                  <div className={styles.cardsGrid}>
                    {artists.map((artist) => {
                      const isFollowing = followingIds.some(
                        (fid) => fid === artist._id || fid._id === artist._id
                      );
                      const safeName = artist.nombre || artist.username || 'Artista';
                      const initial = safeName.charAt(0).toUpperCase();
                      const avatarColor = artist.avatarColor || 'transparent';
                      const avatarStyle = avatarColor !== 'transparent'
                        ? { background: avatarColor, padding: '2px' }
                        : { background: '#1a1d29' };
                      const bannerBg = artist.bannerImagen
                        ? `url("${artist.bannerImagen}") center/cover no-repeat`
                        : (GRADIENTS[artist.bannerGradiente] || artist.bannerGradiente || GRADIENTS.g2);

                      return (
                        <div key={artist._id} className={styles.userCard}>
                          <div className={styles.cardBanner} style={{ background: bannerBg }} />
                          <div className={styles.cardContent}>
                            <div className={styles.cardHeaderRow}>
                              <div className={styles.avatarSquare} style={avatarStyle}>
                                {(artist.avatarUrl || artist.fotoPerfil || artist.avatar) ? (
                                  <img
                                    src={artist.avatarUrl || artist.fotoPerfil || artist.avatar}
                                    alt={safeName}
                                    className={styles.avatarImage}
                                  />
                                ) : (
                                  initial
                                )}
                              </div>
                              <span className={`${styles.roleBadge} ${styles.roleBadgeArtist}`}>
                                <MusicIcon size={12} /> ARTISTA
                              </span>
                            </div>

                            <div className={styles.userNameBlock}>
                              <h3 className={styles.displayName}>{safeName}</h3>
                              <span className={styles.usernameHandle}>
                                @{artist.username || safeName.toLowerCase().replace(/\s/g, '')}
                              </span>
                            </div>

                            {artist.bio ? (
                              <p className={styles.bioText}>{artist.bio}</p>
                            ) : (
                              <p className={styles.bioText} style={{ fontStyle: 'italic', opacity: 0.6 }}>
                                Banda / Artista de la escena independiente de Tucumán.
                              </p>
                            )}

                            {artist.sharedGenres.length > 0 && (
                              <div className={styles.matchCallout}>
                                <span>⚡ {artist.sharedGenres.length} en común: {artist.sharedGenres.join(', ')}</span>
                              </div>
                            )}

                            {artist.generosMusicales && artist.generosMusicales.length > 0 && (
                              <div className={styles.genresList}>
                                {artist.generosMusicales.map((g) => {
                                  const isMatch = artist.sharedGenres.includes(g);
                                  return (
                                    <span
                                      key={g}
                                      className={`${styles.genreChip} ${isMatch ? styles.genreChipMatch : ''}`}
                                    >
                                      {g}
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            <div className={styles.cardFooter}>
                              <FollowButton userId={artist._id} isFollowing={isFollowing} />
                              <Link
                                to={`/profile/${artist.username || artist._id}`}
                                className={styles.profileBtn}
                              >
                                VER PERFIL →
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Sección: GENTE SEGÚN TUS GUSTOS */}
            {(activeTab === 'ALL' || activeTab === 'PEOPLE') && (
              <section className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <TicketIcon size={22} className={styles.sectionTitleIcon} />
                    GENTE SEGÚN TUS GUSTOS
                  </h2>
                  {myGenres.length > 0 && (
                    <span className={styles.matchBadgeTitle}>
                      Basado en tus gustos musicales
                    </span>
                  )}
                </div>

                {people.length === 0 ? (
                  <div className={styles.emptyState}>
                    No se encontraron usuarios que coincidan con los criterios.
                  </div>
                ) : (
                  <div className={styles.cardsGrid}>
                    {people.map((person) => {
                      const isFollowing = followingIds.some(
                        (fid) => fid === person._id || fid._id === person._id
                      );
                      const safeName = person.nombre || person.username || 'Usuario';
                      const initial = safeName.charAt(0).toUpperCase();
                      const avatarColor = person.avatarColor || 'transparent';
                      const avatarStyle = avatarColor !== 'transparent'
                        ? { background: avatarColor, padding: '2px' }
                        : { background: '#1a1d29' };
                      const bannerBg = person.bannerImagen
                        ? `url("${person.bannerImagen}") center/cover no-repeat`
                        : (GRADIENTS[person.bannerGradiente] || person.bannerGradiente || GRADIENTS.g1);

                      return (
                        <div key={person._id} className={styles.userCard}>
                          <div className={styles.cardBanner} style={{ background: bannerBg }} />
                          <div className={styles.cardContent}>
                            <div className={styles.cardHeaderRow}>
                              <div className={styles.avatarSquare} style={avatarStyle}>
                                {(person.avatarUrl || person.fotoPerfil || person.avatar) ? (
                                  <img
                                    src={person.avatarUrl || person.fotoPerfil || person.avatar}
                                    alt={safeName}
                                    className={styles.avatarImage}
                                  />
                                ) : (
                                  initial
                                )}
                              </div>
                              <span className={`${styles.roleBadge} ${styles.roleBadgeFan}`}>
                                <TicketIcon size={12} /> FAN
                              </span>
                            </div>

                            <div className={styles.userNameBlock}>
                              <h3 className={styles.displayName}>{safeName}</h3>
                              <span className={styles.usernameHandle}>
                                @{person.username || safeName.toLowerCase().replace(/\s/g, '')}
                              </span>
                            </div>

                            {person.bio ? (
                              <p className={styles.bioText}>{person.bio}</p>
                            ) : (
                              <p className={styles.bioText} style={{ fontStyle: 'italic', opacity: 0.6 }}>
                                Apasionado por el recital y la escena local.
                              </p>
                            )}

                            {person.sharedGenres.length > 0 && (
                              <div className={styles.matchCallout}>
                                <span>⚡ {person.sharedGenres.length} en común: {person.sharedGenres.join(', ')}</span>
                              </div>
                            )}

                            {person.generosMusicales && person.generosMusicales.length > 0 && (
                              <div className={styles.genresList}>
                                {person.generosMusicales.map((g) => {
                                  const isMatch = person.sharedGenres.includes(g);
                                  return (
                                    <span
                                      key={g}
                                      className={`${styles.genreChip} ${isMatch ? styles.genreChipMatch : ''}`}
                                    >
                                      {g}
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            <div className={styles.cardFooter}>
                              <FollowButton userId={person._id} isFollowing={isFollowing} />
                              <Link
                                to={`/profile/${person.username || person._id}`}
                                className={styles.profileBtn}
                              >
                                VER PERFIL →
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
