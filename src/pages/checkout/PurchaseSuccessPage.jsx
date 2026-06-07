import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MailIcon } from '../../components/icons';
import styles from './PurchaseSuccessPage.module.css';

/**
 * PurchaseSuccessPage — Paso 4: Confirmación de compra exitosa
 * Muestra el ticket digital con código QR, recibo y pasos a seguir.
 */
export default function PurchaseSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const eventData     = location.state?.eventData ?? null;
  const cantidad      = location.state?.cantidad ?? 1;
  const compradorData = location.state?.compradorData ?? null;
  const paymentMethod = location.state?.paymentMethod ?? 'Tarjeta de crédito / débito';

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

  // Cálculos de recibo
  const precioUnitario = eventData?.rawPrice ?? 7999;
  const subtotal       = precioUnitario * cantidad;
  const cargoServicio  = Math.round(subtotal * 0.10);
  const total          = subtotal + cargoServicio;

  function fmt(amount) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className={styles.pageRoot}>
      
      {/* Toast de aviso Próximamente */}
      {showToast && (
        <div className={styles.toast} role="alert">
          <span className={styles.toastIcon}>⚡</span>
          <span>Próximamente disponible en el siguiente Sprint.</span>
        </div>
      )}

      {/* Banner de Entradas Enviadas */}
      <div className={`${styles.bannerContainer} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.1s' }}>
        <div className={styles.bannerIcon}><MailIcon /></div>
        <div className={styles.bannerText}>
          <span className={styles.bannerTitle}>¡ENTRADAS ENVIADAS!</span>
          <span className={styles.bannerSub}>Revisá tu bandeja en {compradorData?.email ?? 'tu@correo.com'}</span>
        </div>
        <div className={styles.bannerCheck}>✓</div>
      </div>

      {/* Encabezado */}
      <div className={`${styles.successHeader} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.2s' }}>
        <div className={styles.checkCircle}>
          <span>✓</span>
        </div>
        <div className={styles.orderLabel}>COMPRA CONFIRMADA • {orderId}</div>
        <h1 className={styles.successTitle}>¡NOS VEMOS<br/>EN LA MOVIDA!</h1>
        <p className={styles.successSubtitle}>Guardá esta página o revisá tu correo cuando quieras.</p>
      </div>

      {/* DOS COLUMNAS: TICKET A LA IZQUIERDA, RECIBO A LA DERECHA */}
      <div className={`${styles.twoColumnGrid} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.3s' }}>
        
        {/* TICKET DIGITAL FÍSICO */}
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>QR</span>
            <span>TU ENTRADA DIGITAL</span>
          </div>
          <div className={styles.ticket}>
            <div className={styles.ticketMain}>
              <div className={styles.ticketGenres}>
                {eventData?.genres?.slice(0,2).map(g => (
                  <span key={g} className={styles.genreChip}>{g}</span>
                )) || <span className={styles.genreChip}>ROCK</span>}
              </div>
              
              <span className={styles.ticketLabel}>EVENTO</span>
              <h2 className={styles.eventName}>{eventData?.title ?? 'Festival Emergente Norte'}</h2>
              
              <div className={styles.ticketGrid}>
                <div className={styles.ticketCol}>
                  <span className={styles.ticketLabel}>FECHA</span>
                  <span className={styles.ticketValue}>{eventData?.date ?? '10 JUN 2026'}</span>
                </div>
                <div className={styles.ticketCol}>
                  <span className={styles.ticketLabel}>HORA</span>
                  <span className={styles.ticketValue}>{eventData?.time ?? '19:00 HS'}</span>
                </div>
                <div className={styles.ticketCol}>
                  <span className={styles.ticketLabel}>LUGAR</span>
                  <span className={styles.ticketValue}>{eventData?.venue ?? 'Club Floresta'}</span>
                </div>
                <div className={styles.ticketCol}>
                  <span className={styles.ticketLabel}>TIPO</span>
                  <span className={styles.ticketValueAccent}>Entrada General</span>
                </div>
                <div className={styles.ticketColFull}>
                  <span className={styles.ticketLabel}>TITULAR</span>
                  <span className={styles.ticketValue}>{compradorData?.nombre ? `${compradorData.nombre} ${compradorData.apellido || ''}` : 'Usuario Test'}</span>
                </div>
              </div>
              <div className={styles.ticketRef}>REF: {orderId}-01</div>
            </div>
            <div className={styles.ticketStub}>
              <div className={styles.qrContainer}>
                <QRCodeSVG
                  value={`${orderId}-01`}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  size={110}
                  level="M"
                />
              </div>
              <span className={styles.qrInstruction}>MOSTRÁ ESTE QR<br/>EN LA PUERTA</span>
            </div>
          </div>
        </div>

        {/* COMPROBANTE DE COMPRA */}
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🧾</span>
            <span>COMPROBANTE DE COMPRA</span>
          </div>
          <div className={styles.receipt}>
            <div className={styles.receiptHeader}>
              <div>
                <div className={styles.receiptCompany}>VOY PROJECT TICKETS</div>
                <div className={styles.receiptSub}>undertuc.ar • Tucumán, Argentina</div>
              </div>
              <div className={styles.receiptOrder}>
                <span>Nº COMPROBANTE</span>
                <span className={styles.receiptOrderId}>{orderId}</span>
              </div>
            </div>

            <div className={styles.receiptBody}>
              <div className={styles.receiptRow}><span className={styles.rl}>TITULAR</span><span className={styles.rr}>{compradorData?.nombre ? `${compradorData.nombre} ${compradorData.apellido || ''}` : 'Usuario Test'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>TELÉFONO</span><span className={styles.rr}>{compradorData?.telefono || '381 555-5555'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>EMAIL</span><span className={styles.rr}>{compradorData?.email || 'test@voy.com'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>EVENTO</span><span className={styles.rr}>{eventData?.title ?? 'Festival Emergente Norte'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>FECHA</span><span className={styles.rr}>{eventData?.date ?? '10 JUN 2026'} • {eventData?.time ?? '19:00 HS'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>LUGAR</span><span className={styles.rr}>{eventData?.venue ?? 'Club Floresta'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>TIPO DE ENTRADA</span><span className={styles.rr}>Entrada General</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>CANTIDAD</span><span className={styles.rr}>{cantidad}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>MÉTODO DE PAGO</span><span className={styles.rr}>{paymentMethod}</span></div>
            </div>

            <div className={styles.receiptTotals}>
              <div className={styles.receiptRow}><span className={styles.rl}>Subtotal ({cantidad} × {fmt(precioUnitario)})</span><span className={styles.rr}>{fmt(subtotal)}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>Cargo por servicio</span><span className={styles.rr}>{fmt(cargoServicio)}</span></div>
              <div className={styles.receiptRowTotal}><span className={styles.rl}>TOTAL</span><span className={styles.rrTotal}>{fmt(total)}</span></div>
            </div>

            <div className={styles.receiptFooter}>DOCUMENTO VÁLIDO COMO COMPROBANTE • NO ES FACTURA</div>
          </div>
        </div>
      </div>

      {/* INSTRUCCIONES */}
      <div className={`${styles.instructionsCard} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.4s' }}>
        <h3 className={styles.instructionsTitle}><span style={{color: 'var(--ds-color-accent-primary)'}}>?</span> ¿CÓMO PRESENTO MI ENTRADA?</h3>
        <div className={styles.instructionStep}>
          <div className={styles.stepNum}>01</div>
          <div>
            <div className={styles.stepTitle}>Abrí esta pantalla o tu correo</div>
            <div className={styles.stepDesc}>Antes de ir al evento, abrí la app o el mail que te enviamos con tus entradas.</div>
          </div>
        </div>
        <div className={styles.instructionStep}>
          <div className={styles.stepNum}>02</div>
          <div>
            <div className={styles.stepTitle}>Mostrá el código QR en la puerta</div>
            <div className={styles.stepDesc}>El personal de ingreso va a escanear el QR de cada entrada. Tenés uno por persona.</div>
          </div>
        </div>
        <div className={styles.instructionStep}>
          <div className={styles.stepNum}>03</div>
          <div>
            <div className={styles.stepTitle}>Presentá tu DNI si te lo piden</div>
            <div className={styles.stepDesc}>El titular {compradorData?.nombre || 'Usuario'} puede ser solicitado para verificación.</div>
          </div>
        </div>
        <div className={styles.instructionStep}>
          <div className={styles.stepNum}>04</div>
          <div>
            <div className={styles.stepTitle}>¡A disfrutar!</div>
            <div className={styles.stepDesc}>Llegá antes de las {eventData?.time ?? '19:00 HS'} para asegurar tu lugar. Capacidad limitada.</div>
          </div>
        </div>
      </div>

      {/* Botonera de acciones */}
      <div className={styles.actions}>
        <button
          onClick={handleDownloadPDF}
          className={styles.pdfBtn}
          aria-label="Ver Más Eventos"
        >
          VER MÁS EVENTOS
        </button>
        
        <button
          onClick={handleBackToHome}
          className={styles.homeBtn}
        >
          VOLVER AL INICIO
        </button>
      </div>

    </div>
  );
}
