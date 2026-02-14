import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import Card from '../shared/Card.jsx';

// Fix default marker icon paths for Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

export default function VehicleMap({ vehicle }) {
  if (!vehicle?.location?.latitude || !vehicle?.location?.longitude) {
    return null;
  }

  const { latitude, longitude } = vehicle.location;
  const position = [latitude, longitude];

  return (
    <Card padding={false} className="md:col-span-2 overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-sm font-medium text-bank-gray-dark">Location</h3>
      </div>
      <div style={{ height: '400px' }}>
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>{vehicle.displayName || 'Vehicle'}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </Card>
  );
}
