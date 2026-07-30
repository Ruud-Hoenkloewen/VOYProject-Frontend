import React from 'react';
import EventCard from '../../design-system/composites/EventCard/EventCard';
import styles from './EventGrid.module.css';

/**
 * Componente: EventGrid
 * Mapea la lista de eventos filtrados en una grilla responsive.
 * 
 * @param {Object} props
 * @param {Array} props.events - Lista de eventos a renderizar
 * @param {boolean} [props.isLoading] - Estado de carga
 */
export default function EventGrid({ events = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <EventCard key={`skeleton-${idx}`} isLoading={true} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {events.map((evt) => (
        <EventCard key={evt.id || evt._id} {...evt} />
      ))}
    </div>
  );
}
