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

        setMyEvents(matched);
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
        {/* Grilla de Acciones Principales */}
        <section className={styles.grid}>
          {/* Tarjeta 1: Próximas Fechas */}
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <CalendarIcon size={28} className={styles.iconGray} />
            </div>
            <h3 className={styles.cardTitle}>Próximas Fechas</h3>
            <p className={styles.cardDesc}>
              Mirá los recitales en los que vas a tocar pronto.
            </p>
            <button 
              className={styles.cardBtnSecondary} 
              onClick={() => navigate('/dashboard/artist/calendar')}
            >
              <span>VER CALENDARIO Y FECHAS ({myEvents.length})</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>

          {/* Tarjeta 2: Postular a Fechas / Solicitar Show */}
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <ZapIcon size={28} className={styles.iconGray} />
            </div>
            <h3 className={styles.cardTitle}>Postular a Fechas</h3>
            <p className={styles.cardDesc}>
              Enviá tu propuesta a las productoras. Podés ser tomado en cuenta para futuros eventos.
            </p>
            <button 
              className={styles.cardBtnSecondary}
              onClick={() => setShowApplyModal(true)}
            >
              <span>POSTULAR MI BANDA / PROYECTO</span>
              <PlusIcon size={16} />
            </button>
          </div>
        </section>

        {/* Sección: Lista de Recitales Confirmados */}
        <section className={styles.upcomingSection}>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>MIS RECITALES CONFIRMADOS</h2>
            <button 
              className={styles.viewPublicBtn}
              onClick={() => navigate(`/profile/${user?.username || 'me'}`)}
            >
              <span>Ver mi perfil público</span>
              <ExternalLinkIcon size={14} />
            </button>
          </div>

          <div className={styles.eventsList}>
            {myEvents.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center", background: "transparent", border: "1px dashed var(--ds-color-border-editorial-mid)", borderRadius: "12px", color: "var(--ds-color-text-editorial-muted)", gap: "10px" }}>
                <CalendarIcon size={36} color="#94a3b8" />
                <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: "700", color: "var(--ds-color-text-primary)" }}>
                  No tenes ningun evento confirmado todavia.
                </p>
              </div>
            ) : (
              myEvents.map((evt) => (
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
              ))
            )}
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
