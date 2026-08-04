import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchEvents } from "../../services/eventService";
import styles from "./ArtistDashboard.module.css";
import EditorialHeader from "../../design-system/composites/EditorialHeader/EditorialHeader";
import { 
  UserIcon, 
  CalendarIcon, 
  MusicIcon, 
  ArrowRightIcon, 
  PlusIcon,
  ExternalLinkIcon,
  MapPinIcon,
  XIcon,
  ZapIcon
} from "../../components/icons";

export default function ArtistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposalSent, setProposalSent] = useState(false);

  const userName = user?.nombre || user?.username || "Artista";
  const userHandle = user?.username ? `@${user.username}` : "";
  const avatar = user?.avatar || user?.avatarUrl || user?.fotoPerfil || "";
  const bio = user?.bio || "Banda / Artista de la escena independiente de Tucumán.";

  useEffect(() => {
    async function loadArtistEvents() {
      try {
        setLoading(true);
        const events = await fetchEvents();
        const normName = (user?.nombre || '').toLowerCase().trim();
        const normUser = (user?.username || '').toLowerCase().trim();

        // Filtrar eventos donde toca este artista
        const matched = events.filter(evt => {
          if (!evt.artists) return false;
          return evt.artists.some(a => {
            const aName = (a.nombre || '').toLowerCase().trim();
            const aUser = (a.usuario?.username || '').toLowerCase().trim();
            return (normUser && aUser === normUser) || (normName && aName === normName);
          });
        });

        setMyEvents(matched.length > 0 ? matched : events.slice(0, 3));
      } catch (err) {
        console.error("Error cargando eventos del artista:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArtistEvents();
  }, [user]);

  const handleSendProposal = (e) => {
    e.preventDefault();
    setProposalSent(true);
    setTimeout(() => {
      setProposalSent(false);
      setShowApplyModal(false);
    }, 2000);
  };

  return (
    <div className={styles.dashboardPage}>
      <EditorialHeader transparent={false} />
      
      <main className={styles.mainContent}>
        {/* Banner de Bienvenida del Artista */}
        <div className={styles.artistBanner}>
          <div className={styles.avatarWrap} style={{ borderColor: user?.avatarColor || '#00FF9F' }}>
            {avatar ? (
              <img src={avatar} alt={userName} className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarInitials}>{userName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className={styles.bannerInfo}>
            <div className={styles.badgeRow}>
              <span className={styles.badgeArtist}>ARTISTA VERIFICADO</span>
              <span className={styles.badgeLocation}>📍 Tucumán, AR</span>
            </div>
            <h1 className={styles.pageTitle}>{userName}</h1>
            <p className={styles.userHandleText}>{userHandle}</p>
            <p className={styles.artistBioText}>"{bio}"</p>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <span className={styles.metricNumber}>{myEvents.length}</span>
            <span className={styles.metricLabel}>PRÓXIMOS SHOWS</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metricItem}>
            <span className={styles.metricNumber}>{user?.seguidores?.length || 14}</span>
            <span className={styles.metricLabel}>SEGUIDORES</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metricItem}>
            <span className={styles.metricNumber}>100%</span>
            <span className={styles.metricLabel}>UNDER TUCUMANO</span>
          </div>
        </div>

        {/* Grilla de Acciones Principales */}
        <section className={styles.grid}>
          {/* Tarjeta 1: Perfil Artístico */}
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <UserIcon size={28} className={styles.iconPrimary} />
            </div>
            <h3 className={styles.cardTitle}>Mi Perfil Artístico</h3>
            <p className={styles.cardDesc}>
              Actualizá tus fotos de perfil y portada, tu lema oficial, biografía y redes sociales (Instagram, Spotify, YouTube).
            </p>
            <button 
              className={styles.cardBtn} 
              onClick={() => navigate('/profile/edit')}
            >
              <span>EDITAR PERFIL</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>

          {/* Tarjeta 2: Próximas Fechas (AHORA INTERACTIVA Y PROTOTIPADA) */}
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <CalendarIcon size={28} className={styles.iconCyan} />
            </div>
            <h3 className={styles.cardTitle}>Próximas Fechas</h3>
            <p className={styles.cardDesc}>
              Visualizá los recitales en los que estás tocando próximamente, tu posición en la grilla y el estado de las entradas.
            </p>
            <button 
              className={styles.cardBtnCyan} 
              onClick={() => navigate('/dashboard/artist/calendar')}
            >
              <span>VER CALENDARIO Y FECHAS ({myEvents.length})</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>

          {/* Tarjeta 3: Postular a Fechas / Solicitar Show */}
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <ZapIcon size={28} className={styles.iconFuchsia} />
            </div>
            <h3 className={styles.cardTitle}>Postular a Fechas</h3>
            <p className={styles.cardDesc}>
              Proponé a tu banda para tocar en fechas de productoras locales o solicitá espacio en festivales under.
            </p>
            <button 
              className={styles.cardBtnSecondary} 
              onClick={() => setShowApplyModal(true)}
            >
              <span>POSTULAR BANDA</span>
              <PlusIcon size={16} />
            </button>
          </div>
        </section>

        {/* Sección: Vista Previa de la Grilla de Mis Fechas */}
        <section className={styles.upcomingSection}>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>MIS RECITALES CONFIRMADOS</h2>
            <button className={styles.viewPublicBtn} onClick={() => navigate(`/profile/${user?.username || 'me'}`)}>
              Ver mi perfil público <ExternalLinkIcon size={14} />
            </button>
          </div>

          <div className={styles.eventsList}>
            {myEvents.map((evt) => (
              <div key={evt.id} className={styles.eventRowCard}>
                <div className={styles.eventFlyerThumb}>
                  <img src={evt.imageUrl} alt={evt.title} />
                </div>
                <div className={styles.eventRowDetails}>
                  <div className={styles.eventRowMeta}>
                    <span className={styles.eventDateBadge}>{evt.date}</span>
                    <span className={styles.eventTimeBadge}>{evt.time}</span>
                  </div>
                  <h3 className={styles.eventRowTitle}>{evt.title}</h3>
                  <p className={styles.eventRowVenue}>📍 {evt.venue}</p>
                </div>
                <div className={styles.eventRowActions}>
                  <Link to={`/events/${evt.id}`} className={styles.goEventBtn}>
                    Página del show ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MODAL 1: Próximas Fechas Confirmadas */}
      {showDatesModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDatesModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>📅 PRÓXIMAS FECHAS DE {userName.toUpperCase()}</h2>
              <button className={styles.closeBtn} onClick={() => setShowDatesModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalSubtitle}>Recitales confirmados en la plataforma donde tu banda está en la grilla:</p>
              <div className={styles.modalEventsList}>
                {myEvents.map((evt) => (
                  <div key={evt.id} className={styles.modalEventItem}>
                    <img src={evt.imageUrl} alt={evt.title} className={styles.modalEventImg} />
                    <div className={styles.modalEventText}>
                      <span className={styles.modalEventDate}>{evt.date} • {evt.time}</span>
                      <h4>{evt.title}</h4>
                      <p>📍 {evt.venue}</p>
                    </div>
                    <Link to={`/events/${evt.id}`} className={styles.modalEventBtn}>
                      VER SHOW ↗
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Postular Banda / Solicitar Fecha */}
      {showApplyModal && (
        <div className={styles.modalOverlay} onClick={() => setShowApplyModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>⚡ POSTULAR BANDA A PRODUCTORAS</h2>
              <button className={styles.closeBtn} onClick={() => setShowApplyModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {proposalSent ? (
                <div className={styles.successMessage}>
                  <p>🎉 ¡Propuesta enviada con éxito a las productoras de Tucumán!</p>
                  <span>Te notificaremos cuando una productora revise tu solicitud.</span>
                </div>
              ) : (
                <form onSubmit={handleSendProposal} className={styles.proposalForm}>
                  <label className={styles.formLabel}>Nombre de la Banda / Proyecto</label>
                  <input type="text" className={styles.formInput} defaultValue={userName} required />

                  <label className={styles.formLabel}>Link a tema / Spotify / YouTube / Instagram</label>
                  <input type="url" className={styles.formInput} placeholder="https://instagram.com/tubanda" required />

                  <label className={styles.formLabel}>Mensaje para las Productoras</label>
                  <textarea className={styles.formTextarea} rows={3} placeholder="Contanos sobre tu propuesta de show, disponibilidad de fechas y requerimientos técnicos..." required />

                  <button type="submit" className={styles.submitProposalBtn}>
                    ENVIAR PROPUESTA A PRODUCTORAS
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
