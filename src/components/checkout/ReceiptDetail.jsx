import { formatPrice } from '../../utils/helpers';
import styles from './ReceiptDetail.module.css';

/**
 * ReceiptDetail — Desglose de comprobante de pago de la transacción.
 */
export default function ReceiptDetail({ order }) {
  if (!order) return null;

  const {
    orderId,
    buyerName,
    buyerEmail,
    buyerPhone,
    eventTitle,
    eventDate,
    eventTime,
    venue,
    quantity = 1,
    unitPrice = 0,
    subtotal = 0,
    serviceFee = 0,
    total = 0,
    paymentMethodDisplay = "Tarjeta de Crédito / Débito",
  } = order;

  return (
    <div className={styles.receipt}>
      <div className={styles.header}>
        <div>
          <div className={styles.company}>VOY PROJECT TICKETS</div>
          <div className={styles.sub}>voyproject.ar • Tucumán, Argentina</div>
        </div>
        <div className={styles.orderNumBlock}>
          <span className={styles.orderNumLabel}>Nº COMPROBANTE</span>
          <span className={styles.orderId}>{orderId}</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.label}>TITULAR</span>
          <span className={styles.val}>{buyerName}</span>
        </div>
        {buyerEmail && (
          <div className={styles.row}>
            <span className={styles.label}>EMAIL</span>
            <span className={styles.val}>{buyerEmail}</span>
          </div>
        )}
        {buyerPhone && (
          <div className={styles.row}>
            <span className={styles.label}>TELÉFONO</span>
            <span className={styles.val}>{buyerPhone}</span>
          </div>
        )}
        <div className={styles.row}>
          <span className={styles.label}>EVENTO</span>
          <span className={styles.val}>{eventTitle}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>FECHA Y HORA</span>
          <span className={styles.val}>{eventDate} • {eventTime}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>LUGAR</span>
          <span className={styles.val}>{venue}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>CANTIDAD</span>
          <span className={styles.val}>{quantity} x Entrada General</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>MÉTODO DE PAGO</span>
          <span className={styles.val}>{paymentMethodDisplay}</span>
        </div>
      </div>

      <div className={styles.totals}>
        <div className={styles.row}>
          <span className={styles.label}>Subtotal ({quantity} × {formatPrice(unitPrice)})</span>
          <span className={styles.val}>{formatPrice(subtotal)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Cargo por servicio (10%)</span>
          <span className={styles.val}>{formatPrice(serviceFee)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>TOTAL</span>
          <span className={styles.totalVal}>{formatPrice(total)}</span>
        </div>
      </div>

      <div className={styles.footer}>
        🛡️ DOCUMENTO VÁLIDO COMO COMPROBANTE DE COMPRA • VOY PROJECT
      </div>
    </div>
  );
}
