import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CheckoutLayout from '../components/checkout/CheckoutLayout';
import styles from './PurchaseSuccessPage.module.css';

/**
 * PurchaseSuccessPage — Paso 4: Confirmación de compra exitosa
 * Muestra el ticket digital con código QR y número de orden
 */
export default function PurchaseSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const eventData     = location.state?.eventData ?? null;
  const cantidad      = location.state?.cantidad ?? 1;
  const compradorData = location.state?.compradorData ?? null;
  const paymentMethod = location.state?.paymentMethod ?? '';

  // Inicializa el número de orden con el retornado por el backend, o genera uno ficticio de respaldo
  const [orderId] = useState(
    location.state?.orderId ?? `VOY-${Math.floor(100000 + Math.random() * 900000)}`
  );

  const [showToast, setShowToast] = useState(false);

  function handleBackToHome() {
    navigate('/');
  }

  function handleDownloadPDF() {
    setShowToast(true);
  }

  // Desvanece el aviso de 'Próximamente' tras 3 segundos
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <CheckoutLayout currentStep={4} eventData={eventData} cantidad={cantidad}>
      <div className={styles.container}>
        
        {/* Toast de aviso Próximamente */}
        {showToast && (
          <div className={styles.toast} role="alert">
            <span className={styles.toastIcon}>⚡</span>
            <span>Próximamente disponible en el siguiente Sprint.</span>
          </div>
        )}

        {/* Encabezado */}
        <div className={styles.successHeader}>
          <div className={styles.checkCircle}>✓</div>
          <h1 className={styles.successTitle}>¡COMPRA CONFIRMADA!</h1>
          <p className={styles.successSubtitle}>
            Tus entradas han sido reservadas. Enviamos un mail a{' '}
            <strong className={styles.emailHighlight}>
              {compradorData?.email ?? 'tu dirección de correo'}
            </strong>{' '}
            con los detalles y el código de ingreso.
          </p>
        </div>

        {/* TICKET DIGITAL FÍSICO */}
        <div className={styles.ticket}>
          
          {/* Mitad Superior: Información del Evento */}
          <div className={styles.ticketTop}>
            <div className={styles.ticketLogo}>
              <span className={styles.logoBox}>V</span>
              <span className={styles.logoText}>VOY PROJECT</span>
            </div>

            <div className={styles.ticketDetails}>
              <h2 className={styles.eventName}>{eventData?.title ?? 'Evento Under'}</h2>

              <div className={styles.metaGrid}>
                <div className={styles.metaCell}>
                  <span className={styles.metaLabel}>FECHA</span>
                  <span className={styles.metaValue}>{eventData?.date ?? 'Fecha a confirmar'}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.metaLabel}>HORA</span>
                  <span className={styles.metaValue}>{eventData?.time ?? 'Hora a confirmar'}</span>
                </div>
                <div className={`${styles.metaCell} ${styles.fullWidth}`}>
                  <span className={styles.metaLabel}>LUGAR</span>
                  <span className={styles.metaValue}>{eventData?.venue ?? 'Lugar a confirmar'}</span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.metaLabel}>CANTIDAD</span>
                  <span className={styles.metaValue}>
                    {cantidad} {cantidad === 1 ? 'entrada' : 'entradas'}
                  </span>
                </div>
                <div className={styles.metaCell}>
                  <span className={styles.metaLabel}>MÉTODO DE PAGO</span>
                  <span className={styles.metaValue}>
                    {paymentMethod || 'Transferencia bancaria'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divisor perforado interactivo */}
          <div className={styles.ticketDivider} aria-hidden="true">
            <div className={styles.notchLeft} />
            <div className={styles.dashedLine} />
            <div className={styles.notchRight} />
          </div>

          {/* Mitad Inferior: QR & Código de Orden */}
          <div className={styles.ticketBottom}>
            <div className={styles.qrContainer}>
              <QRCodeSVG
                value={orderId}
                bgColor="transparent"
                fgColor="#ffffff"
                size={130}
                level="M"
              />
            </div>
            <div className={styles.orderInfo}>
              <span className={styles.orderLabel}>NÚMERO DE ORDEN</span>
              <span className={styles.orderId}>{orderId}</span>
            </div>
          </div>
        </div>

        {/* Botonera de acciones */}
        <div className={styles.actions}>
          <button
            onClick={handleDownloadPDF}
            className={styles.pdfBtn}
            aria-label="Descargar entrada en PDF"
          >
            DESCARGAR PDF
          </button>
          
          <button
            onClick={handleBackToHome}
            className={styles.homeBtn}
          >
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    </CheckoutLayout>
  );
}
