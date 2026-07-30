import React from 'react';
import styles from './EventMapPreview.module.css';
import { MapPinIcon } from '../icons';

export default function EventMapPreview({ venue = '', height = 240, showDirectionsBtn = true }) {
  if (!venue || !venue.trim()) {
    return (
      <div className={styles.mapContainer} style={{ height }}>
        <div className={styles.fallbackBox}>
          <span>Escribí la dirección del venue para generar la vista previa del mapa.</span>
        </div>
      </div>
    );
  }

  const cleanVenue = venue.trim();
  // Ensure location includes Tucumán for map precision if not mentioned
  const querySearch = cleanVenue.toLowerCase().includes('tucumán') || cleanVenue.toLowerCase().includes('tucuman')
    ? cleanVenue
    : `${cleanVenue}, San Miguel de Tucumán, Argentina`;

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(querySearch)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(querySearch)}`;

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <span className={styles.addressText}>
          <MapPinIcon className={styles.addressIcon} size={16} />
          {cleanVenue}
        </span>
        {showDirectionsBtn && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directionsBtn}
          >
            <span>CÓMO LLEGAR ↗</span>
          </a>
        )}
      </div>
      <div className={styles.iframeWrapper} style={{ height }}>
        <iframe
          title={`Mapa de ${cleanVenue}`}
          src={mapEmbedUrl}
          className={styles.mapIframe}
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}
