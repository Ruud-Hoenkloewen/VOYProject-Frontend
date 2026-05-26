import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutLayout from '../components/checkout/CheckoutLayout';
import styles from './CheckoutPage.module.css'; // Reutilizamos estilos base de Checkout para consistencia visual

/**
 * PurchaseSuccessPage — Paso 4: Confirmación de compra exitosa
 * Ruta: /compra/confirmacion
 */
export default function PurchaseSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const eventData     = location.state?.eventData ?? null;
  const cantidad      = location.state?.cantidad ?? 1;
  const compradorData = location.state?.compradorData ?? null;
  const paymentMethod = location.state?.paymentMethod ?? '';

  function handleBackToHome() {
    navigate('/');
  }

  return (
    <CheckoutLayout currentStep={4} eventData={eventData} cantidad={cantidad}>
      <div className={styles.stepCard} style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
        
        {/* Ícono de éxito animado o simple */}
        <div style={{ 
          fontSize: '3.5rem', 
          lineHeight: '1', 
          color: 'var(--ds-color-accent-primary)', 
          marginBottom: '1.5rem' 
        }}>
          ✓
        </div>
        
        <h1 className={styles.stepTitle} style={{ justifyContent: 'center', marginBottom: '0.75rem', fontSize: '1.6rem' }}>
          ¡COMPRA CONFIRMADA!
        </h1>
        
        <p className={styles.stepSubtitle} style={{ margin: '0 auto 2.5rem', maxWidth: '440px', lineHeight: '1.6' }}>
          Tus entradas han sido reservadas con éxito. Enviamos un mail a{' '}
          <strong style={{ color: 'var(--ds-color-text-primary)' }}>
            {compradorData?.email ?? 'tu dirección de correo'}
          </strong>{' '}
          con las instrucciones de pago, el código QR y los detalles del show.
        </p>

        {/* Panel con resumen de la compra */}
        <div style={{
          border: '1px solid var(--ds-color-border-editorial-mid)',
          padding: '1.5rem',
          textAlign: 'left',
          marginBottom: '2.5rem',
          background: 'var(--ds-color-bg-editorial-surface, #0f0f0f)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '440px',
          margin: '0 auto 2.5rem'
        }}>
          <div>
            <span style={{ 
              fontSize: '0.6rem', 
              color: 'var(--ds-color-text-muted)', 
              display: 'block', 
              letterSpacing: '0.15em',
              fontWeight: '800',
              marginBottom: '0.2rem'
            }}>
              EVENTO
            </span>
            <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--ds-color-text-primary)' }}>
              {eventData?.title ?? 'Evento VOY'}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <span style={{ 
                fontSize: '0.6rem', 
                color: 'var(--ds-color-text-muted)', 
                display: 'block', 
                letterSpacing: '0.15em',
                fontWeight: '800',
                marginBottom: '0.2rem'
              }}>
                CANTIDAD
              </span>
              <span style={{ fontWeight: '700', color: 'var(--ds-color-text-primary)' }}>
                {cantidad} {cantidad === 1 ? 'entrada' : 'entradas'}
              </span>
            </div>
            
            <div>
              <span style={{ 
                fontSize: '0.6rem', 
                color: 'var(--ds-color-text-muted)', 
                display: 'block', 
                letterSpacing: '0.15em',
                fontWeight: '800',
                marginBottom: '0.2rem'
              }}>
                MÉTODO DE PAGO
              </span>
              <span style={{ fontWeight: '700', color: 'var(--ds-color-text-primary)' }}>
                {paymentMethod || 'Seleccionado'}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de retorno al inicio */}
        <button
          onClick={handleBackToHome}
          className={styles.ctaBtn}
          style={{ maxWidth: '280px', margin: '0 auto' }}
        >
          VOLVER AL INICIO
        </button>
      </div>
    </CheckoutLayout>
  );
}
