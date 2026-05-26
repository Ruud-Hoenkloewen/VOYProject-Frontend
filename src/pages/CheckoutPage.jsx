import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchEventById } from '../services/eventService';
import CheckoutLayout from '../components/checkout/CheckoutLayout';
import styles from './CheckoutPage.module.css';

/**
 * CheckoutPage — Paso 1: Elegí tus entradas
 * Ruta: /events/:id/checkout
 */
export default function CheckoutPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [eventData, setEventData] = useState(location.state?.eventData ?? null);
  const [cantidad,  setCantidad]  = useState(1);
  const [loading,   setLoading]   = useState(!eventData);

  // Si llegamos sin state (navegación directa), cargamos el evento
  useEffect(() => {
    if (!eventData && id) {
      fetchEventById(id)
        .then(setEventData)
        .catch(() => navigate('/', { replace: true }))
        .finally(() => setLoading(false));
    }
  }, [id, eventData, navigate]);

  const isSoldOut = eventData?.status === 'AGOTADO';
  // Usa el stock real del evento; si no está disponible cae a 10 por seguridad
  const maxStock  = Math.min(eventData?.stock ?? 10, 10);

  function decrement() { setCantidad(q => Math.max(1, q - 1)); }
  function increment() { setCantidad(q => Math.min(maxStock, q + 1)); }

  function handleContinuar() {
    navigate(`/events/${id}/checkout/datos`, {
      state: { eventData, cantidad },
    });
  }

  if (loading) {
    return (
      <div className={styles.loadingRoot}>
        <div className={styles.loadingPulse} />
      </div>
    );
  }

  return (
    <CheckoutLayout currentStep={1} eventData={eventData} cantidad={cantidad}>
      <div className={styles.stepCard}>

        {/* Título */}
        <div className={styles.stepHeader}>
          <span className={styles.stepIcon}>🎫</span>
          <h1 className={styles.stepTitle}>ELEGÍ TUS ENTRADAS</h1>
        </div>
        <p className={styles.stepSubtitle}>Seleccioná la cantidad que querés comprar.</p>

        {/* Selector de entrada */}
        <div className={styles.ticketRow}>
          <div className={styles.ticketInfo}>
            <span className={styles.ticketType}>ENTRADA GENERAL</span>
            <span className={styles.ticketPrice}>{eventData?.price} / entrada</span>
          </div>
          <div className={styles.quantityControl}>
            <button
              className={styles.qtyBtn}
              onClick={decrement}
              disabled={cantidad === 1}
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className={styles.qtyValue}>{cantidad}</span>
            <button
              className={styles.qtyBtn}
              onClick={increment}
              disabled={cantidad >= maxStock || isSoldOut}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>

        {/* Nota legal */}
        <p className={styles.legalNote}>
          {eventData?.rawPrice === 0
            ? "Evento gratuito · Registrá tu asistencia"
            : `Máximo ${maxStock} entradas por compra · Apto todo público`
          }
        </p>

        {/* CTA */}
        <button
          className={styles.ctaBtn}
          onClick={handleContinuar}
          disabled={isSoldOut}
        >
          CONTINUAR →
        </button>

      </div>
    </CheckoutLayout>
  );
}
