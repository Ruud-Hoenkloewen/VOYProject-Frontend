import { useNavigate } from "react-router-dom";
import { TicketIcon, ShareIcon } from "../../../../components/icons";
import styles from "../../EventDetailPage.module.css";

export default function TicketCard({ eventData, isSoldOut, id, onShowToast }) {
  const navigate = useNavigate();

  const handleShare = () => {
    const url = `${window.location.origin}/events/${id}`;
    if (navigator.share) {
      navigator.share({ title: eventData?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      if (onShowToast) {
        onShowToast("¡Enlace del evento copiado al portapapeles! 📋");
      }
    }
  };

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
            {eventData.status || "DISPONIBLE"}
          </span>
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
        <button className={styles.outlineButton} onClick={handleShare}>
          <ShareIcon /> COMPARTIR EVENTO
        </button>
      </div>

    </div>
  );
}
