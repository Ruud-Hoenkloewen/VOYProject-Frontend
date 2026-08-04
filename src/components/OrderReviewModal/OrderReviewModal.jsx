import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, Download, ShieldCheck, X } from 'lucide-react';
import { downloadTicketPDF } from '../../utils/ticketPdfGenerator';
import styles from './OrderReviewModal.module.css';

export default function OrderReviewModal({ isOpen, onClose, order, eventData }) {
  const qrRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !order) return null;

  const orderId = order.numeroOrden || (order._id ? `VOY-${order._id.slice(-5).toUpperCase()}` : 'VOY-ENTRADA');
  
  const title = eventData?.title || eventData?.nombre || order.eventId?.nombre || order.evento?.nombre || 'Evento VOY Project';
  const date  = eventData?.date || (order.eventId?.fecha ? new Date(order.eventId.fecha).toLocaleDateString('es-AR') : 'Fecha por confirmar');
  const time  = eventData?.time || (order.eventId?.hora ? `${order.eventId.hora} HS` : '20:00 HS');
  const venue = eventData?.venue || order.eventId?.lugar || 'Lugar a confirmar';
  
  const cantidad = order.cantidad || 1;
  const compradorName = typeof order.datosComprador?.nombre === 'string'
    ? `${order.datosComprador.nombre} ${order.datosComprador.apellido || ''}`.trim()
    : 'Usuario VOY';

  const qrVerificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/compra/confirmacion?orderId=${orderId}`
    : `https://voyproject.ar/compra/confirmacion?orderId=${orderId}`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const svgElement = qrRef.current ? qrRef.current.querySelector('svg') : null;
      
      const parsedEvent = {
        title,
        date,
        time,
        venue,
        rawPrice: order.total ? Math.round(order.total / cantidad) : 0,
      };

      await downloadTicketPDF(order, parsedEvent, svgElement);
    } catch (err) {
      console.error('Error al generar el PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleBlock}>
            <span className={styles.titleIcon}><Ticket size={20} /></span>
            <div>
              <h3 className={styles.modalTitle}>REVISIÓN DE ORDEN DE COMPRA</h3>
              <span className={styles.orderSub}>Nº {orderId}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar modal">&times;</button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          
          {/* Ticket Card */}
          <div className={styles.ticketBox}>
            <div className={styles.ticketMain}>
              <span className={styles.badgeGeneral}>ENTRADA GENERAL</span>
              <h2 className={styles.eventName}>{title}</h2>

              <div className={styles.detailsGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>FECHA</span>
                  <span className={styles.infoValue}>{date}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>HORA</span>
                  <span className={styles.infoValue}>{time}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>LUGAR</span>
                  <span className={styles.infoValue}>{venue}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>CANTIDAD</span>
                  <span className={styles.infoValueAccent}>{cantidad} Ticket(s)</span>
                </div>
                <div className={styles.infoItem} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.infoLabel}>TITULAR</span>
                  <span className={styles.infoValue}>{compradorName}</span>
                </div>
              </div>
            </div>

            {/* Ticket QR Stub */}
            <div className={styles.ticketStub} ref={qrRef}>
              <div className={styles.qrContainer}>
                <QRCodeSVG
                  value={qrVerificationUrl}
                  bgColor="#ffffff"
                  fgColor="#08090d"
                  size={100}
                  level="M"
                />
              </div>
              <span className={styles.qrInstruction}>MOSTRÁ ESTE QR<br />EN LA PUERTA</span>
            </div>
          </div>

          {/* Validez Física Notice */}
          <div className={styles.validityNotice}>
            <span className={styles.noticeIcon}><ShieldCheck size={24} /></span>
            <div>
              <div className={styles.noticeTitle}>VALIDEZ FÍSICA GARANTIZADA EN PUERTA</div>
              <p className={styles.noticeText}>
                Esta entrada otorga acceso físico directo en la puerta del evento. Podés presentar el PDF descargado desde tu celular o impreso junto con tu DNI.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className={styles.modalFooter}>
          <button 
            className={styles.downloadPdfBtn}
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={16} />
            {downloading ? 'GENERANDO PDF...' : 'DESCARGAR PDF ENTRADA'}
          </button>
        </div>

      </div>
    </div>
  );
}
