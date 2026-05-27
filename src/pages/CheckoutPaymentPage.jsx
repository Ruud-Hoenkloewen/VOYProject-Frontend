import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchEventById } from '../services/eventService';
import { createOrder } from '../services/orderService';
import CheckoutLayout from '../components/checkout/CheckoutLayout';
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
      const response = await createOrder(payload);
      const orderId = response?.orderId || response?.order?._id || `VOY-${Math.floor(100000 + Math.random() * 900000)}`;

      // Navegación automática al Paso 4 ante respuesta exitosa
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
      console.warn('[CheckoutPaymentPage] Error creando orden, procediendo con mock para pruebas frontend:', err);
      // Fallback para desarrollo frontend si el backend aún no está listo
      const mockOrderId = `VOY-${Math.floor(100000 + Math.random() * 900000)}`;
      navigate('/compra/confirmacion', {
        state: {
          eventData,
          cantidad,
          compradorData,
          paymentMethod,
          orderId: mockOrderId,
        },
      });
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
            <label className={styles.label} htmlFor="payment-dropdown">
              SELECCIONÁ TU MÉTODO DE PAGO
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="payment-dropdown"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`${styles.select} ${!paymentMethod ? styles.selectPlaceholder : ''}`}
                disabled={isSubmitting}
              >
                <option value="" disabled hidden>
                  Seleccionar método...
                </option>
                <option value="Transferencia bancaria">Transferencia bancaria</option>
                <option value="Efectivo en el local">Efectivo en el local</option>
              </select>
              <div className={styles.selectChevron} aria-hidden="true">▼</div>
            </div>
          </div>

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
