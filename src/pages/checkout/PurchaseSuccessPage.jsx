import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatPrice } from '../../utils/helpers';
import styles from './PurchaseSuccessPage.module.css';

export default function PurchaseSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);

  const collectionStatus = searchParams.get('collection_status');
  const isRejected = collectionStatus === 'rejected';
  const isPending = collectionStatus === 'pending';

  const eventData     = location.state?.eventData ?? null;
  const cantidad      = location.state?.cantidad ?? 1;
  const compradorData = location.state?.compradorData ?? null;
  const paymentMethod = location.state?.paymentMethod ?? 'Tarjeta de crédito / débito';

  const rawOrderId = location.state?.orderId || searchParams.get('orderId');
  const [orderId] = useState(() => {
    if (!rawOrderId) return `VOY-${Math.floor(10000 + Math.random() * 90000)}`;
    if (typeof rawOrderId === 'string' && rawOrderId.length === 24 && /^[0-9a-fA-F]+$/.test(rawOrderId)) {
      return `VOY-${rawOrderId.slice(-5).toUpperCase()}`;
    }
    return rawOrderId;
  });

  const qrVerificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/compra/confirmacion?orderId=${orderId}`
    : `https://voyproject.ar/compra/confirmacion?orderId=${orderId}`;

  const [showToast, setShowToast] = useState(false);

  function handleBackToHome() {
    navigate('/');
  }

  function handleDownloadPDF() {
    setShowToast(true);
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // CONFETTI EFFECT (SCRUM-193)
  useEffect(() => {
    if (isRejected || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00ff9f', '#ff7bee', '#22d3ee', '#33ffb2', '#ffffff'];
    const particles = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      opacity: 1,
    }));

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity -= 0.005;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      if (particles.some(p => p.opacity > 0)) {
        animationFrame = requestAnimationFrame(render);
      }
    };
    render();

    return () => cancelAnimationFrame(animationFrame);
  }, [isRejected]);

  const precioUnitario = eventData?.rawPrice ?? 7999;
  const subtotal       = precioUnitario * cantidad;
  const cargoServicio  = Math.round(subtotal * 0.10);
  const total          = subtotal + cargoServicio;

  return (
    <div className={styles.pageRoot}>
      {/* Canvas Confetti Layer */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          pointerEvents: 'none', 
          zIndex: 9999 
        }} 
      />
      
      {showToast && (
        <div className={styles.toast} role="alert">
          <span className={styles.toastIcon}>⚡</span>
          <span>Próximamente disponible en el siguiente Sprint.</span>
        </div>
      )}



      {/* Header con Tick Verde de Éxito */}
      <div className={`${styles.successHeader} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.1s' }}>
        <div className={styles.checkCircle} style={{ 
          borderColor: isRejected ? '#ef4444' : isPending ? '#f59e0b' : '#00FF9F',
          backgroundColor: isRejected ? 'rgba(239, 68, 68, 0.1)' : isPending ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 255, 159, 0.1)',
          borderRadius: '50%',
          width: '68px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: isRejected ? '0 0 20px rgba(239, 68, 68, 0.2)' : isPending ? '0 0 20px rgba(245, 158, 11, 0.2)' : '0 0 20px rgba(0, 255, 159, 0.25)',
        }}>
          {isRejected ? (
            <span style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 900 }}>✗</span>
          ) : isPending ? (
            <span style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 900 }}>!</span>
          ) : (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00FF9F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <div className={styles.orderLabel}>
          {isRejected ? 'COMPRA FALLIDA' : isPending ? 'RESERVA EN PROCESO' : 'COMPRA CONFIRMADA'} • {orderId}
        </div>
        <h1 className={styles.successTitle}>
          {isRejected ? 'PAGO RECHAZADO' : 
           isPending ? 'RESERVA CONFIRMADA' : 
           <><>¡NOS VEMOS</><br/>EN LA MOVIDA!</>}
        </h1>
        <p className={styles.successSubtitle}>
          {isRejected ? 'Hubo un problema con tu pago. Por favor intentá con otro método.' : 
           isPending ? 'Tu reserva fue registrada correctamente. Seguí las instrucciones abajo para abonar al ingresar.' : 
           'Guardá una captura de esta pantalla o tu comprobante para ingresar al evento.'}
        </p>
      </div>

      <div className={`${styles.twoColumnGrid} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.2s' }}>
        
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🎟️</span>
            <span>ENTRADA DIGITAL</span>
          </div>
          <div className={styles.ticket}>
            <div className={styles.ticketMain}>
              <div className={styles.ticketGenres}>
                {eventData?.genres?.slice(0,2).map(g => (
                  <span key={g} className={styles.genreChip}>{g}</span>
                )) || <span className={styles.genreChip}>EVENTO</span>}
              </div>
              
              <span className={styles.ticketLabel}>EVENTO</span>
              <h2 className={styles.eventName}>{eventData?.title ?? 'Evento VOY Project'}</h2>
              
              <div className={styles.ticketGrid}>
                <div className={styles.ticketCol}>
                  <span className={styles.ticketLabel}>FECHA</span>
                  <span className={styles.ticketValue}>{eventData?.date ?? 'Fecha por confirmar'}</span>
                </div>
                <div className={styles.ticketCol}>
                  <span className={styles.ticketLabel}>HORA</span>
                  <span className={styles.ticketValue}>{eventData?.time ?? '20:00 HS'}</span>
                </div>
                <div className={styles.ticketCol}>
                  <span className={styles.ticketLabel}>LUGAR</span>
                  <span className={styles.ticketValue}>{eventData?.venue ?? 'Venue'}</span>
                </div>
                <div className={styles.ticketCol}>
                  <span className={styles.ticketLabel}>TIPO</span>
                  <span className={styles.ticketValueAccent}>Entrada General</span>
                </div>
                <div className={styles.ticketColFull}>
                  <span className={styles.ticketLabel}>TITULAR</span>
                  <span className={styles.ticketValue}>
                    {typeof compradorData?.nombre === 'string' && isNaN(compradorData.nombre)
                      ? `${compradorData.nombre} ${compradorData.apellido || ''}`
                      : 'Usuario VOY'}
                  </span>
                </div>
              </div>
              <div className={styles.ticketRef}>REF: {orderId}-01</div>
            </div>
            <div className={styles.ticketStub}>
              <div className={styles.qrContainer}>
                <QRCodeSVG
                  value={qrVerificationUrl}
                  bgColor="#ffffff"
                  fgColor="#08090d"
                  size={115}
                  level="M"
                />
              </div>
              <span className={styles.qrInstruction}>MOSTRÁ ESTE QR<br/>EN LA PUERTA</span>
            </div>
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📄</span>
            <span>COMPROBANTE DE COMPRA</span>
          </div>
          <div className={styles.receipt}>
            <div className={styles.receiptHeader}>
              <div>
                <div className={styles.receiptCompany}>VOY PROJECT TICKETS</div>
                <div className={styles.receiptSub}>voyproject.ar • Tucumán, Argentina</div>
              </div>
              <div className={styles.receiptOrder}>
                <span>Nº COMPROBANTE</span>
                <span className={styles.receiptOrderId}>{orderId}</span>
              </div>
            </div>

            <div className={styles.receiptBody}>
              <div className={styles.receiptRow}>
                <span className={styles.rl}>TITULAR</span>
                <span className={styles.rr}>
                  {typeof compradorData?.nombre === 'string' && isNaN(compradorData.nombre)
                    ? `${compradorData.nombre} ${compradorData.apellido || ''}`
                    : 'Usuario VOY'}
                </span>
              </div>
              {compradorData?.telefono && (
                <div className={styles.receiptRow}><span className={styles.rl}>TELÉFONO</span><span className={styles.rr}>{compradorData.telefono}</span></div>
              )}
              {compradorData?.email && (
                <div className={styles.receiptRow}><span className={styles.rl}>EMAIL</span><span className={styles.rr}>{compradorData.email}</span></div>
              )}
              <div className={styles.receiptRow}><span className={styles.rl}>EVENTO</span><span className={styles.rr}>{eventData?.title ?? 'Evento VOY Project'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>FECHA</span><span className={styles.rr}>{eventData?.date ?? 'Por confirmar'} • {eventData?.time ?? '20:00 HS'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>LUGAR</span><span className={styles.rr}>{eventData?.venue ?? 'Venue'}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>TIPO DE ENTRADA</span><span className={styles.rr}>Entrada General</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>CANTIDAD</span><span className={styles.rr}>{cantidad}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>MÉTODO DE PAGO</span><span className={styles.rr}>{paymentMethod}</span></div>
            </div>

            <div className={styles.receiptTotals}>
              <div className={styles.receiptRow}><span className={styles.rl}>Subtotal ({cantidad} × {formatPrice(precioUnitario)})</span><span className={styles.rr}>{formatPrice(subtotal)}</span></div>
              <div className={styles.receiptRow}><span className={styles.rl}>Cargo por servicio</span><span className={styles.rr}>{formatPrice(cargoServicio)}</span></div>
              <div className={styles.receiptRowTotal}><span className={styles.rl}>TOTAL</span><span className={styles.rrTotal}>{formatPrice(total)}</span></div>
            </div>

            <div className={styles.receiptFooter}>🛡️ DOCUMENTO VÁLIDO COMO COMPROBANTE DE COMPRA • VOY PROJECT</div>
          </div>
        </div>
      </div>

      {/* Sección: MANERAS DE PRESENTAR MI ENTRADA */}
      <div className={`${styles.instructionsCard} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.3s' }}>
        <h3 className={styles.instructionsTitle}>
          <span style={{ color: 'var(--ds-color-accent-primary)', marginRight: '0.4rem' }}>✓</span>
          MANERAS DE PRESENTAR MI ENTRADA
        </h3>

        {paymentMethod === 'Pago en Puerta' || paymentMethod === 'efectivo' ? (
          <>
            <div className={styles.instructionStep}>
              <div className={styles.stepNum} style={{ color: 'var(--ds-color-accent-primary)' }}>♦</div>
              <div>
                <div className={styles.stepTitle}>Captura de pantalla de esta página</div>
                <div className={styles.stepDesc}>Guardá una captura de esta pantalla mostrando tu código QR y los datos de tu reserva anticipada.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '-0.5rem 0', paddingLeft: '0.2rem' }}>
              <span style={{ height: '1px', width: '24px', background: 'var(--ds-color-border-editorial-mid)' }} />
              <span style={{ color: 'var(--ds-color-text-editorial-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>o</span>
              <span style={{ height: '1px', width: '24px', background: 'var(--ds-color-border-editorial-mid)' }} />
            </div>

            <div className={styles.instructionStep}>
              <div className={styles.stepNum} style={{ color: 'var(--ds-color-accent-primary)' }}>♦</div>
              <div>
                <div className={styles.stepTitle}>Pago en transferencia o efectivo en puerta</div>
                <div className={styles.stepDesc}>Presentá la captura en el ingreso para abonar tu entrada anticipada en efectivo o transferencia al ingresar.</div>
              </div>
            </div>
            <div className={styles.instructionStep}>
              <div className={styles.stepNum} style={{ color: 'var(--ds-color-accent-primary)' }}>♦</div>
              <div>
                <div className={styles.stepTitle}>Presentá tu DNI si te lo piden</div>
                <div className={styles.stepDesc}>El titular de la reserva puede ser solicitado para validación en puerta.</div>
              </div>
            </div>
            <div className={styles.instructionStep}>
              <div className={styles.stepNum} style={{ color: 'var(--ds-color-accent-primary)' }}>♦</div>
              <div>
                <div className={styles.stepTitle}>¡A disfrutar!</div>
                <div className={styles.stepDesc}>Recordá llegar antes de las {eventData?.time ?? '19:00 HS'} al evento.</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.instructionStep}>
              <div className={styles.stepNum} style={{ color: 'var(--ds-color-accent-primary)' }}>♦</div>
              <div>
                <div className={styles.stepTitle}>Captura de esta pantalla</div>
                <div className={styles.stepDesc}>Guardá una captura de pantalla de esta página con tu código QR e información completa del show.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '-0.5rem 0', paddingLeft: '0.2rem' }}>
              <span style={{ height: '1px', width: '24px', background: 'var(--ds-color-border-editorial-mid)' }} />
              <span style={{ color: 'var(--ds-color-text-editorial-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>o</span>
              <span style={{ height: '1px', width: '24px', background: 'var(--ds-color-border-editorial-mid)' }} />
            </div>

            <div className={styles.instructionStep}>
              <div className={styles.stepNum} style={{ color: 'var(--ds-color-accent-primary)' }}>♦</div>
              <div>
                <div className={styles.stepTitle}>Comprobante de pago Mercado Pago</div>
                <div className={styles.stepDesc}>Mostrá el comprobante de pago de Mercado Pago o una captura de pantalla del comprobante de la transacción.</div>
              </div>
            </div>
            <div className={styles.instructionStep}>
              <div className={styles.stepNum} style={{ color: 'var(--ds-color-accent-primary)' }}>♦</div>
              <div>
                <div className={styles.stepTitle}>Presentá tu DNI si te lo piden</div>
                <div className={styles.stepDesc}>El titular de la entrada puede ser solicitado para verificación en puerta.</div>
              </div>
            </div>
            <div className={styles.instructionStep}>
              <div className={styles.stepNum} style={{ color: 'var(--ds-color-accent-primary)' }}>♦</div>
              <div>
                <div className={styles.stepTitle}>¡A disfrutar!</div>
                <div className={styles.stepDesc}>Recordá llegar antes de las {eventData?.time ?? '19:00 HS'} al evento.</div>
              </div>
            </div>
          </>
        )}
      </div>

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
