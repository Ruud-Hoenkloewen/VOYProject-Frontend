import React, { useRef, useEffect, useState } from 'react';
import EventCard from '../../../../design-system/composites/EventCard/EventCard';
import styles from './DraggableEventsTicker.module.css';

export default function DraggableEventsTicker({ isLoading, previewEvents = [], speed = 0.6 }) {
  const tickerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const animFrameRef = useRef(null);
  const hasMovedRef = useRef(false);

  // Física de inercia/aceleración al soltar (fling inertia)
  const currentSpeedRef = useRef(speed);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  // Auto-scroll loop continuo con desaceleración física gradual
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;

    const loop = () => {
      if (!isDraggingRef.current && el) {
        // Desacelerar gradualmente la velocidad de inercia hacia la velocidad base
        const diff = currentSpeedRef.current - speed;
        if (Math.abs(diff) > 0.02) {
          currentSpeedRef.current = currentSpeedRef.current * 0.96 + speed * 0.04;
        } else {
          currentSpeedRef.current = speed;
        }

        el.scrollLeft += currentSpeedRef.current;

        // Reset seamless para loop infinito
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0) {
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft -= halfWidth;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += halfWidth;
          }
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

  // Medidor de velocidad del gesto
  const trackVelocity = (pageX) => {
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 4) {
      const dx = lastXRef.current - pageX;
      const instantVelocity = (dx / dt) * 16 * 1.5;
      currentSpeedRef.current = currentSpeedRef.current * 0.25 + instantVelocity * 0.75;
      currentSpeedRef.current = Math.max(-35, Math.min(35, currentSpeedRef.current));

      lastXRef.current = pageX;
      lastTimeRef.current = now;
    }
  };

  // Handlers Mouse
  const handleMouseDown = (e) => {
    const el = tickerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
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

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }

    trackVelocity(e.pageX);

    let targetScroll = startScrollLeftRef.current - walk;
    const halfWidth = el.scrollWidth / 2;
    if (halfWidth > 0) {
      if (targetScroll >= halfWidth) {
        targetScroll -= halfWidth;
        startXRef.current = e.pageX - el.offsetLeft;
        startScrollLeftRef.current = targetScroll;
      } else if (targetScroll <= 0) {
        targetScroll += halfWidth;
        startXRef.current = e.pageX - el.offsetLeft;
        startScrollLeftRef.current = targetScroll;
      }
    }

    el.scrollLeft = targetScroll;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Handlers Touch (móvil)
  const handleTouchStart = (e) => {
    const el = tickerRef.current;
    if (!el || !e.touches[0]) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
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

    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;

    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }

    trackVelocity(e.touches[0].pageX);

    let targetScroll = startScrollLeftRef.current - walk;
    const halfWidth = el.scrollWidth / 2;
    if (halfWidth > 0) {
      if (targetScroll >= halfWidth) {
        targetScroll -= halfWidth;
        startXRef.current = e.touches[0].pageX - el.offsetLeft;
        startScrollLeftRef.current = targetScroll;
      } else if (targetScroll <= 0) {
        targetScroll += halfWidth;
        startXRef.current = e.touches[0].pageX - el.offsetLeft;
        startScrollLeftRef.current = targetScroll;
      }
    }

    el.scrollLeft = targetScroll;
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Renderizar la lista duplicada para loop suave
  const eventsList = isLoading ? [1, 2, 3, 4] : previewEvents;

  return (
    <div
      ref={tickerRef}
      className={`${styles.eventsTickerContainer} ${isDragging ? styles.grabbing : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className={styles.eventsTrack}>
        {/* Set principal */}
        {eventsList.map((evt, i) =>
          isLoading ? (
            <div key={`skel-1-${i}`} className={styles.eventsTickerItem}>
              <EventCard isLoading={true} />
            </div>
          ) : (
            <div key={`set1-${evt.id}`} className={styles.eventsTickerItem}>
              <EventCard
                id={evt.id}
                title={evt.title}
                date={evt.date}
                time={evt.time}
                venue={evt.venue}
                price={evt.price}
                genres={evt.genres}
                status={evt.status}
                statusTone={evt.statusTone}
                imageUrl={evt.imageUrl}
              />
            </div>
          )
        )}
        {/* Duplicado para loop infinito */}
        {eventsList.map((evt, i) =>
          isLoading ? (
            <div key={`skel-2-${i}`} className={styles.eventsTickerItem} aria-hidden="true">
              <EventCard isLoading={true} />
            </div>
          ) : (
            <div key={`set2-${evt.id}`} className={styles.eventsTickerItem} aria-hidden="true">
              <EventCard
                id={evt.id}
                title={evt.title}
                date={evt.date}
                time={evt.time}
                venue={evt.venue}
                price={evt.price}
                genres={evt.genres}
                status={evt.status}
                statusTone={evt.statusTone}
                imageUrl={evt.imageUrl}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
