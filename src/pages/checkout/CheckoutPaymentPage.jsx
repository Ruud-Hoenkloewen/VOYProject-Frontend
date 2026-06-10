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

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
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

  // Campos del mock de tarjeta (solo validación visual — el pago real va a MP)
  const [cardFields, setCardFields] = useState({ titular: '', numero: '', vencimiento: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState({});

  function handleCardField(field, value) {
    setCardFields((prev) => ({ ...prev, [field]: value }));
    if (cardErrors[field]) setCardErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validateCard() {
    const errs = {};
    if (!cardFields.titular.trim())      errs.titular     = 'Requerido';
    if (cardFields.numero.replace(/\s/g, '').length < 13) errs.numero = 'Número inválido';
    if (!/^\d{2}\/\d{2}$/.test(cardFields.vencimiento.trim())) errs.vencimiento = 'Formato MM/AA';
    if (cardFields.cvv.length < 3)       errs.cvv         = 'Requerido';
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ¿El form de tarjeta está completo? (para controlar el botón)
  const isCardComplete =
    paymentMethod !== 'Tarjeta de crédito / débito' ||
    (cardFields.titular.trim() &&
     cardFields.numero.replace(/\s/g, '').length >= 13 &&
     /^\d{2}\/\d{2}$/.test(cardFields.vencimiento.trim()) &&
     cardFields.cvv.length >= 3);

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
    if (paymentMethod === 'Tarjeta de crédito / débito' && !validateCard()) return;

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
      if (paymentMethod === 'Tarjeta de crédito / débito') {
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
      console.warn('[CheckoutPaymentPage] Error creando orden, procediendo con mock para pruebas frontend:', err.response?.data || err.message || err);
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
                <option value="Tarjeta de crédito / débito">Tarjeta de crédito / débito</option>
                <option value="Pago por QR">Pago por QR</option>
              </select>
              <div className={styles.selectChevron} aria-hidden="true">▼</div>
            </div>
          </div>

          {paymentMethod === 'Tarjeta de crédito / débito' && (
            <div className={styles.cardMockBox}>
              <div className={styles.cardMockHeader}>
                <span className={styles.cardMockIcon}><CardIcon /></span>
                <span className={styles.cardMockTitle}>DATOS DE TARJETA</span>
              </div>
              <div className={styles.cardMockGrid}>
                <div className={styles.cardMockField}>
                  <label className={styles.cardMockLabel}>NOMBRE DEL TITULAR</label>
                  <input
                    type="text"
                    className={`${styles.cardMockInput} ${cardErrors.titular ? styles.cardMockInputError : ''}`}
                    placeholder="Tal como figura en la tarjeta"
                    value={cardFields.titular}
                    onChange={(e) => handleCardField('titular', e.target.value)}
                    autoComplete="cc-name"
                  />
                  {cardErrors.titular && <span className={styles.cardFieldError}>{cardErrors.titular}</span>}
                </div>
                <div className={styles.cardMockField}>
                  <label className={styles.cardMockLabel}>NÚMERO DE TARJETA</label>
                  <input
                    type="text"
                    className={`${styles.cardMockInput} ${cardErrors.numero ? styles.cardMockInputError : ''}`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardFields.numero}
                    onChange={(e) => {
                      // Formato automático con espacios cada 4 dígitos
                      const raw = e.target.value.replace(/\D/g, '');
                      const formatted = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
                      handleCardField('numero', formatted);
                    }}
                    autoComplete="cc-number"
                  />
                  {cardErrors.numero && <span className={styles.cardFieldError}>{cardErrors.numero}</span>}
                </div>
                <div className={styles.cardMockFieldHalf}>
                  <div className={styles.cardMockField}>
                    <label className={styles.cardMockLabel}>VENCIMIENTO</label>
                    <input
                      type="text"
                      className={`${styles.cardMockInput} ${cardErrors.vencimiento ? styles.cardMockInputError : ''}`}
                      placeholder="MM/AA"
                      maxLength={5}
                      value={cardFields.vencimiento}
                      onChange={(e) => {
                        // Formato automático MM/AA
                        const raw = e.target.value.replace(/\D/g, '');
                        const formatted = raw.length > 2 ? `${raw.slice(0,2)}/${raw.slice(2,4)}` : raw;
                        handleCardField('vencimiento', formatted);
                      }}
                      autoComplete="cc-exp"
                    />
                    {cardErrors.vencimiento && <span className={styles.cardFieldError}>{cardErrors.vencimiento}</span>}
                  </div>
                  <div className={styles.cardMockField}>
                    <label className={styles.cardMockLabel}>CVV</label>
                    <input
                      type="text"
                      className={`${styles.cardMockInput} ${cardErrors.cvv ? styles.cardMockInputError : ''}`}
                      placeholder="123"
                      maxLength={4}
                      value={cardFields.cvv}
                      onChange={(e) => handleCardField('cvv', e.target.value.replace(/\D/g, ''))}
                      autoComplete="cc-csc"
                    />
                    {cardErrors.cvv && <span className={styles.cardFieldError}>{cardErrors.cvv}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

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
              disabled={!paymentMethod || !isCardComplete || isSubmitting}
            >
              {isSubmitting ? 'PROCESANDO...' : 'CONFIRMAR COMPRA ✓'}
            </button>
          </div>
        </form>
      </div>
    </CheckoutLayout>
  );
}
