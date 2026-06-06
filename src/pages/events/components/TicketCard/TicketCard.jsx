import { useNavigate } from "react-router-dom";
import { TicketIcon, HeartIcon, ShareIcon } from "../../../../components/icons";
import styles from "../../EventDetailPage.module.css";

export default function TicketCard({ eventData, isSoldOut, id }) {
  const navigate = useNavigate();

  return (
    <div className={styles.ticketCard}>
      <div className={styles.ticketHeader}>
        <span className={styles.ticketType}>ENTRADA GENERAL</span>
        <div className={styles.ticketPriceValue}>{eventData.price}</div>
        <span className={styles.ticketFee}>+ cargo por servicio</span>
      </div>

      <div className={styles.ticketDetails}>
        <div className={styles.ticketRow}>
          <span className={styles.ticketLabel}>ESTADO</span>
          <span className={`${styles.ticketValueBadge} ${isSoldOut ? styles.badgeValSoldout : styles.badgeValAvailable}`}>
            {eventData.status}
          </span>
        </div>
        <div className={styles.ticketRow}>
          <span className={styles.ticketLabel}>CAPACIDAD</span>
          <span className={styles.ticketValue}>
            {eventData.capacity ? `${eventData.capacity} personas` : "Venue chico"}
          </span>
        </div>
        <div className={styles.ticketRow}>
          <span className={styles.ticketLabel}>RESTRICCIÓN</span>
          <span className={styles.ticketValue}>Apto todo público</span>
        </div>
        <div className={styles.ticketRow}>
          <span className={styles.ticketLabel}>REINGRESO</span>
          <span className={`${styles.ticketValue} ${styles.textNeon}`}>Permitido</span>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button
          className={styles.buyButton}
          disabled={isSoldOut}
          onClick={() => navigate(`/events/${id}/checkout`, { state: { eventData } })}
        >
          <TicketIcon /> {isSoldOut ? "AGOTADO" : "COMPRAR ENTRADA"}
        </button>
        <button className={styles.outlineButton}><HeartIcon /> GUARDAR EVENTO</button>
        <button className={styles.outlineButton}><ShareIcon /> COMPARTIR EVENTO</button>
      </div>

      <p className={styles.termsText}>
        Al comprar tu entrada aceptás los <a href="#">términos y condiciones de VOYProject</a>.
      </p>
    </div>
  );
}
