// Realistic mock data representing a UAE Tesla owner
export const MOCK_VEHICLE_LIST = [
  {
    id: 12345678,
    vin: '5YJYGDEE1NF000000',
    display_name: 'My Tesla',
    state: 'online',
    in_service: false,
  },
];

export const MOCK_VEHICLE_DATA = {
  vin: '5YJYGDEE1NF000000',
  display_name: 'My Tesla',
  charge_state: {
    battery_level: 78,
    battery_range: 239.21,
    charging_state: 'Complete',
    charge_energy_added: 52.41,
    charge_limit_soc: 80,
    charger_actual_current: 0,
    fast_charger_type: '<invalid>',
    scheduled_charging_mode: 'Off',
    time_to_full_charge: 0,
  },
  vehicle_state: {
    odometer: 7980.3,
    car_version: '2025.2.6 abc123',
    vehicle_name: 'My Tesla',
    locked: true,
    sentry_mode: true,
    software_update: { status: '' },
  },
  drive_state: {
    latitude: 24.4539,
    longitude: 54.3773,
    heading: 180,
    speed: null,
  },
  climate_state: {
    inside_temp: 24.5,
    outside_temp: 38.2,
    is_climate_on: false,
  },
  vehicle_config: {
    car_type: 'modely',
    trim_badging: '74d',
    exterior_color: 'SolidBlack',
  },
};

// Model 3 — City Commuter (high scorer, Platinum tier)
export const MOCK_VEHICLE_DATA_MODEL3 = {
  vin: '5YJ3E1EA8NF100000',
  display_name: 'City Commuter',
  charge_state: {
    battery_level: 92,
    battery_range: 317,
    charging_state: 'Charging',
    charge_energy_added: 18.3,
    charge_limit_soc: 90,
    fast_charger_type: '<invalid>',
    scheduled_charging_mode: 'On',
  },
  vehicle_state: {
    odometer: 11180,
    car_version: '2026.1.3 abc456',
    vehicle_name: 'City Commuter',
    locked: true,
    sentry_mode: false,
    software_update: { status: '' },
  },
  drive_state: { latitude: 25.2048, longitude: 55.2708, heading: 90 },
  climate_state: { inside_temp: 22.0, outside_temp: 36.8, is_climate_on: false },
};

// Model X — Family SUV (lower scorer, Silver/Bronze tier)
export const MOCK_VEHICLE_DATA_MODELX = {
  vin: '5YJXCAE21NF200000',
  display_name: 'Family SUV',
  charge_state: {
    battery_level: 54,
    battery_range: 152,
    charging_state: 'Disconnected',
    charge_energy_added: 0,
    charge_limit_soc: 80,
    fast_charger_type: '',
    scheduled_charging_mode: 'Off',
  },
  vehicle_state: {
    odometer: 18640,
    car_version: '2024.38.7 def789',
    vehicle_name: 'Family SUV',
    locked: false,
    sentry_mode: true,
    software_update: { status: 'available' },
  },
  drive_state: { latitude: 25.0657, longitude: 55.1713, heading: 270 },
  climate_state: { inside_temp: 28.1, outside_temp: 40.5, is_climate_on: true },
};

export const MOCK_CHARGING_HISTORY = {
  sessions: [
    {
      date: '2026-02-13',
      location: 'Home',
      energy_kWh: 45.2,
      duration_min: 240,
      type: 'Wall Connector',
    },
    {
      date: '2026-02-10',
      location: 'Home',
      energy_kWh: 38.7,
      duration_min: 195,
      type: 'Wall Connector',
    },
    {
      date: '2026-02-07',
      location: 'ADNOC Station',
      energy_kWh: 52.1,
      duration_min: 35,
      type: 'Supercharger',
    },
    {
      date: '2026-02-04',
      location: 'Home',
      energy_kWh: 41.3,
      duration_min: 210,
      type: 'Wall Connector',
    },
    {
      date: '2026-02-01',
      location: 'Yas Mall',
      energy_kWh: 28.5,
      duration_min: 120,
      type: 'Public L2',
    },
    {
      date: '2026-01-28',
      location: 'Home',
      energy_kWh: 44.8,
      duration_min: 230,
      type: 'Wall Connector',
    },
    {
      date: '2026-01-25',
      location: 'Home',
      energy_kWh: 39.2,
      duration_min: 200,
      type: 'Wall Connector',
    },
    {
      date: '2026-01-22',
      location: 'Dubai Mall',
      energy_kWh: 55.0,
      duration_min: 38,
      type: 'Supercharger',
    },
  ],
  patterns: {
    home: 72,
    supercharger: 15,
    publicL2: 8,
    other: 5,
  },
  totalSessions: 156,
  totalEnergy_kWh: 4250,
  avgSessionDuration_min: 180,
  environmentalImpact: {
    co2Saved_kg: 2890,
    treesEquivalent: 48,
    gasolineSaved_liters: 1420,
    costSaved_aed: 3200,
  },
};
