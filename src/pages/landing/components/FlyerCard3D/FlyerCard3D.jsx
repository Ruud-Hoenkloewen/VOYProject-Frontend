import { useRef, useCallback } from "react";
import styles from "../../LandingPage.module.css";

/**
 * FlyerCard3D — Flyer individual con tilt 3D reactivo al mouse + esquinas bracket
 */
export default function FlyerCard3D({ show, isCenter, onCardClick }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const animFrameRef = useRef(null);

  // Intensidad de tilt: más fuerte en el central, suave en los laterales
  const intensity = isCenter ? 1 : 0.55;

  const handleMouseMove = useCallback((e) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      const rotX = -y * 6 * intensity;
      const rotY = x * 9 * intensity;
      const imgX = x * 4 * intensity;
      const imgY = y * 4 * intensity;

      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${isCenter ? 1.015 : 1.01})`;

      const img = card.querySelector('img');
      if (img) img.style.transform = `translate(${imgX}px, ${imgY}px) scale(1.05)`;

      // Glare: luz radial que sigue al cursor sobre el card
      const glare = glareRef.current;
      if (glare) {
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`;
        glare.style.opacity = '1';
      }
    });
  }, [intensity, isCenter]);

  const handleMouseLeave = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    const img = card.querySelector('img');
    if (img) img.style.transform = 'translate(0,0) scale(1)';
    const glare = glareRef.current;
    if (glare) glare.style.opacity = '0';
  }, []);

  return (
    <div className={`${styles.carouselFlyerWrap} ${isCenter ? styles.carouselFlyerCenter : styles.carouselFlyerSide}`}>
      {/* Click → modal si es el central; click lateral → navega al siguiente/anterior */}
      <div
        className={styles.flyerShadowWrapLink}
        onClick={() => onCardClick && onCardClick(show)}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label={`Ver evento: ${show.title}`}
        onKeyDown={e => e.key === 'Enter' && onCardClick && onCardClick(show)}
      >
        <div className={styles.flyerShadowWrap}>
          <div
            ref={cardRef}
            className={styles.flyerCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <span className={styles.flyerCornerTL} aria-hidden="true" />
            <span className={styles.flyerCornerBR} aria-hidden="true" />
            <img
              src={show.img}
              alt={show.alt}
              className={styles.flyerImg}
              draggable={false}
            />
            {/* Glare — luz especular que sigue al cursor */}
            <div ref={glareRef} className={styles.flyerGlare} aria-hidden="true" />
            {/* Nombre del evento — se mueve CON el tilt */}
            <div className={styles.flyerCardLabel}>
              <span className={`${styles.carouselStatusBadge} ${styles[`badge_${show.statusTone}`]}`}>
                {show.status}
              </span>
              <span className={styles.flyerCardLabelTitle}>{show.title}</span>
              <span className={styles.flyerCardLabelSub}>{show.subtitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
