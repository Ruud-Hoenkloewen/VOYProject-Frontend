import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useOrderConfirmation } from '../../hooks/useOrderConfirmation';
import TicketStub from '../../components/Checkout/TicketStub';
import ReceiptDetail from '../../components/Checkout/ReceiptDetail';
import DynamicInstructions from '../../components/Checkout/DynamicInstructions';
import styles from './PurchaseSuccessPage.module.css';

export default function PurchaseSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const rawOrderId = location.state?.orderId || searchParams.get('orderId');
  const collectionStatus = searchParams.get('collection_status');

  const { order, loading } = useOrderConfirmation(rawOrderId, location.state);

  const isRejected = collectionStatus === 'rejected' || order?.status === 'rejected';
  const isPending = collectionStatus === 'pending' || order?.status === 'pending';

  const orderIdDisplay = order?.orderId || rawOrderId || 'VOY-84920';

  const handleCopyOrderId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(orderIdDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // CONFETTI EFFECT
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

      if (particles.some((p) => p.opacity > 0)) {
        animationFrame = requestAnimationFrame(render);
      }
    };
    render();

    return () => cancelAnimationFrame(animationFrame);
  }, [isRejected]);

  if (loading) {
    return (
      <div className={styles.pageRoot} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <span style={{ color: '#8e8e93', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          Cargando comprobante de compra... <span style={{ color: '#00FF9F' }}>VOY</span>
        </span>
      </div>
    );
  }

  const primaryTicket = order?.tickets?.[0] || {
    id: `${orderIdDisplay}-01`,
    eventTitle: order?.eventTitle,
    eventDate: order?.eventDate,
    eventTime: order?.eventTime,
    venue: order?.venue,
    holderName: order?.buyerName,
  };

  return (
    <div className={styles.pageRoot}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />

      {/* Header de Éxito / Estado */}
      <div className={`${styles.successHeader} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.1s' }}>
        <div
          className={styles.checkCircle}
          style={{
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
          }}
        >
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
          {isRejected ? 'COMPRA FALLIDA' : isPending ? 'RESERVA EN PROCESO' : 'COMPRA CONFIRMADA'} •{' '}
          <button
            type="button"
            onClick={handleCopyOrderId}
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
            title="Copiar número de orden"
          >
            {orderIdDisplay} {copied ? '✓ COPIADO' : ''}
          </button>
        </div>

        <h1 className={styles.successTitle}>
          {isRejected ? (
            'PAGO RECHAZADO'
          ) : isPending ? (
            'RESERVA REGISTRADA'
          ) : (
            <>
              ¡NOS VEMOS<br />EN LA MOVIDA!
            </>
          )}
        </h1>

        <p className={styles.successSubtitle}>
          {isRejected
            ? 'Hubo un problema con tu pago. Por favor intentá con otro método.'
            : isPending
            ? 'Tu reserva fue registrada correctamente. Presentá tu QR en puerta para ingresar.'
            : 'Guardá una captura de pantalla de tu entrada digital para ingresar al evento.'}
        </p>
      </div>

      {/* Grid de Ticket Digital & Comprobante */}
      <div className={`${styles.twoColumnGrid} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.2s' }}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🎟️</span>
            <span>ENTRADA DIGITAL</span>
          </div>
          <TicketStub ticket={primaryTicket} orderId={orderIdDisplay} />
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📄</span>
            <span>COMPROBANTE DE COMPRA</span>
          </div>
          <ReceiptDetail order={order} />
        </div>
      </div>

      {/* Instrucciones Dinámicas según Payment Method */}
      <div className={styles.animateFadeInUp} style={{ animationDelay: '0.3s' }}>
        <DynamicInstructions
          paymentMethod={order?.paymentMethod || 'online'}
          eventTime={order?.eventTime || '20:00 HS'}
        />
      </div>

      {/* Acciones de Navegación */}
      <div className={styles.actions}>
        <button onClick={() => navigate('/events')} className={styles.pdfBtn}>
          VER MÁS EVENTOS
        </button>

        <button onClick={() => navigate('/')} className={styles.homeBtn}>
          VOLVER AL INICIO
        </button>
      </div>
    </div>
  );
}
