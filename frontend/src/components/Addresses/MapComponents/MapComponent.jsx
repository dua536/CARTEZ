import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapComponent.module.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon for the current location
const customMarkerIcon = L.divIcon({
  html: `<div style="background: linear-gradient(135deg, #69f6b8, #06b77f); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 3px solid #0e0e0e; box-shadow: 0 0 20px rgba(105, 246, 184, 0.4);">
    <div style="background: #0e0e0e; width: 8px; height: 8px; border-radius: 50%;"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'custom-marker',
});

// Map updater component
function MapUpdater({ latitude, longitude, editable, onLocationSelect }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 15, { animate: true });
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }
  }, [latitude, longitude, map]);

  useEffect(() => {
    if (!editable) return;

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
      onLocationSelect?.(lat, lng);
    };

    map.on('click', handleMapClick);
    return () => map.off('click', handleMapClick);
  }, [map, editable, onLocationSelect]);

  return (
    <Marker ref={markerRef} position={[latitude, longitude]} icon={customMarkerIcon}>
      <Popup>Current Location</Popup>
    </Marker>
  );
}

export default function MapComponent({ latitude, longitude, onLocationSelect, editable = false, height = 400 }) {
  if (!latitude || !longitude) {
    return (
      <div className={styles.mapPlaceholder}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#69f6b8' }}>
          map
        </span>
        <p>No location selected</p>
      </div>
    );
  }

  return (
    <div className={`${styles.mapContainer} ${editable ? styles.editable : ''}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: `${height}px`, width: '100%', borderRadius: '0.375rem' }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <MapUpdater
          latitude={latitude}
          longitude={longitude}
          editable={editable}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
      {editable && (
        <div className={styles.instructions}>
          <span className="material-symbols-outlined">info</span>
          <p>Click on the map or drag the marker to adjust location</p>
        </div>
      )}
    </div>
  );
}
