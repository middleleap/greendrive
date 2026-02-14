import Card from '../shared/Card.jsx';
import KVRow from '../shared/KVRow.jsx';

export default function VehicleDetails({ vehicle }) {
  if (!vehicle) return null;

  return (
    <Card>
      <h3 className="text-sm font-medium text-bank-gray-dark mb-3">Vehicle Details</h3>
      <KVRow label="VIN" value={vehicle.vin} mono />
      <KVRow label="Model" value={vehicle.model} />
      <KVRow label="Name" value={vehicle.displayName} />
      <KVRow label="Software" value={`v${vehicle.software}`} />
      <KVRow label="Odometer" value={`${vehicle.odometer?.km?.toLocaleString()} km`} />
      <KVRow label="Locked" value={vehicle.state?.locked ? 'Yes' : 'No'} />
      <KVRow label="Sentry Mode" value={vehicle.state?.sentryMode ? 'Active' : 'Off'} />
      {vehicle.location?.latitude && (
        <KVRow
          label="Location"
          value={`${vehicle.location.latitude.toFixed(4)}, ${vehicle.location.longitude.toFixed(4)}`}
        />
      )}
    </Card>
  );
}
