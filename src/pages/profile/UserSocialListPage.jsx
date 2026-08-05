import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfileByUsername, getMyProfile } from '../../services/userService';
import EditorialHeader from '../../design-system/composites/EditorialHeader/EditorialHeader';
import Container from '../../design-system/layout/Container/Container';
import { PeopleIcon } from '../../components/icons';
import styles from './UserSocialListPage.module.css';

export default function UserSocialListPage({ type = 'followers' }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: loggedUser } = useAuth();

  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isFollowers = type === 'followers';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        let profileData;
        if (username === 'me' || (loggedUser && (username === loggedUser.username || username === loggedUser._id))) {
          profileData = await getMyProfile();
        } else {
          profileData = await getProfileByUsername(username);
        }
        setTargetUser(profileData);
      } catch (err) {
        console.error('Error al cargar lista social:', err);
        setError('No se pudo cargar el perfil.');
      } finally {
        setLoading(false);
      }
    }
    if (username) {
      loadData();
    }
  }, [username, loggedUser]);

  if (loading) {
    return (
      <div className={styles.pageRoot}>
        <EditorialHeader transparent={false} />
        <div className={styles.loadingRoot}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Cargando comunidad...</p>
        </div>
      </div>
    );
  }

  if (error || !targetUser) {
    return (
      <div className={styles.pageRoot}>
        <EditorialHeader transparent={false} />
        <div className={styles.errorRoot}>
          <h2>{error || 'Usuario no encontrado'}</h2>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            ← Volver atrás
          </button>
        </div>
      </div>
    );
  }

  const userHandle = targetUser.username || username;
  const followersList = targetUser.seguidores || [];
  const followingList = targetUser.siguiendo || [];
  const currentList = isFollowers ? followersList : followingList;

  const filteredUsers = currentList.filter((u) => {
    const uObj = typeof u === 'object' ? u : { username: String(u) };
    const name = (uObj.nombre || uObj.username || '').toLowerCase();
    const handle = (uObj.username || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    return name.includes(q) || handle.includes(q);
  });

  return (
    <div className={styles.pageRoot}>
      <EditorialHeader transparent={false} />

      <main className={styles.mainContent}>
        <Container>
          {/* Link Volver al Perfil */}
          <div className={styles.topBarRow}>
            <button 
              className={styles.backLinkBtn} 
              onClick={() => navigate(`/profile/${userHandle}`)}
            >
              ← Volver al perfil de @{userHandle}
            </button>
          </div>

          {/* Navegación Estilo Roblox: Pestañas Superiores */}
          <div className={styles.tabsNavContainer}>
            <button
              className={`${styles.tabBtn} ${isFollowers ? styles.activeTab : ''}`}
              onClick={() => navigate(`/profile/${userHandle}/followers`)}
            >
              Seguidores
            </button>
            <button
              className={`${styles.tabBtn} ${!isFollowers ? styles.activeTab : ''}`}
              onClick={() => navigate(`/profile/${userHandle}/following`)}
            >
              Seguidos
            </button>
          </div>

          {/* Subheader: Buscador */}
          <div className={styles.subHeaderArea}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder={`Buscar ${isFollowers ? 'seguidores' : 'seguidos'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button className={styles.clearSearchBtn} onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          {/* Grilla de 3 Columnas Estilo Roblox */}
          {filteredUsers.length > 0 ? (
            <div className={styles.robloxGrid3Col}>
              {filteredUsers.map((u, idx) => {
                const uObj = typeof u === 'object' ? u : { _id: u, username: String(u) };
                const name = uObj.nombre || uObj.username || 'Usuario';
                const handle = uObj.username ? `@${uObj.username}` : '';
                const avatar = uObj.avatarUrl || uObj.fotoPerfil || uObj.avatar || '';
                const rawAvatarColor = uObj.avatarColor;
                const avatarColor = (rawAvatarColor && rawAvatarColor !== 'none' && rawAvatarColor !== 'transparent') ? rawAvatarColor : 'transparent';
                const bio = uObj.lema || uObj.bio || '';
                const uRole = uObj.role || uObj.rol || 'client';
                const isProd = uRole === 'producer';
                const isArt = uRole === 'artist' || uRole === 'artista';
                const roleBadgeText = isProd ? 'PRODUCTOR' : isArt ? 'ARTISTA' : 'FAN';

                return (
                  <div
                    key={uObj._id || uObj.username || idx}
                    className={styles.robloxCard}
                    onClick={() => navigate(`/profile/${uObj.username || uObj._id}`)}
                  >
                    <div className={styles.robloxAvatarWrapper} style={{ borderColor: avatarColor }}>
                      {avatar ? (
                        <img src={avatar} alt={name} className={styles.robloxAvatarImg} />
                      ) : (
                        <span className={styles.robloxAvatarInitials}>{name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className={styles.robloxCardMeta}>
                      <div className={styles.robloxNameRow}>
                        <span className={styles.robloxName}>{name}</span>
                      </div>
                      {handle && <span className={styles.robloxHandle}>{handle}</span>}
                      
                      {bio ? (
                        <span className={styles.robloxBio}>"{bio}"</span>
                      ) : (
                        <span className={styles.robloxRoleBadge}>
                          {roleBadgeText}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <PeopleIcon size={48} color="#64748b" />
              <p className={styles.emptyText}>
                {searchQuery
                  ? `No se encontraron resultados para "${searchQuery}".`
                  : isFollowers
                  ? 'Este usuario aún no tiene seguidores.'
                  : 'Este usuario aún no sigue a nadie.'}
              </p>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
