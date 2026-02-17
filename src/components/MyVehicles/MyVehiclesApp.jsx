import { useState } from 'react';
import MobileFrame from './MobileFrame.jsx';
import FleetScreen from './FleetScreen.jsx';
import VehicleDetailScreen from './VehicleDetailScreen.jsx';
import { MY_VEHICLES_FLEET } from '../../utils/my-vehicles-data.js';

export default function MyVehiclesApp() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const fleet = MY_VEHICLES_FLEET;

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
        {selectedVehicle ? (
          <VehicleDetailScreen vehicle={selectedVehicle} onBack={() => setSelectedVehicle(null)} />
        ) : (
          <FleetScreen fleet={fleet} onSelectVehicle={setSelectedVehicle} />
        )}
      </div>
    </MobileFrame>
  );
}
