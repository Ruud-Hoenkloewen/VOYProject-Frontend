import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HowItWorksModal.module.css";
import { TicketIcon, HeartIcon, ZapIcon } from "../icons";

export default function HowItWorksModal({ onClose }) {
  const navigate = useNavigate();

  // Escuchar tecla Escape para cerrar modal y bloquear scroll de fondo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const steps = [
    {
      step: "01",
      icon: <ZapIcon size={24} />,
      title: "EXPLORÁ LA MOVIDA",
      desc: "Descubrí la cartelera de eventos emergentes, recitales e información de venues en Tucumán y el NOA."
    },
    {
      step: "02",
      icon: <TicketIcon size={24} />,
      title: "ENTRADAS SIN FILA",
      desc: "Comprá tus tickets digitales y obtené tu código QR directo en tu teléfono para ingresar al toque."
    },
    {
      step: "03",
      icon: <HeartIcon size={24} />,
      title: "SUMATE A LA ESCENA",
      desc: "Seguí a tus bandas preferidas, guardá tus shows imperdibles y creá la identidad de tu perfil."
    }
  ];

  return (
    <div className={styles.overlay} onClick={onClose} aria-hidden="true">
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
      >
        <button 
          className={styles.closeBtn} 
          onClick={onClose} 
          aria-label="Cerrar ventana cómo funciona"
        >
          ✕
        </button>

        <div className={styles.header}>
          <span className={styles.eyebrow}>♦ GUÍA VOY PROJECT ♦</span>
          <h2 id="how-it-works-title" className={styles.title}>¿CÓMO FUNCIONA?</h2>
          <p className={styles.subtitle}>
            Una plataforma pensada por y para la escena de música independiente.
          </p>
        </div>

        <div className={styles.grid}>
          {steps.map((item) => (
            <div key={item.step} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.stepBadge}>{item.step}</span>
                <span className={styles.iconBox}>{item.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── APARTADO DE SOPORTE & ASISTENCIA POR CORREO ── */}
        <div className={styles.supportBox}>
          <div className={styles.supportInfo}>
            <span className={styles.supportBadge}>💬 SOPORTE Y TICKETS</span>
            <h4 className={styles.supportTitle}>¿Necesitás ayuda con tu entrada o tenés dudas?</h4>
            <p className={styles.supportDesc}>
              Escribinos directamente a nuestro equipo de atención y te responderemos a la brevedad.
            </p>
          </div>
          <a 
            href="mailto:soporte@voyproject.com?subject=Consulta%20o%20Ayuda%20VOY%20Project"
            className={styles.supportEmailBtn}
          >
            ✉ soporte@voyproject.com
          </a>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.ctaBtn}
            onClick={() => {
              onClose();
              navigate("/events");
            }}
          >
            EXPLORAR CARTELERA →
          </button>
        </div>
      </div>
    </div>
  );
}
