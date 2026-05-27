import { useNavigate } from 'react-router-dom';
import styles from './CheckoutLayout.module.css';

// ── Iconos inline ────────────────────────────────────────────────────────────
// Logo "V" de VOY Project
const VoyLogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="10,15 50,85 90,15 75,15 50,58 25,15"
      fill="currentColor"
    />
  </svg>
);

const ArrowLeftSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const STEPS = [
  { number: 1, label: 'ENTRADAS' },
  { number: 2, label: 'TUS DATOS' },
  { number: 3, label: 'PAGO' },
  { number: 4, label: 'CONFIRMACIÓN' },
];

function fmt(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
}

// ── Componente ────────────────────────────────────────────────────────────────
/**
 * CheckoutLayout
 * Envuelve todos los pasos del flujo de compra.
 * Renderiza el header fijo, el stepper y el sidebar de resumen.
 * Los 4 pasos solo reemplazan el contenido de la columna izquierda (children).
 *
 * @prop {number}  currentStep  - Paso activo (1-4)
 * @prop {object}  eventData    - Evento normalizado de fetchEventById
 * @prop {number}  cantidad     - Cantidad de entradas seleccionadas
 * @prop {React.ReactNode} children - Contenido del paso actual
 */
export default function CheckoutLayout({ currentStep, eventData, cantidad = 1, children }) {
  const navigate = useNavigate();

  // Calcular precios — rawPrice se agrega en eventService (ver nota)
  const precioUnitario = eventData?.rawPrice ?? 0;
  const subtotal       = precioUnitario * cantidad;
  const cargoServicio  = Math.round(subtotal * 0.10);
  const total          = subtotal + cargoServicio;

  const showSidebar = currentStep < 4;

  return (
    <div className={styles.root}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label="Volver"
          >
            <VoyLogo />
          </button>
          <div className={styles.headerEventInfo}>
            <span className={styles.headerEyebrow}>COMPRANDO ENTRADAS PARA</span>
            <span className={styles.headerEventName}>{eventData?.title ?? '...'}</span>
          </div>
        </div>
        <button
          className={styles.backTextBtn}
          onClick={() => navigate(-1)}
        >
          <ArrowLeftSmall />
          VOLVER ATRÁS
        </button>
      </header>

      {/* ── STEPPER ────────────────────────────────────────────────────────── */}
      <div className={styles.stepperWrapper}>
        <div className={styles.stepper}>
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isActive    = currentStep === step.number;
            return (
              <div key={step.number} className={styles.stepItem}>
                {idx > 0 && (
                  <div className={`${styles.stepLine} ${isCompleted ? styles.stepLineCompleted : ''}`} />
                )}
                <div className={styles.stepIndicator}>
                  <div className={`
                    ${styles.stepBox}
                    ${isActive    ? styles.stepBoxActive    : ''}
                    ${isCompleted ? styles.stepBoxCompleted : ''}
                  `}>
                    {isCompleted ? '✓' : step.number}
                  </div>
                  <span className={`
                    ${styles.stepLabel}
                    ${isActive    ? styles.stepLabelActive    : ''}
                    ${isCompleted ? styles.stepLabelCompleted : ''}
                  `}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main className={`${styles.main} ${!showSidebar ? styles.mainFull : ''}`}>

        {/* Columna izquierda — contenido del paso */}
        <div className={styles.content}>
          {children}
        </div>

        {/* Columna derecha — sidebar de resumen (pasos 1-3) */}
        {showSidebar && (
          <aside className={styles.sidebar}>

            {/* Imagen full-width con gradiente y artistas superpuestos */}
            <div className={styles.sidebarHero}>
              {eventData?.imageUrl ? (
                <img
                  src={eventData.imageUrl}
                  alt={eventData.title}
                  className={styles.sidebarHeroImage}
                />
              ) : (
                <div className={styles.sidebarHeroFallback} />
              )}
              {/* Gradiente oscuro que cubre la mitad inferior de la imagen */}
              <div className={styles.sidebarHeroOverlay} />
              {/* Artistas superpuestos en la esquina inferior izquierda */}
              <div className={styles.sidebarHeroArtists}>
                <p className={styles.artistNames}>
                  {eventData?.artists?.map(a => a.nombre).join(' | ') ?? ''}
                </p>
              </div>
            </div>

            {/* Chips de género */}
            {eventData?.genres?.length > 0 && (
              <div className={styles.sidebarGenres}>
                {eventData.genres.map(g => (
                  <span key={g} className={styles.genreChip}>{g}</span>
                ))}
              </div>
            )}

            {/* Nombre del evento */}
            <h2 className={styles.sidebarEventName}>{eventData?.title}</h2>

            {/* Fecha y venue */}
            <div className={styles.sidebarMeta}>
              <div className={styles.sidebarMetaRow}>
                <span className={styles.metaIcon}><CalendarIcon /></span>
                <span>{eventData?.date} · {eventData?.time}</span>
              </div>
              <div className={styles.sidebarMetaRow}>
                <span className={styles.metaIcon}><PinIcon /></span>
                <span>{eventData?.venue}</span>
              </div>
            </div>

            <div className={styles.sidebarDivider} />

            {/* Desglose de precios */}
            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>Entrada General × {cantidad}</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Cargo por servicio</span>
                <span>{fmt(cargoServicio)}</span>
              </div>
              <div className={`${styles.priceRow} ${styles.priceRowTotal}`}>
                <span>TOTAL</span>
                <span className={styles.totalAmount}>{fmt(total)}</span>
              </div>
            </div>

          </aside>
        )}
      </main>
    </div>
  );
}
