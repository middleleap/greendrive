// Tesla Model 3 Highland (2024+) UAE Configurator Data
// Prices in AED. All option codes match Tesla compositor API.

// ── Tesla Compositor Image Builder ──────────────────────────

const COMPOSITOR_BASE = 'https://static-assets.tesla.com/v1/compositor/';

export function buildTeslaImageUrl({
  trim,
  color,
  wheel,
  interior,
  view = 'STUD_3QTR',
  size = 1920,
  bg = 2,
}) {
  const options = [trim, color, wheel, interior]
    .filter(Boolean)
    .map((c) => `$${c}`)
    .join(',');
  return `${COMPOSITOR_BASE}?model=m3&view=${view}&size=${size}&options=${options}&bkba_opt=${bg}&context=design_studio_2`;
}

export const IMAGE_VIEWS = {
  FRONT: 'STUD_3QTR',
  SIDE: 'STUD_SIDE',
  REAR: 'STUD_REAR34',
  INTERIOR: 'STUD_SEAT',
};

// ── Variants ────────────────────────────────────────────────

export const MODEL_3_VARIANTS = [
  {
    id: 'rwd',
    trimCode: 'MT367',
    name: 'Model 3',
    subtitle: 'Rear-Wheel Drive',
    drivetrainLabel: 'Rear-Wheel Drive',
    badge: null,
    price: 144990,
    range: 534,
    acceleration: 6.2,
    topSpeed: 201,
    drivetrain: 'RWD',
    supercharge15min: 270,
    defaultWheel: 'prismata-18',
    defaultInterior: 'black-textile',
    interiorCode: 'IBB4',
    speakers: 7,
    monthlyPayments: { lease: 1999, loan: 1949, islamic: 1949 },
    leaseTerms: 'AED 7,433 down payment, 36 months, 15,000 km',
    loanTerms: 'AED 31,750 down payment, 60 months, 0% APR',
  },
  {
    id: 'lr-rwd',
    trimCode: 'MT369',
    name: 'Model 3',
    subtitle: 'Long Range Rear-Wheel Drive',
    drivetrainLabel: 'Rear-Wheel Drive',
    badge: 'Premium',
    price: 164990,
    range: 750,
    acceleration: 5.2,
    topSpeed: 201,
    drivetrain: 'RWD',
    supercharge15min: 311,
    defaultWheel: 'photon-18',
    defaultInterior: 'black-microsuede',
    interiorCode: 'IPB2',
    speakers: 9,
    monthlyPayments: { lease: 2999, loan: 2199, islamic: 2199 },
    leaseTerms: 'AED 8,499 down payment, 36 months, 15,000 km',
    loanTerms: 'AED 36,749 down payment, 60 months, 0% APR',
  },
  {
    id: 'lr-awd',
    trimCode: 'MT370',
    name: 'Model 3',
    subtitle: 'Long Range All-Wheel Drive',
    drivetrainLabel: 'Dual Motor All-Wheel Drive',
    badge: 'Premium',
    price: 184990,
    range: 660,
    acceleration: 4.4,
    topSpeed: 201,
    drivetrain: 'AWD',
    supercharge15min: 275,
    defaultWheel: 'photon-18',
    defaultInterior: 'black-microsuede',
    interiorCode: 'IPB2',
    speakers: 15,
    monthlyPayments: { lease: 3250, loan: 2499, islamic: 2499 },
    leaseTerms: 'AED 9,499 down payment, 36 months, 15,000 km',
    loanTerms: 'AED 41,249 down payment, 60 months, 0% APR',
  },
  {
    id: 'performance',
    trimCode: 'MT371',
    name: 'Model 3',
    subtitle: 'Performance All-Wheel Drive',
    drivetrainLabel: 'Dual Motor All-Wheel Drive',
    badge: 'Performance',
    price: 214990,
    range: 571,
    acceleration: 3.1,
    topSpeed: 262,
    drivetrain: 'AWD',
    supercharge15min: 237,
    defaultWheel: 'warp-20',
    defaultInterior: 'black-carbon',
    interiorCode: 'IPB4',
    speakers: 15,
    monthlyPayments: { lease: 3499, loan: 2899, islamic: 2899 },
    leaseTerms: 'AED 10,999 down payment, 36 months, 15,000 km',
    loanTerms: 'AED 47,999 down payment, 60 months, 0% APR',
  },
];

