import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchEventById } from '../../services/eventService';
import { createOrder, createPaymentPreference } from '../../services/orderService';
import CheckoutLayout from '../../components/checkout/CheckoutLayout';
import styles from './CheckoutPaymentPage.module.css';

// Ícono de tarjeta de crédito/débito en formato SVG
const CreditCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block' }}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const MercadoPagoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const QrCodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

/**
 * CheckoutPaymentPage — Paso 3: Método de pago
 * Ruta: /events/:id/checkout/pago
 */
export default function CheckoutPaymentPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [eventData, setEventData] = useState(location.state?.eventData ?? null);
  const [cantidad,  setCantidad]  = useState(location.state?.cantidad ?? 1);
  const [compradorData, setCompradorData] = useState(location.state?.compradorData ?? null);
  const [loading,   setLoading]   = useState(!eventData);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Carga el evento si llegamos por navegación directa
  useEffect(() => {
    if (!eventData && id) {
      fetchEventById(id)
        .then(setEventData)
        .catch(() => navigate('/', { replace: true }))
        .finally(() => setLoading(false));
    }
  }, [id, eventData, navigate]);

  // Si no existen los datos del comprador previos, redirige a Paso 2 para rellenarlos
  useEffect(() => {
    if (!loading && !compradorData) {
      navigate(`/events/${id}/checkout/datos`, {
        state: { eventData, cantidad },
        replace: true,
      });
    }
  }, [compradorData, loading, id, eventData, cantidad, navigate]);

  function handleVolver() {
    // Regresa al Paso 2 pasando los datos para que no se pierdan
    navigate(`/events/${id}/checkout/datos`, {
      state: {
        eventData,
        cantidad,
        compradorData,
      },
    });
  }

  async function handleConfirmar(e) {
    e.preventDefault();
    if (!paymentMethod) return;

    setIsSubmitting(true);
    setErrorMsg('');

    // Prepara el payload con los datos de la orden y del comprador
    const payload = {
      eventId: eventData?.id,
      eventoId: eventData?.id, // duplicamos por compatibilidad de esquemas
      cantidad,
      nombre: compradorData?.nombre,
      apellido: compradorData?.apellido,
      email: compradorData?.email,
      comprador: compradorData, // agrupado en sub-objeto
      metodoPago: paymentMethod,
    };

    try {
      if (paymentMethod === 'MercadoPago') {
        const mpPayload = {
          eventId: eventData?.id || eventData?._id, // Aseguramos usar el ID correcto
          cantidad,
          datosComprador: compradorData,
        };
        const mpResponse = await createPaymentPreference(mpPayload);
        if (mpResponse && mpResponse.initPoint) {
          window.location.href = mpResponse.initPoint;
          return; // Detenemos la ejecución aquí porque el navegador va a redirigir a MP
        }
      }

      // Si no es MP o algo falla, tratamos de crear la orden local
      const response = await createOrder(payload);
      const orderId = response?.orderId || response?.order?._id;

      navigate('/compra/confirmacion', {
        state: {
          eventData,
          cantidad,
          compradorData,
          paymentMethod,
          orderId,
        },
      });
    } catch (err) {
      console.error('[CheckoutPaymentPage] Error creando orden o preferencia:', err.response?.data || err.message || err);
      const data = err.response?.data;
      setErrorMsg(`${data?.mensaje || 'Error con MercadoPago.'} ${data?.detalle ? `Detalle: ${data.detalle}` : ''}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading || !compradorData) {
    return (
      <div className={styles.loadingRoot}>
        <div className={styles.loadingPulse} />
      </div>
    );
  }

  return (
    <CheckoutLayout currentStep={3} eventData={eventData} cantidad={cantidad}>
      <div className={styles.stepCard}>
        {/* Encabezado con ícono */}
        <div className={styles.stepHeader}>
          <span className={styles.stepIcon}>
            <CreditCardIcon />
          </span>
          <h1 className={styles.stepTitle}>MÉTODO DE PAGO</h1>
        </div>
        <p className={styles.stepSubtitle}>Elegí cómo querés abonar tus entradas</p>

        {errorMsg && (
          <div className={styles.apiError} role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleConfirmar} className={styles.form}>
          {/* Campo select dropdown */}
          <div className={styles.field}>
            <label className={styles.label}>SELECCIONÁ TU MÉTODO DE PAGO</label>
            <div className={styles.cardsGrid}>
              <div 
                className={`${styles.paymentCard} ${paymentMethod === 'MercadoPago' ? styles.paymentCardActive : ''}`}
                onClick={() => setPaymentMethod('MercadoPago')}
              >
                <MercadoPagoIcon />
                <span className={styles.paymentCardTitle}>MercadoPago</span>
              </div>
              <div 
                className={`${styles.paymentCard} ${paymentMethod === 'Pago por QR' ? styles.paymentCardActive : ''}`}
                onClick={() => setPaymentMethod('Pago por QR')}
              >
                <QrCodeIcon />
                <span className={styles.paymentCardTitle}>Pago por QR</span>
              </div>
            </div>
          </div>



          {paymentMethod === 'Pago por QR' && (
            <div className={styles.cardMockBox}>
              <div className={styles.cardMockHeader}>
                <span className={styles.cardMockTitle}>PAGO POR QR</span>
              </div>
              <p className={styles.qrSubtitle}>Escaneá el código QR con tu app de banco o billetera virtual (Mercado Pago, Uala, etc.).</p>
              <div className={styles.qrPlaceholderBox}>
                <div className={styles.qrPlaceholderIcon}></div>
                <p>QR PRÓXIMAMENTE</p>
              </div>
            </div>
          )}

          {/* Botonera de acciones */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={handleVolver}
              disabled={isSubmitting}
            >
              VOLVER
            </button>
            <button
              type="submit"
              className={`${styles.ctaBtn} ${styles.confirmBtnViolet}`}
              disabled={!paymentMethod || isSubmitting}
            >
              {isSubmitting ? 'PROCESANDO...' : 'CONFIRMAR COMPRA ✓'}
            </button>
          </div>
        </form>
      </div>
    </CheckoutLayout>
  );
}
