// Tesla Model 3 UAE Configurator — Static Data
// Prices in AED, range in km, acceleration in seconds

export const MODEL_3_VARIANTS = [
  {
    id: 'rwd',
    name: 'Model 3',
    subtitle: 'Rear-Wheel Drive',
    price: 144990,
    range: 513,
    acceleration: 6.1,
    topSpeed: 201,
    drivetrain: 'RWD',
  },
  {
    id: 'lr-rwd',
    name: 'Model 3',
    subtitle: 'Long Range RWD',
    price: 164990,
    range: 702,
    acceleration: 5.0,
    topSpeed: 201,
    drivetrain: 'RWD',
  },
  {
    id: 'lr-awd',
    name: 'Model 3',
    subtitle: 'Long Range AWD',
    price: 184990,
    range: 629,
    acceleration: 4.4,
    topSpeed: 201,
    drivetrain: 'AWD',
  },
  {
    id: 'performance',
    name: 'Model 3',
    subtitle: 'Performance',
    price: 214990,
    range: 528,
    acceleration: 3.1,
    topSpeed: 262,
    drivetrain: 'AWD',
  },
];

export const EXTERIOR_COLORS = [
  { id: 'pearl-white', name: 'Pearl White Multi-Coat', hex: '#e8e8e8', price: 0 },
  { id: 'solid-black', name: 'Solid Black', hex: '#1a1a1a', price: 3700 },
  { id: 'deep-blue', name: 'Deep Blue Metallic', hex: '#1e3a5f', price: 3700 },
  { id: 'stealth-grey', name: 'Stealth Grey', hex: '#6b6e70', price: 3700 },
  { id: 'lunar-silver', name: 'Lunar Silver Metallic', hex: '#b8bfc4', price: 3700 },
  { id: 'ultra-red', name: 'Ultra Red', hex: '#a82028', price: 7400 },
];

export const WHEEL_OPTIONS = [
  {
    id: 'photon-18',
    name: '18" Photon Wheels',
    price: 0,
    available: ['rwd', 'lr-rwd', 'lr-awd', 'performance'],
  },
  {
    id: 'nova-19',
    name: '19" Nova Wheels',
    price: 5500,
    available: ['rwd', 'lr-rwd', 'lr-awd', 'performance'],
  },
  { id: 'warp-20', name: '20" Warp Wheels', price: 0, available: ['performance'] },
];

export const INTERIOR_OPTIONS = [
  { id: 'all-black', name: 'All Black', price: 0, accent: '#1a1a1a' },
  { id: 'black-white', name: 'Black and White', price: 3700, accent: '#f0f0f0' },
];

export const AUTOPILOT_OPTIONS = [
  {
    id: 'basic',
    name: 'Basic Autopilot',
    price: 0,
    features: ['Traffic-Aware Cruise Control', 'Autosteer'],
  },
  {
    id: 'enhanced',
    name: 'Enhanced Autopilot',
    price: 27000,
    features: ['Navigate on Autopilot', 'Auto Lane Change', 'Autopark', 'Summon', 'Smart Summon'],
  },
  {
    id: 'fsd',
    name: 'Full Self-Driving',
    price: 29000,
    features: [
      'All Enhanced Autopilot features',
      'Traffic Light and Stop Sign Control',
      'Autosteer on City Streets',
      'Upcoming: Highway to Parking',
    ],
  },
];

export const TESLA_FINANCING = {
  rate: 2.99,
  minDownPct: 20,
  maxTermYears: 5,
  restrictions: [
    '20% minimum down payment required',
    'Maximum 5-year loan term',
    'No rate improvement over time',
    'Limited to Tesla vehicles only',
    'Standard insurance required',
  ],
};

export const BANK_FINANCING = {
  minDownPct: 10,
  maxTermYears: 7,
  benefits: [
    '10% minimum down — keep more cash',
    'Up to 7-year flexible terms',
    'GreenDrive tier rate reductions',
    '15% EV insurance discount',
    '3x cashback on EV charging',
    '30-day rate lock guarantee',
  ],
};

export const CONFIGURATOR_STEPS = [
  { id: 'variant', label: 'Model', shortLabel: 'Model' },
  { id: 'exterior', label: 'Exterior', shortLabel: 'Color' },
  { id: 'wheels', label: 'Wheels', shortLabel: 'Wheels' },
  { id: 'interior', label: 'Interior', shortLabel: 'Interior' },
  { id: 'autopilot', label: 'Autopilot', shortLabel: 'AP' },
  { id: 'review', label: 'Review', shortLabel: 'Review' },
  { id: 'financing', label: 'Financing', shortLabel: 'Finance' },
];

/**
 * EMI amortization formula — same as SavingsProjection.jsx
 */
export function calculateMonthly(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

/**
 * Get total configured price from config object
 */
export function getTotalPrice(config) {
  if (!config.variant) return 0;
  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  const color = EXTERIOR_COLORS.find((c) => c.id === config.exteriorColor);
  const wheels = WHEEL_OPTIONS.find((w) => w.id === config.wheels);
  const interior = INTERIOR_OPTIONS.find((i) => i.id === config.interior);
  const autopilot = AUTOPILOT_OPTIONS.find((a) => a.id === config.autopilot);
  return (
    (variant?.price || 0) +
    (color?.price || 0) +
    (wheels?.price || 0) +
    (interior?.price || 0) +
    (autopilot?.price || 0)
  );
}