// ── Exterior Colors ─────────────────────────────────────────

export const EXTERIOR_COLORS = [
  {
    id: 'pearl-white',
    name: 'Pearl White Multi-Coat',
    code: 'PPSW',
    hex: '#e8e8e8',
    price: 0,
    available: ['rwd', 'lr-rwd', 'lr-awd', 'performance'],
  },
  {
    id: 'diamond-black',
    name: 'Diamond Black',
    code: 'PX02',
    hex: '#1a1a1a',
    price: 5300,
    available: ['rwd', 'lr-rwd', 'lr-awd', 'performance'],
  },
  {
    id: 'stealth-grey',
    name: 'Stealth Grey',
    code: 'PN01',
    hex: '#6b6e70',
    price: 5300,
    available: ['rwd', 'lr-rwd', 'lr-awd', 'performance'],
  },
  {
    id: 'marine-blue',
    name: 'Marine Blue',
    code: 'PB02',
    hex: '#1e3a5f',
    price: 5300,
    available: ['lr-rwd', 'lr-awd', 'performance'],
  },
  {
    id: 'ultra-red',
    name: 'Ultra Red',
    code: 'PR01',
    hex: '#a82028',
    price: 8000,
    available: ['lr-rwd', 'lr-awd', 'performance'],
  },
  {
    id: 'quicksilver',
    name: 'Quicksilver',
    code: 'PN00',
    hex: '#b8bfc4',
    price: 8000,
    available: ['lr-rwd', 'lr-awd', 'performance'],
  },
];

// ── Wheels ───────────────────────────────────────────────────

export const WHEEL_OPTIONS = [
  {
    id: 'prismata-18',
    name: '18" Prismata Wheels',
    code: 'W38C',
    price: 0,
    available: ['rwd'],
    rangeImpact: 0,
  },
  {
    id: 'photon-18',
    name: '18" Photon Wheels',
    code: 'W38A',
    price: 0,
    available: ['lr-rwd', 'lr-awd'],
    rangeImpact: 0,
  },
  {
    id: 'nova-19',
    name: '19" Nova Wheels',
    code: 'W39S',
    price: 6500,
    available: ['lr-rwd', 'lr-awd'],
    rangeImpact: -30,
  },
  {
    id: 'warp-20',
    name: '20" Warp Wheels',
    code: 'W30P',
    price: 0,
    available: ['performance'],
    rangeImpact: 0,
  },
];

// ── Tow Hitch ───────────────────────────────────────────────

export const TOW_HITCH = {
  name: 'Tow Hitch',
  description: 'Tow up to 1,000 kg with a class II steel tow bar',
  price: 5000,
  available: ['lr-rwd', 'lr-awd', 'performance'],
};

// ── Interior ────────────────────────────────────────────────

export const INTERIOR_OPTIONS = [
  {
    id: 'black-textile',
    name: 'Black',
    code: 'IBB4',
    price: 0,
    description: 'Textile decor',
    forVariants: ['rwd'],
  },
  {
    id: 'black-microsuede',
    name: 'Black',
    code: 'IPB2',
    price: 0,
    description: 'Microsuede and textile decor',
    forVariants: ['lr-rwd', 'lr-awd'],
  },
  {
    id: 'black-carbon',
    name: 'Black',
    code: 'IPB4',
    price: 0,
    description: 'Microsuede and carbon fiber decor',
    forVariants: ['performance'],
  },
];

// ── Autopilot ───────────────────────────────────────────────

