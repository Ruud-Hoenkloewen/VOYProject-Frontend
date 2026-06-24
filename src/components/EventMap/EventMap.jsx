import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPinIcon } from "../icons";
import styles from "./EventMap.module.css";

// Ícono personalizado para el pin — Leaflet no trae estilos propios por
// default en builds con Vite, así que armamos uno simple en SVG inline.
const pinIcon = L.divIcon({
  className: styles.pinIcon,
  html: `<div class="${styles.pinDot}"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

/**
 * COMPONENTE: EventMap
 * Mapa interactivo con un pin en las coordenadas del evento.
 *
 * - Si `coordenadas` tiene lat/lng válidos → renderiza el mapa centrado en el pin.
 * - Si no hay coordenadas → no renderiza nada (el padre debe mostrar
 *   la dirección en texto como fallback, sin romper el layout).
 *
 * @param {{lat: number, lng: number} | null} coordenadas
 * @param {string} venue - Nombre del lugar, mostrado en el popup del pin.
 * @param {string} direccion - Dirección en texto, mostrada en el popup.
 */
export default function EventMap({ coordenadas, venue, direccion }) {
  // Sin coordenadas válidas: no se renderiza el mapa.
  // El componente padre es responsable de mostrar la dirección en texto.
  if (!coordenadas || coordenadas.lat == null || coordenadas.lng == null) {
    return null;
  }

  const position = [coordenadas.lat, coordenadas.lng];

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={pinIcon}>
          <Popup>
            <strong>{venue || "Lugar del evento"}</strong>
            {direccion && <div>{direccion}</div>}
          </Popup>
        </Marker>
      </MapContainer>

      {direccion && (
        <div className={styles.addressRow}>
          <MapPinIcon size={14} />
          <span>{direccion}</span>
        </div>
      )}
    </div>
  );
}
