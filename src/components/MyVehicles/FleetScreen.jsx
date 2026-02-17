import PortfolioSummary from './PortfolioSummary.jsx';
import AlertBadges from './AlertBadges.jsx';
import VehicleCard from './VehicleCard.jsx';

export default function FleetScreen({ fleet, onSelectVehicle, onConnectTesla }) {
  return (
    <div className="space-y-4 pb-6">
      {/* Portfolio Summary */}
      <PortfolioSummary fleet={fleet} />

      {/* Alert Badges */}
      <AlertBadges
        fleet={fleet}
        onAlertClick={(alert) => {
          const vehicle = fleet.find((v) => v.id === alert.vehicleId);
          if (vehicle) onSelectVehicle(vehicle);
        }}
      />

      {/* Vehicle Cards */}
      <div className="space-y-3">
        {fleet.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={onSelectVehicle} onConnectTesla={onConnectTesla} />
        ))}
      </div>

      {/* Add Vehicle Card */}
      <button className="mv-add-vehicle-card w-full" onClick={onConnectTesla}>
        <svg
          className="w-6 h-6 text-bank-gray-mid mb-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-xs text-bank-gray-mid">Add Vehicle</span>
      </button>
    </div>
  );
}