export const AUTOPILOT_OPTIONS = [
  {
    id: 'basic',
    name: 'Basic Autopilot',
    price: 0,
    description: 'Includes Autosteer and traffic-aware cruise control.',
    features: ['Traffic-Aware Cruise Control', 'Autosteer'],
  },
  {
    id: 'enhanced',
    name: 'Enhanced Autopilot',
    price: 14100,
    description:
      'Includes Basic Autopilot, plus driver-initiated assisted driving from highway on-ramp to off-ramp, lane changes and overtaking. Also includes Dumb Summon, Actually Smart Summon and Autopark.',
    features: ['Navigate on Autopilot', 'Auto Lane Change', 'Autopark', 'Summon', 'Smart Summon'],
  },
  {
    id: 'fsd',
    name: 'Full Self-Driving Capability',
    price: 28100,
    description:
      'Includes Enhanced Autopilot. Additionally, in future updates your vehicle will be able to drive itself almost anywhere with minimal driver intervention.',
    features: [
      'All Enhanced Autopilot features',
      'Traffic Light and Stop Sign Control',
      'Autosteer on City Streets',
      'Upcoming: Highway to Parking',
    ],
  },
];

// ── Charging Accessories ────────────────────────────────────

export const CHARGING_ACCESSORIES = [
  {
    id: 'wall-connector',
    name: 'Wall Connector',
    price: 2300,
    description: 'Our recommended home charging solution.',
  },
  {
    id: 'mobile-connector',
    name: 'Mobile Connector',
    price: 909,
    description: 'Useful when away from home on extended trips.',
  },
];

// ── Accessories ─────────────────────────────────────────────

export const ACCESSORIES = [
  { id: 'all-weather-liners', name: 'All-Weather Interior Liners', price: 720 },
  { id: 'roof-rack', name: 'Roof Rack', price: 1872 },
  { id: 'console-trays', name: 'Center Console Trays', price: 150 },
];

// ── Payment Modes ───────────────────────────────────────────

export const PAYMENT_MODES = [
  { id: 'cash', label: 'Cash' },
  { id: 'lease', label: 'Lease' },
  { id: 'loan', label: 'Loan' },
  { id: 'islamic', label: 'Islamic Finance' },
  { id: 'green-loan', label: 'Green Car Loan' },
];

export const DESTINATION_FEE = 3680;

// ── Helpers ─────────────────────────────────────────────────

export function calculateMonthly(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

export function getTotalPrice(config) {
  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  if (!variant) return 0;
  const color = EXTERIOR_COLORS.find((c) => c.id === config.exteriorColor);
  const wheels = WHEEL_OPTIONS.find((w) => w.id === config.wheels);
  const autopilot = AUTOPILOT_OPTIONS.find((a) => a.id === config.autopilot);
  let total = variant.price + (color?.price || 0) + (wheels?.price || 0) + (autopilot?.price || 0);
  if (config.towHitch) total += TOW_HITCH.price;
  for (const acc of config.chargingAccessories || []) {
    const item = CHARGING_ACCESSORIES.find((c) => c.id === acc);
    if (item) total += item.price;
  }
  for (const acc of config.accessories || []) {
    const item = ACCESSORIES.find((a) => a.id === acc);
    if (item) total += item.price;
  }
  return total;
}

export function getPurchasePrice(config) {
  return getTotalPrice(config) + DESTINATION_FEE;
}

export function getAvailableColors(variantId) {
  return EXTERIOR_COLORS.filter((c) => c.available.includes(variantId));
}

export function getAvailableWheels(variantId) {
  return WHEEL_OPTIONS.filter((w) => w.available.includes(variantId));
}

export function getInteriorForVariant(variantId) {
  return INTERIOR_OPTIONS.find((i) => i.forVariants.includes(variantId));
}

export function getImageUrl(config) {
  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  const color = EXTERIOR_COLORS.find((c) => c.id === config.exteriorColor);
  const wheels = WHEEL_OPTIONS.find((w) => w.id === config.wheels);
  if (!variant) return null;
  return buildTeslaImageUrl({
    trim: variant.trimCode,
    color: color?.code || 'PPSW',
    wheel: wheels?.code || 'W38A',
    interior: variant.interiorCode,
    view: config._view || 'STUD_FRONT34',
  });
}
