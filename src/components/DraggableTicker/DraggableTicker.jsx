import React, { useRef, useEffect, useState } from 'react';
import styles from './DraggableTicker.module.css';

const DEFAULT_ITEMS = [
  "SAN MIGUEL DE TUCUMÁN",
  "VOY PROJECT",
  "SAN MIGUEL DE TUCUMÁN",
  "VOY PROJECT",
  "SAN MIGUEL DE TUCUMÁN",
  "VOY PROJECT",
  "SAN MIGUEL DE TUCUMÁN",
  "VOY PROJECT",
];

export default function DraggableTicker({ items = DEFAULT_ITEMS, speed = 0.8 }) {
  const tickerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const animFrameRef = useRef(null);

  // Física de inercia/aceleración al soltar (fling inertia)
  const currentSpeedRef = useRef(speed);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  // Array repetido 4 veces para loop infinito fluido al arrastrar
  const repeatedItems = [...items, ...items, ...items, ...items];

  // Auto-scroll loop continuo con desaceleración física gradual
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;

    const loop = () => {
      if (!isDraggingRef.current && el) {
        // Desacelerar gradualmente la velocidad de inercia hacia la velocidad base (speed)
        const diff = currentSpeedRef.current - speed;
        if (Math.abs(diff) > 0.02) {
          // Fricción/amortiguación física (96% velocidad previa + 4% velocidad objetivo)
          currentSpeedRef.current = currentSpeedRef.current * 0.96 + speed * 0.04;
        } else {
          currentSpeedRef.current = speed;
        }

        el.scrollLeft += currentSpeedRef.current;

        // Reset seamless para loop infinito
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += halfWidth;
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [speed]);

  // Medidor de velocidad del gesto (pixels/frame) para inercia al soltar
  const trackVelocity = (pageX) => {
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 4) {
      // Delta en X (positivo si se arrastra a la izquierda / scroll a la derecha)
      const dx = lastXRef.current - pageX;
      // Convertir a velocidad estimada por frame (~16ms)
      const instantVelocity = (dx / dt) * 16 * 1.5;
      // Promedio móvil ponderado para capturar impulsos veloces
      currentSpeedRef.current = currentSpeedRef.current * 0.25 + instantVelocity * 0.75;
      // Clampear velocidad máxima (hasta 35px/frame)
      currentSpeedRef.current = Math.max(-35, Math.min(35, currentSpeedRef.current));

      lastXRef.current = pageX;
      lastTimeRef.current = now;
    }
  };

  // Handlers para Mouse Drag
  const handleMouseDown = (e) => {
    const el = tickerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    startScrollLeftRef.current = el.scrollLeft;

    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    currentSpeedRef.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const el = tickerRef.current;
    if (!el) return;
    e.preventDefault();

    trackVelocity(e.pageX);

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    let targetScroll = startScrollLeftRef.current - walk;

    const halfWidth = el.scrollWidth / 2;
    if (targetScroll >= halfWidth) {
      targetScroll -= halfWidth;
      startXRef.current = e.pageX - el.offsetLeft;
      startScrollLeftRef.current = targetScroll;
    } else if (targetScroll <= 0) {
      targetScroll += halfWidth;
      startXRef.current = e.pageX - el.offsetLeft;
      startScrollLeftRef.current = targetScroll;
    }

    el.scrollLeft = targetScroll;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Handlers para Touch Drag (móvil)
  const handleTouchStart = (e) => {
    const el = tickerRef.current;
    if (!el || !e.touches[0]) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.touches[0].pageX - el.offsetLeft;
    startScrollLeftRef.current = el.scrollLeft;

    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = performance.now();
    currentSpeedRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !e.touches[0]) return;
    const el = tickerRef.current;
    if (!el) return;

    trackVelocity(e.touches[0].pageX);

    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    let targetScroll = startScrollLeftRef.current - walk;

    const halfWidth = el.scrollWidth / 2;
    if (targetScroll >= halfWidth) {
      targetScroll -= halfWidth;
      startXRef.current = e.touches[0].pageX - el.offsetLeft;
      startScrollLeftRef.current = targetScroll;
    } else if (targetScroll <= 0) {
      targetScroll += halfWidth;
      startXRef.current = e.touches[0].pageX - el.offsetLeft;
      startScrollLeftRef.current = targetScroll;
    }

    el.scrollLeft = targetScroll;
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  return (
    <div
      ref={tickerRef}
      className={`${styles.tickerWrapper} ${isDragging ? styles.grabbing : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Cinta informativa interactiva"
    >
      <div className={styles.tickerTrack}>
        {repeatedItems.map((item, i) => (
          <span key={i} className={styles.tickerItem}>
            <span className={styles.diamond}>♦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
