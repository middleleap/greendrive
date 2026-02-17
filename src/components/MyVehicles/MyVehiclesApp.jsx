import { useState, useEffect } from 'react';
import MobileFrame from './MobileFrame.jsx';
import FleetScreen from './FleetScreen.jsx';
import VehicleDetailScreen from './VehicleDetailScreen.jsx';
import { buildMergedFleet, enrichWithDashboard } from '../../utils/fleet-adapter.js';
import { API_BASE } from '../../utils/constants.js';

function useVehicleDashboard(vin, authenticated) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vin || !authenticated) {
      setDashboard(null);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/api/dashboard/${vin}`)
      .then((r) => r.json())
      .then(setDashboard)
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
  }, [vin, authenticated]);

  return { dashboard, loading };
}

export default function MyVehiclesApp({
  authenticated = false,
  teslaVehicles = [],
  isLive = false,
  onConnectTesla,
}) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fleet = buildMergedFleet({ authenticated, teslaVehicles });

  // Fetch live dashboard data on-demand when viewing a connected Tesla vehicle
  const selectedVin =
    selectedVehicle?.make === 'Tesla' && selectedVehicle?.connected
      ? selectedVehicle.vin
      : null;
  const { dashboard: liveDashboard, loading: dashLoading } = useVehicleDashboard(
    selectedVin,
    authenticated,
  );

  // Keep the selected vehicle in sync with the latest fleet data
  const currentSelectedVehicle = selectedVehicle
    ? fleet.find((v) => v.id === selectedVehicle.id) || selectedVehicle
    : null;

  // Enrich with live dashboard data when available
  const enrichedVehicle =
    currentSelectedVehicle && liveDashboard
      ? enrichWithDashboard(currentSelectedVehicle, liveDashboard)
      : currentSelectedVehicle;

  return (
    <MobileFrame>
      {/* Mobile App Header */}
      <div className="mv-app-header">
        <div className="flex items-center gap-2">
          <img src="/assets/logos/default.svg" alt="ADCB" className="h-5" />
          <div className="h-3.5 w-px bg-bank-gray-alt" />
          <span className="text-xs font-medium text-bank-gray-dark">My Vehicles</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-pastel text-green-deep font-medium">
            {fleet.filter((v) => v.connected).length}/{fleet.length} Connected
          </span>
        </div>
      </div>

      {/* Screen Content */}
      <div className="mv-app-content">
        {enrichedVehicle ? (
          <VehicleDetailScreen
            vehicle={enrichedVehicle}
            onBack={() => setSelectedVehicle(null)}
            onConnectTesla={onConnectTesla}
            dashLoading={dashLoading}
          />
        ) : (
          <FleetScreen
            fleet={fleet}
            onSelectVehicle={setSelectedVehicle}
            onConnectTesla={onConnectTesla}
          />
        )}
      </div>
    </MobileFrame>
  );
}
