import styles from './DynamicInstructions.module.css';

/**
 * DynamicInstructions — Componente para desplegar instrucciones dinámicas
 * según la modalidad de pago ('online' vs 'door').
 *
 * Props:
 *   paymentMethod {string} — 'online' | 'door' | 'efectivo' | 'transferencia'
 *   eventTime     {string} — Hora estimada del evento
 */
export default function DynamicInstructions({ paymentMethod = 'online', eventTime = '20:00 HS' }) {
  const isDoorPayment =
    paymentMethod === 'door' ||
    paymentMethod === 'Pago en Puerta' ||
    paymentMethod === 'efectivo';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.checkIcon}>✓</span>
        <h3 className={styles.title}>Instrucciones de Ingreso</h3>
      </div>

      <div className={`${styles.bannerHighlight} ${isDoorPayment ? styles.bannerDoor : styles.bannerOnline}`}>
        <span>{isDoorPayment ? "🚪" : "🎫"}</span>
        <span>
          {isDoorPayment
            ? "Tenés tu lugar reservado. Pagá tu entrada al llegar al evento presentando este QR."
            : "Entrada 100% abonada. Presentá este QR en la puerta para ingresar al evento."}
        </span>
      </div>

      <div className={styles.stepsList}>
        <div className={styles.stepItem}>
          <span className={styles.stepNum}>♦</span>
          <div>
            <div className={styles.stepTitle}>Captura de pantalla de esta entrada</div>
            <div className={styles.stepDesc}>
              Guardá una captura de esta pantalla en tu celular mostrando tu código QR y número de comprobante.
            </div>
          </div>
        </div>

        <div className={styles.dividerRow}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>o</span>
          <div className={styles.dividerLine} />
        </div>

        {isDoorPayment ? (
          <div className={styles.stepItem}>
            <span className={styles.stepNum}>♦</span>
            <div>
              <div className={styles.stepTitle}>Aboná en puerta (Efectivo o Transferencia)</div>
              <div className={styles.stepDesc}>
                Mostrá este QR en la boletería del evento para pagar tu entrada reservada al precio acordado.
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.stepItem}>
            <span className={styles.stepNum}>♦</span>
            <div>
              <div className={styles.stepTitle}>Validación con escáner QR</div>
              <div className={styles.stepDesc}>
                El equipo de recepción escaneará tu código QR directamente desde la pantalla de tu celular.
              </div>
            </div>
          </div>
        )}

        <div className={styles.stepItem}>
          <span className={styles.stepNum}>♦</span>
          <div>
            <div className={styles.stepTitle}>Presentá tu DNI si te lo solicitan</div>
            <div className={styles.stepDesc}>
              El personal de seguridad podría solicitar tu DNI para verificar la titularidad de la reserva.
            </div>
          </div>
        </div>

        <div className={styles.stepItem}>
          <span className={styles.stepNum}>♦</span>
          <div>
            <div className={styles.stepTitle}>¡Llegá a tiempo!</div>
            <div className={styles.stepDesc}>
              Te sugerimos estar en el lugar antes de las {eventTime} para evitar demoras en la fila.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
