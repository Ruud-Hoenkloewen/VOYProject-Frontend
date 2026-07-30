import { QRCodeSVG } from 'qrcode.react';
import styles from './TicketStub.module.css';

/**
 * TicketStub — Entrada digital estilizada formato stub físico con código QR.
 */
export default function TicketStub({ ticket, orderId }) {
  if (!ticket) return null;

  const {
    id,
    eventTitle = "Evento VOY Project",
    eventDate = "Fecha por confirmar",
    eventTime = "20:00 HS",
    venue = "Venue",
    holderName = "Usuario VOY",
    typeName = "Entrada General",
    qrUrl,
    genres = ["LIVE"],
  } = ticket;

  const verificationUrl = qrUrl || (
    typeof window !== 'undefined'
      ? `${window.location.origin}/compra/confirmacion?orderId=${orderId || id}`
      : `https://voyproject.ar/compra/confirmacion?orderId=${orderId || id}`
  );

  return (
    <div className={styles.ticket}>
      <div className={styles.ticketMain}>
        {genres.length > 0 && (
          <div className={styles.genresRow}>
            {genres.map((g) => (
              <span key={g} className={styles.genreChip}>
                {g}
              </span>
            ))}
          </div>
        )}

        <div>
          <span className={styles.label}>EVENTO</span>
          <h2 className={styles.eventName}>{eventTitle}</h2>
        </div>

        <div className={styles.infoGrid}>
          <div>
            <span className={styles.label}>FECHA</span>
            <span className={styles.value}>{eventDate}</span>
          </div>

          <div>
            <span className={styles.label}>HORA</span>
            <span className={styles.value}>{eventTime}</span>
          </div>

          <div>
            <span className={styles.label}>LUGAR</span>
            <span className={styles.value}>{venue}</span>
          </div>

          <div>
            <span className={styles.label}>TIPO</span>
            <span className={styles.valueAccent}>{typeName}</span>
          </div>

          <div className={styles.infoColFull}>
            <span className={styles.label}>TITULAR DE LA ENTRADA</span>
            <span className={styles.value}>{holderName}</span>
          </div>
        </div>

        <div className={styles.ticketRef}>REF: {id || orderId}</div>
      </div>

      <div className={styles.stubDivider} />

      <div className={styles.ticketStub}>
        <div className={styles.qrWrapper}>
          <QRCodeSVG
            value={verificationUrl}
            bgColor="#ffffff"
            fgColor="#08090d"
            size={110}
            level="M"
          />
        </div>
        <span className={styles.qrText}>
          PRESENTÁ ESTE QR<br />EN LA PUERTA
        </span>
      </div>
    </div>
  );
}
