import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CreditCard, QrCode, Store, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { fetchEventById } from '../../services/eventService';
import { createOrder, createPaymentPreference } from '../../services/orderService';
import CheckoutLayout from './components/CheckoutLayout/CheckoutLayout';
import styles from './CheckoutPaymentPage.module.css';

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

    const precioUnitario = Number(eventData?.precio) || 0;
    const calcSubtotal = precioUnitario * cantidad;
    const calcTotal = calcSubtotal;

    const payload = {
      eventId: eventData?.id || eventData?._id,
      eventoId: eventData?.id || eventData?._id,
      cantidad,
      subtotal: calcSubtotal,
      total: calcTotal,
      datosComprador: {
        nombre: compradorData?.nombre || 'Usuario',
        apellido: compradorData?.apellido || 'VOY',
        email: compradorData?.email || 'usuario@voy.com',
        dni: compradorData?.dni || '0',
      },
      metodoPago: paymentMethod,
    };

    try {
      if (paymentMethod === 'MercadoPago') {
        const mpPayload = {
          eventId: eventData?.id || eventData?._id,
          cantidad,
          datosComprador: payload.datosComprador,
        };
        const mpResponse = await createPaymentPreference(mpPayload);
        if (mpResponse && mpResponse.initPoint) {
          window.location.href = mpResponse.initPoint;
          return;
        }
      }

      const response = await createOrder(payload);
      const orderId = response?.numeroOrden || response?.order?.numeroOrden || response?.orderId || response?._id;

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
      const msg = data?.mensaje || err.message || 'Error al crear la orden.';
      const detail = data?.detalle ? ` (Detalle: ${data.detalle})` : '';
      setErrorMsg(`${msg}${detail}`);
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
            <CreditCard size={24} color="#00FF9F" />
          </span>
          <h2 className={styles.stepTitle}>MÉTODO DE PAGO</h2>
        </div>
        <p className={styles.stepSubtitle}>Elegí cómo querés abonar tus entradas</p>

        {errorMsg && (
          <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleConfirmar} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>SELECCIONÁ TU MÉTODO DE PAGO</label>
            <div className={styles.cardsGrid}>
              <div 
                className={`${styles.paymentCard} ${paymentMethod === 'MercadoPago' ? styles.paymentCardActive : ''}`}
                onClick={() => setPaymentMethod('MercadoPago')}
              >
                <ShieldCheck size={28} />
                <span className={styles.paymentCardTitle}>MercadoPago</span>
              </div>
              <div 
                className={`${styles.paymentCard} ${paymentMethod === 'Pago por QR' ? styles.paymentCardActive : ''}`}
                onClick={() => setPaymentMethod('Pago por QR')}
              >
                <QrCode size={28} />
                <span className={styles.paymentCardTitle}>Pago por QR</span>
              </div>
              <div 
                className={`${styles.paymentCard} ${paymentMethod === 'Pago en Puerta' ? styles.paymentCardActive : ''}`}
                onClick={() => setPaymentMethod('Pago en Puerta')}
              >
                <Store size={28} />
                <span className={styles.paymentCardTitle}>Pago en Puerta</span>
              </div>
            </div>
          </div>

          {/* Caja explicativa según el método elegido */}
          {paymentMethod === 'MercadoPago' && (
            <div style={{
              backgroundColor: 'rgba(15, 17, 23, 0.8)',
              border: '1px solid rgba(0, 255, 159, 0.25)',
              borderRadius: '10px',
              padding: '1.25rem',
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <span style={{ color: '#00FF9F', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> ONLINE / ACREDITACIÓN INMEDIATA
              </span>
              <p style={{ color: '#a0a5b5', fontSize: '0.84rem', margin: 0, lineHeight: '1.5' }}>
                Serás redirigido de forma segura a Mercado Pago para abonar con tarjeta de crédito, débito o dinero disponible en tu cuenta.
              </p>
            </div>
          )}

          {paymentMethod === 'Pago por QR' && (
            <div style={{
              backgroundColor: 'rgba(15, 17, 23, 0.8)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              borderRadius: '10px',
              padding: '1.25rem',
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.75rem',
            }}>
              <span style={{
                backgroundColor: '#00E5FF22',
                color: '#00E5FF',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.25rem 0.68rem',
                borderRadius: '6px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <QrCode size={14} /> PAGO CON CÓDIGO QR MP
              </span>
              <p style={{ color: '#a0a5b5', fontSize: '0.84rem', margin: 0, lineHeight: '1.5', maxWidth: '420px' }}>
                Al hacer clic en <strong>CONFIRMAR COMPRA</strong>, se generará el código QR dinámico de la orden para que lo escanees al instante desde la app de tu banco o Mercado Pago.
              </p>
            </div>
          )}

          {paymentMethod === 'Pago en Puerta' && (
            <div style={{
              backgroundColor: 'rgba(15, 17, 23, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '10px',
              padding: '1.25rem',
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  backgroundColor: '#f59e0b22',
                  color: '#f59e0b',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  RESERVA ONLINE
                </span>
                <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                  PAGO EN PUERTA / EFECTIVO
                </span>
              </div>
              <p style={{ color: '#a0a5b5', fontSize: '0.84rem', margin: 0, lineHeight: '1.5' }}>
                Reservás tus entradas ahora sin pagar por adelantado. Presentás tu código QR en la entrada del evento el día del show y abonás en efectivo o transferencia directamente a los organizadores.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#00FF9F',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}>
                <CheckCircle2 size={16} /> Se generará un ticket digital con estado PENDIENTE en tu perfil.
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
              <ArrowLeft size={16} style={{ marginRight: 8 }} />
              VOLVER
            </button>
            <button
              type="submit"
              className={`${styles.ctaBtn} ${styles.confirmBtnViolet}`}
              disabled={!paymentMethod || isSubmitting}
            >
              {isSubmitting ? 'PROCESANDO...' : <>CONFIRMAR COMPRA <CheckCircle2 size={16} style={{ marginLeft: 8 }} /></>}
            </button>
          </div>
        </form>
      </div>
    </CheckoutLayout>
  );
}
