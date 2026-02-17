# Tesla Model 3 Configurator Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 7-step wizard configurator with a single-scroll Tesla.com replica featuring live car images, 5 payment modes (including Green Car Loan), and full configuration sections.

**Architecture:** Complete rewrite of TeslaBuyingJourney components. Single-scroll two-column layout (sticky car image left, options right). Tesla compositor CDN for live car images. All configuration state in TeslaBuyingJourneyApp orchestrator. Reuses existing ApplyModal and GreenDrive score data.

**Tech Stack:** React, Tailwind CSS 4 with CSS custom properties, Tesla compositor CDN images, existing ApplyModal integration.

**Design doc:** `docs/plans/2026-02-17-tesla-configurator-redesign.md`

---

### Task 1: Rewrite configurator data file

**Files:**
- Modify: `src/utils/tesla-configurator-data.js` (full rewrite)

**Step 1: Rewrite the data file with Tesla option codes, variant-dependent availability, and compositor URL builder**

Replace the entire file with updated data matching Tesla UAE current offerings:

```javascript
// Tesla Model 3 Highland (2024+) UAE Configurator Data
// Prices in AED. All option codes match Tesla compositor API.

// ── Tesla Compositor Image Builder ──────────────────────────

const COMPOSITOR_BASE = 'https://static-assets.tesla.com/configurator/compositor';

export function buildTeslaImageUrl({ trim, color, wheel, interior, view = 'STUD_FRONT34', size = 1920, bg = 2 }) {
  const options = [trim, color, wheel, interior].filter(Boolean).map(c => `$${c}`).join(',');
  const crop = view === 'STUD_RIMCLOSEUP' ? '0,0,80,0' : '0,0,0,0';
  return `${COMPOSITOR_BASE}?context=design_studio_2&options=${options}&view=${view}&model=m3&size=${size}&bkba_opt=${bg}&crop=${crop}&overlay=0&`;
}

export const IMAGE_VIEWS = {
  FRONT: 'STUD_FRONT34',
  SIDE: 'STUD_SIDEVIEW',
  REAR: 'STUD_REAR34',
  INTERIOR: 'STUD_INTERIOR',
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
  { id: 'pearl-white', name: 'Pearl White Multi-Coat', code: 'PPSW', hex: '#e8e8e8', price: 0, available: ['rwd', 'lr-rwd', 'lr-awd', 'performance'] },
  { id: 'diamond-black', name: 'Diamond Black', code: 'PX02', hex: '#1a1a1a', price: 5300, available: ['rwd', 'lr-rwd', 'lr-awd', 'performance'] },
  { id: 'stealth-grey', name: 'Stealth Grey', code: 'PN01', hex: '#6b6e70', price: 5300, available: ['rwd', 'lr-rwd', 'lr-awd', 'performance'] },
  { id: 'marine-blue', name: 'Marine Blue', code: 'PB02', hex: '#1e3a5f', price: 5300, available: ['lr-rwd', 'lr-awd', 'performance'] },
  { id: 'ultra-red', name: 'Ultra Red', code: 'PR01', hex: '#a82028', price: 8000, available: ['lr-rwd', 'lr-awd', 'performance'] },
  { id: 'quicksilver', name: 'Quicksilver', code: 'PN00', hex: '#b8bfc4', price: 8000, available: ['lr-rwd', 'lr-awd', 'performance'] },
];

// ── Wheels ───────────────────────────────────────────────────

export const WHEEL_OPTIONS = [
  { id: 'prismata-18', name: '18" Prismata Wheels', code: 'W38C', price: 0, available: ['rwd'], rangeImpact: 0 },
  { id: 'photon-18', name: '18" Photon Wheels', code: 'W38A', price: 0, available: ['lr-rwd', 'lr-awd'], rangeImpact: 0 },
  { id: 'nova-19', name: '19" Nova Wheels', code: 'W39S', price: 6500, available: ['lr-rwd', 'lr-awd'], rangeImpact: -30 },
  { id: 'warp-20', name: '20" Warp Wheels', code: 'W30P', price: 0, available: ['performance'], rangeImpact: 0 },
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
  { id: 'black-textile', name: 'Black', code: 'IBB4', price: 0, description: 'Textile decor', forVariants: ['rwd'] },
  { id: 'black-microsuede', name: 'Black', code: 'IPB2', price: 0, description: 'Microsuede and textile decor', forVariants: ['lr-rwd', 'lr-awd'] },
  { id: 'black-carbon', name: 'Black', code: 'IPB4', price: 0, description: 'Microsuede and carbon fiber decor', forVariants: ['performance'] },
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
    description: 'Includes Basic Autopilot, plus driver-initiated assisted driving from highway on-ramp to off-ramp, lane changes and overtaking. Also includes Dumb Summon, Actually Smart Summon and Autopark.',
    features: ['Navigate on Autopilot', 'Auto Lane Change', 'Autopark', 'Summon', 'Smart Summon'],
  },
  {
    id: 'fsd',
    name: 'Full Self-Driving Capability',
    price: 28100,
    description: 'Includes Enhanced Autopilot. Additionally, in future updates your vehicle will be able to drive itself almost anywhere with minimal driver intervention.',
    features: ['All Enhanced Autopilot features', 'Traffic Light and Stop Sign Control', 'Autosteer on City Streets', 'Upcoming: Highway to Parking'],
  },
];

// ── Charging Accessories ────────────────────────────────────

export const CHARGING_ACCESSORIES = [
  { id: 'wall-connector', name: 'Wall Connector', price: 2300, description: 'Our recommended home charging solution.' },
  { id: 'mobile-connector', name: 'Mobile Connector', price: 909, description: 'Useful when away from home on extended trips.' },
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
  return (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export function getTotalPrice(config) {
  const variant = MODEL_3_VARIANTS.find(v => v.id === config.variant);
  if (!variant) return 0;
  const color = EXTERIOR_COLORS.find(c => c.id === config.exteriorColor);
  const wheels = WHEEL_OPTIONS.find(w => w.id === config.wheels);
  const autopilot = AUTOPILOT_OPTIONS.find(a => a.id === config.autopilot);
  let total = variant.price + (color?.price || 0) + (wheels?.price || 0) + (autopilot?.price || 0);
  if (config.towHitch) total += TOW_HITCH.price;
  for (const acc of (config.chargingAccessories || [])) {
    const item = CHARGING_ACCESSORIES.find(c => c.id === acc);
    if (item) total += item.price;
  }
  for (const acc of (config.accessories || [])) {
    const item = ACCESSORIES.find(a => a.id === acc);
    if (item) total += item.price;
  }
  return total;
}

export function getPurchasePrice(config) {
  return getTotalPrice(config) + DESTINATION_FEE;
}

export function getAvailableColors(variantId) {
  return EXTERIOR_COLORS.filter(c => c.available.includes(variantId));
}

export function getAvailableWheels(variantId) {
  return WHEEL_OPTIONS.filter(w => w.available.includes(variantId));
}

export function getInteriorForVariant(variantId) {
  return INTERIOR_OPTIONS.find(i => i.forVariants.includes(variantId));
}

export function getImageUrl(config) {
  const variant = MODEL_3_VARIANTS.find(v => v.id === config.variant);
  const color = EXTERIOR_COLORS.find(c => c.id === config.exteriorColor);
  const wheels = WHEEL_OPTIONS.find(w => w.id === config.wheels);
  if (!variant) return null;
  return buildTeslaImageUrl({
    trim: variant.trimCode,
    color: color?.code || 'PPSW',
    wheel: wheels?.code || 'W38A',
    interior: variant.interiorCode,
    view: config._view || 'STUD_FRONT34',
  });
}
```

**Step 2: Verify the app still starts**

Run: `npm run dev` (check for import errors in browser console)
Expected: App loads, no import errors. The existing wizard may break — that's expected since we're about to replace it.

**Step 3: Commit**

```bash
git add src/utils/tesla-configurator-data.js
git commit -m "feat(configurator): rewrite data file with Tesla option codes and compositor URLs"
```

---

### Task 2: Replace CSS — remove wizard styles, add configurator layout styles

**Files:**
- Modify: `src/styles/bank-theme.css` (lines ~1011-1143)

**Step 1: Replace the `TESLA CONFIGURATOR` CSS section**

Find the block from `/* ===== TESLA CONFIGURATOR ===== */` through `.dark .cfg-summary-bar { ... }` (lines 1011-1143) and replace with new configurator CSS:

```css
/* ===== TESLA CONFIGURATOR ===== */

/* Two-column layout */
.tc-layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: calc(100vh - 80px);
}
@media (min-width: 1024px) {
  .tc-layout {
    grid-template-columns: 3fr 2fr;
  }
}

/* Sticky car image panel */
.tc-image-panel {
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 300px;
  padding: 24px;
}
@media (min-width: 1024px) {
  .tc-image-panel {
    position: sticky;
    top: 0;
    height: 100vh;
    min-height: unset;
  }
}
.dark .tc-image-panel {
  background: #1a2228;
}

.tc-image-panel img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  transition: opacity 0.3s ease;
}

/* View toggle arrows */
.tc-view-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  color: #333;
  font-size: 16px;
}
.tc-view-btn:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.tc-view-btn-left { left: 16px; }
.tc-view-btn-right { right: 16px; }

/* Options panel */
.tc-options {
  padding: 32px 24px 120px;
  overflow-y: auto;
}
@media (min-width: 1024px) {
  .tc-options {
    padding: 40px 32px 120px;
    height: 100vh;
    overflow-y: auto;
  }
}

/* Section dividers */
.tc-section {
  padding: 24px 0;
  border-bottom: 1px solid var(--color-bank-gray-alt);
}
.tc-section:last-child {
  border-bottom: none;
}
.tc-section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-bank-gray-dark);
  margin-bottom: 4px;
}
.tc-section-subtitle {
  font-size: 13px;
  color: var(--color-bank-gray-mid);
  margin-bottom: 16px;
}

/* Promo banner */
.tc-promo-banner {
  background: #d4a853;
  color: #2a1f00;
  text-align: center;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
}
.tc-promo-banner a {
  color: #2a1f00;
  text-decoration: underline;
  margin-left: 8px;
}

/* Payment mode dropdown */
.tc-payment-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-bank-gray-alt);
  border-radius: 8px;
  background: var(--color-bank-surface);
  color: var(--color-bank-gray-dark);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}
.tc-payment-select:focus {
  outline: none;
  border-color: var(--color-bank-gray);
}
.tc-payment-select-green {
  border-color: var(--color-green-deep);
  background-color: var(--color-green-pale);
}

/* Variant cards — Tesla-style radio cards */
.tc-variant-card {
  display: block;
  width: 100%;
  background: var(--color-bank-surface);
  border: 1px solid var(--color-bank-gray-alt);
  border-radius: 8px;
  padding: 16px 20px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.tc-variant-card:hover {
  border-color: var(--color-bank-gray);
}
.tc-variant-card-selected {
  border-color: #171a20;
  border-width: 2px;
  padding: 15px 19px;
}
.dark .tc-variant-card-selected {
  border-color: white;
}
.tc-variant-card-green {
  border-color: var(--color-green-deep);
  border-width: 2px;
  padding: 15px 19px;
}

/* Spec stats row */
.tc-specs-row {
  display: flex;
  gap: 24px;
  padding: 16px 0;
  justify-content: center;
}
.tc-spec-item {
  text-align: center;
}
.tc-spec-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-bank-gray-dark);
  line-height: 1.2;
}
.tc-spec-label {
  font-size: 11px;
  color: var(--color-bank-gray-mid);
  margin-top: 2px;
}

/* Color swatches */
.tc-swatch {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
}
.tc-swatch:hover {
  transform: scale(1.1);
}
.tc-swatch-selected {
  border-color: #171a20;
}
.dark .tc-swatch-selected {
  border-color: white;
}

/* Checkbox card */
.tc-checkbox-card {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  background: var(--color-bank-surface);
  border: 1px solid var(--color-bank-gray-alt);
  border-radius: 8px;
  padding: 16px 20px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease;
}
.tc-checkbox-card:hover {
  border-color: var(--color-bank-gray);
}
.tc-checkbox-card-checked {
  border-color: #171a20;
  border-width: 2px;
  padding: 15px 19px;
}

/* Checkbox indicator */
.tc-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid var(--color-bank-gray-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.tc-checkbox-checked {
  background: #171a20;
  border-color: #171a20;
  color: white;
}

/* Sticky bottom bar */
.tc-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: white;
  border-top: 1px solid #e5e5e5;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slide-up-bar 0.4s var(--ease-spring) both;
}
.dark .tc-bottom-bar {
  background: #1a2228;
  border-top-color: #2a3440;
}
.tc-bottom-bar-green {
  border-top-color: var(--color-green-deep);
  border-top-width: 2px;
}

/* Order Now / Apply button */
.tc-order-btn {
  padding: 10px 32px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}
.tc-order-btn:active {
  transform: scale(0.98);
}
.tc-order-btn-dark {
  background: #3e6ae1;
  color: white;
  border: none;
}
.tc-order-btn-dark:hover {
  background: #2d5bd1;
}
.tc-order-btn-green {
  background: var(--color-green-deep);
  color: white;
  border: none;
}
.tc-order-btn-green:hover {
  background: #085a3c;
}

/* Financing modal */
.tc-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.tc-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}
.tc-modal {
  position: relative;
  background: var(--color-bank-surface);
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 48px rgba(0,0,0,0.2);
}

/* Order summary (inline reveal) */
.tc-order-summary {
  background: var(--color-bank-surface);
  border-top: 1px solid var(--color-bank-gray-alt);
  padding: 40px 32px 120px;
}

/* Green loan accent pill */
.tc-green-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--color-green-pastel);
  color: var(--color-green-deep);
  font-size: 11px;
  font-weight: 600;
}

/* Range impact badge */
.tc-range-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--color-bank-gray-bg);
  color: var(--color-bank-gray-mid);
  font-size: 12px;
}

/* Financial terms link */
.tc-terms-link {
  color: var(--color-bank-gray-mid);
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
}
.tc-terms-link:hover {
  color: var(--color-bank-gray-dark);
}

/* Loan slider (reuse from existing but scoped) */
.tc-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-bank-gray-alt);
  outline: none;
}
.tc-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-green-deep);
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
```

**Step 2: Verify styles load**

Run: Check browser — page should load without CSS errors.

**Step 3: Commit**

```bash
git add src/styles/bank-theme.css
git commit -m "feat(configurator): replace wizard CSS with Tesla-style configurator layout styles"
```

---

### Task 3: Build CarImagePanel component

**Files:**
- Create: `src/components/TeslaBuyingJourney/CarImagePanel.jsx`

**Step 1: Create the sticky car image panel with view toggle**

```jsx
import { useState, useEffect } from 'react';
import { getImageUrl, IMAGE_VIEWS } from '../../utils/tesla-configurator-data.js';

const VIEWS = [IMAGE_VIEWS.FRONT, IMAGE_VIEWS.SIDE];
const VIEW_LABELS = { [IMAGE_VIEWS.FRONT]: 'Front View', [IMAGE_VIEWS.SIDE]: 'Side View' };

export default function CarImagePanel({ config }) {
  const [viewIndex, setViewIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const view = VIEWS[viewIndex];

  const imageUrl = getImageUrl({ ...config, _view: view });

  // Preload the other view
  useEffect(() => {
    if (!config.variant) return;
    const otherView = VIEWS[(viewIndex + 1) % VIEWS.length];
    const img = new Image();
    img.src = getImageUrl({ ...config, _view: otherView });
  }, [config, viewIndex]);

  // Reset loaded state on image change
  useEffect(() => {
    setLoaded(false);
  }, [imageUrl]);

  const prev = () => setViewIndex(i => (i - 1 + VIEWS.length) % VIEWS.length);
  const next = () => setViewIndex(i => (i + 1) % VIEWS.length);

  if (!config.variant) {
    return (
      <div className="tc-image-panel">
        <div className="text-center">
          <p className="text-lg font-semibold text-bank-gray-mid">Model 3</p>
          <p className="text-sm text-bank-gray">Select a variant to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tc-image-panel">
      <button className="tc-view-btn tc-view-btn-left" onClick={prev} aria-label="Previous view">
        &#8249;
      </button>
      <img
        src={imageUrl}
        alt={`${VIEW_LABELS[view]} of Model 3`}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0.3 }}
        draggable={false}
      />
      <button className="tc-view-btn tc-view-btn-right" onClick={next} aria-label="Next view">
        &#8250;
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {VIEWS.map((v, i) => (
          <button
            key={v}
            onClick={() => setViewIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === viewIndex ? 'bg-gray-800 scale-125' : 'bg-gray-400'}`}
            aria-label={VIEW_LABELS[v]}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify component renders**

Temporarily import in TeslaBuyingJourneyApp to check it renders with a test config.

**Step 3: Commit**

```bash
git add src/components/TeslaBuyingJourney/CarImagePanel.jsx
git commit -m "feat(configurator): add CarImagePanel with Tesla compositor images and view toggle"
```

---

### Task 4: Build PaymentModeSelect and VariantSection components

**Files:**
- Create: `src/components/TeslaBuyingJourney/PaymentModeSelect.jsx`
- Create: `src/components/TeslaBuyingJourney/VariantSection.jsx`

**Step 1: Create PaymentModeSelect**

```jsx
import { PAYMENT_MODES } from '../../utils/tesla-configurator-data.js';

export default function PaymentModeSelect({ paymentMode, onPaymentModeChange }) {
  return (
    <div className="tc-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
      <select
        value={paymentMode}
        onChange={e => onPaymentModeChange(e.target.value)}
        className={`tc-payment-select ${paymentMode === 'green-loan' ? 'tc-payment-select-green' : ''}`}
      >
        {PAYMENT_MODES.map(mode => (
          <option key={mode.id} value={mode.id}>
            {mode.id === 'green-loan' ? '🟢 ' : ''}{mode.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Step 2: Create VariantSection**

```jsx
import { MODEL_3_VARIANTS, calculateMonthly } from '../../utils/tesla-configurator-data.js';

function formatPrice(amount) {
  return `AED ${amount.toLocaleString()}`;
}

export default function VariantSection({ config, paymentMode, greenRate, tierName, onConfigChange }) {
  const selected = MODEL_3_VARIANTS.find(v => v.id === config.variant);

  function getDisplayPrice(variant) {
    switch (paymentMode) {
      case 'cash':
        return formatPrice(variant.price);
      case 'lease':
        return `${formatPrice(variant.monthlyPayments.lease)} /mo`;
      case 'loan':
        return `${formatPrice(variant.monthlyPayments.loan)} /mo`;
      case 'islamic':
        return `${formatPrice(variant.monthlyPayments.islamic)} /mo`;
      case 'green-loan': {
        const downPayment = variant.price * 0.10;
        const principal = variant.price - downPayment;
        const emi = Math.round(calculateMonthly(principal, greenRate, 5));
        return `${formatPrice(emi)} /mo`;
      }
      default:
        return formatPrice(variant.price);
    }
  }

  function getTermsText(variant) {
    switch (paymentMode) {
      case 'cash':
        return `Price excludes Tesla trade-in uplift of AED 15,000 and 5 year gas savings of AED 12,500`;
      case 'lease':
        return `*${variant.leaseTerms}`;
      case 'loan':
        return `*${variant.loanTerms}`;
      case 'islamic':
        return `*Murabaha finance, 0% profit rate, Dubai Islamic Bank PJSC`;
      case 'green-loan':
        return `*10% down, 60 months, ${greenRate.toFixed(2)}% Green Rate`;
      default:
        return '';
    }
  }

  return (
    <div className="tc-section">
      {/* Specs row for selected variant */}
      {selected && (
        <div className="tc-specs-row">
          <div className="tc-spec-item">
            <div className="tc-spec-value">{selected.range}<span className="text-sm font-normal">km</span></div>
            <div className="tc-spec-label">Range (WLTP)</div>
          </div>
          <div className="tc-spec-item">
            <div className="tc-spec-value">{selected.topSpeed}<span className="text-sm font-normal">km/h</span></div>
            <div className="tc-spec-label">Top Speed</div>
          </div>
          <div className="tc-spec-item">
            <div className="tc-spec-value">{selected.acceleration}<span className="text-sm font-normal">s</span></div>
            <div className="tc-spec-label">0-100 km/h</div>
          </div>
        </div>
      )}

      {/* Variant cards */}
      <div className="space-y-3">
        {MODEL_3_VARIANTS.map(variant => {
          const isSelected = config.variant === variant.id;
          const isGreen = paymentMode === 'green-loan';
          return (
            <button
              key={variant.id}
              onClick={() => onConfigChange({
                variant: variant.id,
                wheels: variant.defaultWheel,
                exteriorColor: config.exteriorColor && !['marine-blue', 'ultra-red', 'quicksilver'].includes(config.exteriorColor)
                  ? config.exteriorColor
                  : 'pearl-white',
              })}
              className={`tc-variant-card ${isSelected ? (isGreen ? 'tc-variant-card-green' : 'tc-variant-card-selected') : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-bank-gray-mid">{variant.drivetrainLabel}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {variant.badge && (
                      <span className="text-xs font-bold text-bank-gray-dark">{variant.badge}</span>
                    )}
                    <span className="text-sm text-bank-gray-dark">{variant.subtitle}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-bank-gray-dark">{getDisplayPrice(variant)}</p>
                  {isGreen && isSelected && tierName && (
                    <span className="tc-green-pill mt-1">{tierName}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Terms text */}
      {selected && (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-bank-gray-mid">{getTermsText(selected)}</p>
          <button className="tc-terms-link" data-action="edit-terms">
            Edit Financial Terms &amp; Savings
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/TeslaBuyingJourney/PaymentModeSelect.jsx src/components/TeslaBuyingJourney/VariantSection.jsx
git commit -m "feat(configurator): add PaymentModeSelect dropdown and VariantSection with 5 payment modes"
```

---

### Task 5: Build ExteriorSection, WheelSection, InteriorSection

**Files:**
- Create: `src/components/TeslaBuyingJourney/ExteriorSection.jsx`
- Create: `src/components/TeslaBuyingJourney/WheelSection.jsx`
- Create: `src/components/TeslaBuyingJourney/InteriorSection.jsx`

**Step 1: Create ExteriorSection with variant-dependent color availability**

```jsx
import { getAvailableColors } from '../../utils/tesla-configurator-data.js';

export default function ExteriorSection({ config, onConfigChange }) {
  const colors = getAvailableColors(config.variant);
  const selected = colors.find(c => c.id === config.exteriorColor);

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">{selected?.name || 'Exterior'}</h2>
      <p className="tc-section-subtitle">
        {selected ? (selected.price === 0 ? 'Included' : `AED ${selected.price.toLocaleString()}`) : 'Select a color'}
      </p>
      <div className="flex gap-3 flex-wrap">
        {colors.map(color => (
          <button
            key={color.id}
            onClick={() => onConfigChange({ exteriorColor: color.id })}
            className={`tc-swatch ${config.exteriorColor === color.id ? 'tc-swatch-selected' : ''}`}
            style={{ backgroundColor: color.hex }}
            aria-label={color.name}
            title={`${color.name}${color.price > 0 ? ` — AED ${color.price.toLocaleString()}` : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Create WheelSection with range impact display**

```jsx
import { getAvailableWheels, MODEL_3_VARIANTS } from '../../utils/tesla-configurator-data.js';

export default function WheelSection({ config, onConfigChange }) {
  const wheels = getAvailableWheels(config.variant);
  const selected = wheels.find(w => w.id === config.wheels);
  const variant = MODEL_3_VARIANTS.find(v => v.id === config.variant);
  const effectiveRange = variant ? variant.range + (selected?.rangeImpact || 0) : null;

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">{selected?.name || 'Wheels'}</h2>
      <p className="tc-section-subtitle">
        {selected ? (selected.price === 0 ? 'Included' : `AED ${selected.price.toLocaleString()}`) : 'Select wheels'}
      </p>
      <div className="flex gap-3 flex-wrap">
        {wheels.map(wheel => (
          <button
            key={wheel.id}
            onClick={() => onConfigChange({ wheels: wheel.id })}
            className={`tc-swatch ${config.wheels === wheel.id ? 'tc-swatch-selected' : ''}`}
            style={{ background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: '#555' }}
            aria-label={wheel.name}
            title={`${wheel.name}${wheel.price > 0 ? ` — AED ${wheel.price.toLocaleString()}` : ''}`}
          >
            {wheel.name.match(/\d+/)?.[0]}"
          </button>
        ))}
      </div>
      {effectiveRange && (
        <div className="mt-3">
          <span className="tc-range-badge">
            Certified Range (WLTP): {effectiveRange} km
          </span>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Create InteriorSection**

```jsx
import { getInteriorForVariant } from '../../utils/tesla-configurator-data.js';

export default function InteriorSection({ config }) {
  const interior = getInteriorForVariant(config.variant);
  if (!interior) return null;

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">{interior.name}</h2>
      <p className="tc-section-subtitle">Included — {interior.description}</p>
      <div className="flex gap-3">
        <div
          className="tc-swatch tc-swatch-selected"
          style={{ backgroundColor: '#1a1a1a' }}
          aria-label={interior.name}
        />
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/TeslaBuyingJourney/ExteriorSection.jsx src/components/TeslaBuyingJourney/WheelSection.jsx src/components/TeslaBuyingJourney/InteriorSection.jsx
git commit -m "feat(configurator): add Exterior, Wheel, Interior sections with variant-dependent options"
```

---

### Task 6: Build TowHitchSection, AutopilotSection, ChargingSection, AccessoriesSection

**Files:**
- Create: `src/components/TeslaBuyingJourney/TowHitchSection.jsx`
- Create: `src/components/TeslaBuyingJourney/AutopilotSection.jsx`
- Create: `src/components/TeslaBuyingJourney/ChargingSection.jsx`
- Create: `src/components/TeslaBuyingJourney/AccessoriesSection.jsx`

**Step 1: Create TowHitchSection**

```jsx
import { TOW_HITCH } from '../../utils/tesla-configurator-data.js';

export default function TowHitchSection({ config, onConfigChange }) {
  if (!TOW_HITCH.available.includes(config.variant)) return null;
  const checked = !!config.towHitch;

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">Tow Hitch</h2>
      <p className="tc-section-subtitle">{TOW_HITCH.description}</p>
      <button
        onClick={() => onConfigChange({ towHitch: !checked })}
        className={`tc-checkbox-card ${checked ? 'tc-checkbox-card-checked' : ''}`}
      >
        <div className={`tc-checkbox ${checked ? 'tc-checkbox-checked' : ''}`}>
          {checked && <span className="text-xs">✓</span>}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-bank-gray-dark">{TOW_HITCH.name}</p>
        </div>
        <p className="text-sm font-semibold text-bank-gray-dark">AED {TOW_HITCH.price.toLocaleString()}</p>
      </button>
    </div>
  );
}
```

**Step 2: Create AutopilotSection**

```jsx
import { AUTOPILOT_OPTIONS } from '../../utils/tesla-configurator-data.js';

export default function AutopilotSection({ config, onConfigChange }) {
  return (
    <div className="tc-section">
      <h2 className="tc-section-title">Autopilot</h2>
      <div className="space-y-3 mt-3">
        {AUTOPILOT_OPTIONS.map(option => {
          const isSelected = config.autopilot === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onConfigChange({ autopilot: option.id })}
              className={`tc-variant-card ${isSelected ? 'tc-variant-card-selected' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-bank-gray-dark">{option.name}</p>
                <p className="text-sm font-semibold text-bank-gray-dark">
                  {option.price === 0 ? 'Included' : `AED ${option.price.toLocaleString()}`}
                </p>
              </div>
              <p className="text-xs text-bank-gray-mid">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 3: Create ChargingSection**

```jsx
import { CHARGING_ACCESSORIES } from '../../utils/tesla-configurator-data.js';

export default function ChargingSection({ config, onConfigChange }) {
  const selected = config.chargingAccessories || [];

  function toggle(id) {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    onConfigChange({ chargingAccessories: next });
  }

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">Charging</h2>
      <p className="tc-section-subtitle">Every Tesla includes access to the largest global Supercharging network</p>
      <div className="space-y-3">
        {CHARGING_ACCESSORIES.map(item => {
          const checked = selected.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`tc-checkbox-card ${checked ? 'tc-checkbox-card-checked' : ''}`}
            >
              <div className={`tc-checkbox ${checked ? 'tc-checkbox-checked' : ''}`}>
                {checked && <span className="text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-bank-gray-dark">{item.name}</p>
                <p className="text-xs text-bank-gray-mid">{item.description}</p>
              </div>
              <p className="text-sm font-semibold text-bank-gray-dark">AED {item.price.toLocaleString()}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 4: Create AccessoriesSection**

```jsx
import { ACCESSORIES } from '../../utils/tesla-configurator-data.js';

export default function AccessoriesSection({ config, onConfigChange }) {
  const selected = config.accessories || [];

  function toggle(id) {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    onConfigChange({ accessories: next });
  }

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">Accessories</h2>
      <div className="space-y-3 mt-3">
        {ACCESSORIES.map(item => {
          const checked = selected.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`tc-checkbox-card ${checked ? 'tc-checkbox-card-checked' : ''}`}
            >
              <div className={`tc-checkbox ${checked ? 'tc-checkbox-checked' : ''}`}>
                {checked && <span className="text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-bank-gray-dark">{item.name}</p>
              </div>
              <p className="text-sm font-semibold text-bank-gray-dark">AED {item.price.toLocaleString()}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add src/components/TeslaBuyingJourney/TowHitchSection.jsx src/components/TeslaBuyingJourney/AutopilotSection.jsx src/components/TeslaBuyingJourney/ChargingSection.jsx src/components/TeslaBuyingJourney/AccessoriesSection.jsx
git commit -m "feat(configurator): add TowHitch, Autopilot, Charging, Accessories sections"
```

---

### Task 7: Build StickyBottomBar component

**Files:**
- Create: `src/components/TeslaBuyingJourney/StickyBottomBar.jsx`

**Step 1: Create the sticky bottom bar with dynamic pricing and green loan mode**

```jsx
import { getPurchasePrice, calculateMonthly, MODEL_3_VARIANTS } from '../../utils/tesla-configurator-data.js';

export default function StickyBottomBar({ config, paymentMode, greenRate, tierName, onOrderClick, onEditTerms }) {
  const variant = MODEL_3_VARIANTS.find(v => v.id === config.variant);
  if (!variant) return null;

  const purchasePrice = getPurchasePrice(config);
  const isGreen = paymentMode === 'green-loan';

  function getDisplayPrice() {
    switch (paymentMode) {
      case 'cash':
        return { main: `AED ${purchasePrice.toLocaleString()}`, sub: 'Purchase Price' };
      case 'lease':
        return { main: `AED ${variant.monthlyPayments.lease.toLocaleString()} /mo*`, sub: `AED ${purchasePrice.toLocaleString()} Purchase Price` };
      case 'loan':
        return { main: `AED ${variant.monthlyPayments.loan.toLocaleString()} /mo*`, sub: `AED ${purchasePrice.toLocaleString()} Purchase Price` };
      case 'islamic':
        return { main: `AED ${variant.monthlyPayments.islamic.toLocaleString()} /mo*`, sub: `AED ${purchasePrice.toLocaleString()} Purchase Price` };
      case 'green-loan': {
        const down = purchasePrice * 0.10;
        const emi = Math.round(calculateMonthly(purchasePrice - down, greenRate, 5));
        return {
          main: `AED ${emi.toLocaleString()} /mo*`,
          sub: tierName ? `${tierName} • ${greenRate.toFixed(2)}%` : `${greenRate.toFixed(2)}% Green Rate`,
        };
      }
      default:
        return { main: `AED ${purchasePrice.toLocaleString()}`, sub: '' };
    }
  }

  const price = getDisplayPrice();

  return (
    <div className={`tc-bottom-bar ${isGreen ? 'tc-bottom-bar-green' : ''}`}>
      <button onClick={onEditTerms} className="text-left">
        <p className="text-lg font-bold text-bank-gray-dark">{price.main}</p>
        <p className="text-xs text-bank-gray-mid">{price.sub}</p>
      </button>
      <button
        onClick={onOrderClick}
        className={`tc-order-btn ${isGreen ? 'tc-order-btn-green' : 'tc-order-btn-dark'}`}
      >
        {isGreen ? 'Apply for Green Loan' : 'Order Now'}
      </button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TeslaBuyingJourney/StickyBottomBar.jsx
git commit -m "feat(configurator): add StickyBottomBar with payment mode pricing and green loan CTA"
```

---

### Task 8: Build OrderSummary and GreenLoanSummary

**Files:**
- Create: `src/components/TeslaBuyingJourney/OrderSummary.jsx`

**Step 1: Create OrderSummary with green loan comparison mode**

```jsx
import { useState } from 'react';
import {
  getTotalPrice, getPurchasePrice, DESTINATION_FEE, calculateMonthly,
  MODEL_3_VARIANTS, EXTERIOR_COLORS, WHEEL_OPTIONS, AUTOPILOT_OPTIONS,
  CHARGING_ACCESSORIES, ACCESSORIES, TOW_HITCH,
} from '../../utils/tesla-configurator-data.js';

export default function OrderSummary({ config, paymentMode, greenRate, tierName, score, onApply, onClose }) {
  const [showDetails, setShowDetails] = useState(false);
  const variant = MODEL_3_VARIANTS.find(v => v.id === config.variant);
  const color = EXTERIOR_COLORS.find(c => c.id === config.exteriorColor);
  const wheels = WHEEL_OPTIONS.find(w => w.id === config.wheels);
  const autopilot = AUTOPILOT_OPTIONS.find(a => a.id === config.autopilot);
  const isGreen = paymentMode === 'green-loan';
  const totalPrice = getTotalPrice(config);
  const purchasePrice = getPurchasePrice(config);

  if (!variant) return null;

  const lineItems = [
    { label: `Model 3 ${variant.subtitle}`, amount: variant.price },
    color?.price > 0 && { label: `${color.name} Paint`, amount: color.price },
    wheels?.price > 0 && { label: wheels.name, amount: wheels.price },
    autopilot?.price > 0 && { label: autopilot.name, amount: autopilot.price },
    config.towHitch && { label: 'Tow Hitch', amount: TOW_HITCH.price },
    ...(config.chargingAccessories || []).map(id => {
      const item = CHARGING_ACCESSORIES.find(c => c.id === id);
      return item ? { label: item.name, amount: item.price } : null;
    }),
    ...(config.accessories || []).map(id => {
      const item = ACCESSORIES.find(a => a.id === id);
      return item ? { label: item.name, amount: item.price } : null;
    }),
  ].filter(Boolean);

  // Green loan calculations
  const greenDown = purchasePrice * 0.10;
  const greenPrincipal = purchasePrice - greenDown;
  const greenEmi = calculateMonthly(greenPrincipal, greenRate, 5);
  const greenTotalInterest = (greenEmi * 60) - greenPrincipal;

  // Tesla loan comparison
  const teslaDown = purchasePrice * 0.20;
  const teslaPrincipal = purchasePrice - teslaDown;
  const teslaEmi = calculateMonthly(teslaPrincipal, 0, 5); // 0% APR
  const teslaTotalCost = teslaDown + (teslaEmi * 60);

  const greenTotalCost = greenDown + (greenEmi * 60);

  return (
    <div className="tc-order-summary">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-bank-gray-dark">Your Model 3</h3>
            <p className="text-xs text-bank-gray-mid mt-1">Estimated Delivery: May 2026</p>
          </div>
          <button onClick={onClose} className="text-bank-gray-mid hover:text-bank-gray-dark text-xl">&times;</button>
        </div>

        {/* Pricing details toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="tc-terms-link mb-4 block"
        >
          {showDetails ? 'Hide' : 'Show'} Pricing Details
        </button>

        {showDetails && (
          <div className="space-y-2 mb-6 pb-4 border-b border-bank-gray-alt">
            {lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-bank-gray-mid">{item.label}</span>
                <span className="text-bank-gray-dark">
                  {item.amount === 0 ? 'Included' : `AED ${item.amount.toLocaleString()}`}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-bank-gray-alt">
              <span className="text-bank-gray-mid">Destination & doc fee</span>
              <span className="text-bank-gray-dark">AED {DESTINATION_FEE.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2">
              <span className="text-bank-gray-dark">Purchase Price</span>
              <span className="text-bank-gray-dark">AED {purchasePrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Green Loan comparison */}
        {isGreen ? (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border-2 border-green-deep bg-green-pale">
              <div className="flex items-center gap-2 mb-3">
                <span className="tc-green-pill">{tierName || 'Green Rate'}</span>
                <span className="text-sm font-semibold text-green-deep">{greenRate.toFixed(2)}%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-deep">AED {Math.round(greenEmi).toLocaleString()}</p>
                  <p className="text-xs text-bank-gray-mid">Monthly EMI</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-bank-gray-dark">AED {Math.round(greenDown).toLocaleString()}</p>
                  <p className="text-xs text-bank-gray-mid">Down (10%)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-bank-gray-dark">5 years</p>
                  <p className="text-xs text-bank-gray-mid">Term</p>
                </div>
              </div>
            </div>

            {/* vs Tesla comparison */}
            <div className="p-4 rounded-xl bg-bank-gray-bg">
              <p className="text-xs font-semibold text-bank-gray-mid uppercase tracking-wider mb-3">vs Tesla Finance (0% APR)</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-bank-gray-mid">Tesla down payment (20%)</span>
                  <span className="text-bank-gray-dark">AED {Math.round(teslaDown).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bank-gray-mid">Your down payment (10%)</span>
                  <span className="text-green-deep font-semibold">AED {Math.round(greenDown).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-bank-gray-alt">
                  <span className="text-bank-gray-mid">Liquidity you keep</span>
                  <span className="text-green-deep font-bold">AED {Math.round(teslaDown - greenDown).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onApply}
              className="w-full tc-order-btn tc-order-btn-green py-3 text-base"
            >
              Apply for Green Car Loan
            </button>
            <p className="text-xs text-bank-gray text-center">Indicative figures only. Subject to credit approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-bank-gray-mid">Due Today</span>
              <div className="text-right">
                <p className="font-semibold text-bank-gray-dark">AED 5,000</p>
                <p className="text-xs text-bank-gray">Non-refundable Order Fee</p>
              </div>
            </div>
            <button className="w-full tc-order-btn tc-order-btn-dark py-3 text-base border border-bank-gray-dark bg-transparent text-bank-gray-dark hover:bg-bank-gray-bg">
              Order with Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TeslaBuyingJourney/OrderSummary.jsx
git commit -m "feat(configurator): add OrderSummary with green loan comparison and Tesla finance side-by-side"
```

---

### Task 9: Build FinancingModal

**Files:**
- Create: `src/components/TeslaBuyingJourney/FinancingModal.jsx`

**Step 1: Create FinancingModal with green loan calculator**

```jsx
import { useState } from 'react';
import { calculateMonthly, getPurchasePrice, MODEL_3_VARIANTS, PAYMENT_MODES } from '../../utils/tesla-configurator-data.js';
import { BANK_FINANCING } from '../../utils/tesla-configurator-data.js';
import { getImageUrl, IMAGE_VIEWS } from '../../utils/tesla-configurator-data.js';

export default function FinancingModal({ config, paymentMode, greenRate, tierName, score, onPaymentModeChange, onClose }) {
  const purchasePrice = getPurchasePrice(config);
  const variant = MODEL_3_VARIANTS.find(v => v.id === config.variant);
  const isGreen = paymentMode === 'green-loan';

  const [downPct, setDownPct] = useState(isGreen ? 10 : 20);
  const [termYears, setTermYears] = useState(5);

  const downPayment = purchasePrice * (downPct / 100);
  const principal = purchasePrice - downPayment;

  const rate = isGreen ? greenRate : 0; // Tesla offers 0% for loan mode
  const emi = calculateMonthly(principal, rate, termYears);
  const totalInterest = (emi * termYears * 12) - principal;

  const imageUrl = getImageUrl({ ...config, _view: IMAGE_VIEWS.REAR });

  return (
    <div className="tc-modal-overlay">
      <div className="tc-modal-backdrop" onClick={onClose} />
      <div className="tc-modal">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — car image */}
          <div className="hidden lg:flex items-center justify-center bg-[#f4f4f4] rounded-l-xl p-8">
            {imageUrl && <img src={imageUrl} alt="Model 3" className="max-w-full" />}
          </div>

          {/* Right — financing options */}
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-bank-gray-dark">Financing Options</h2>
              <button onClick={onClose} className="text-bank-gray-mid hover:text-bank-gray-dark text-xl">&times;</button>
            </div>

            {/* Payment mode selector */}
            <select
              value={paymentMode}
              onChange={e => onPaymentModeChange(e.target.value)}
              className={`tc-payment-select mb-6 ${isGreen ? 'tc-payment-select-green' : ''}`}
            >
              {PAYMENT_MODES.map(mode => (
                <option key={mode.id} value={mode.id}>
                  {mode.id === 'green-loan' ? '🟢 ' : ''}{mode.label}
                </option>
              ))}
            </select>

            {/* EMI display */}
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-bank-gray-dark">
                AED {Math.round(emi).toLocaleString()} <span className="text-lg font-normal">/mo est.</span>
              </p>
              {isGreen && tierName && (
                <span className="tc-green-pill mt-2">{tierName} • {greenRate.toFixed(2)}%</span>
              )}
            </div>

            {/* Sliders (for green loan and loan modes) */}
            {(isGreen || paymentMode === 'loan') && (
              <div className="space-y-6 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-bank-gray-mid">Down Payment</span>
                    <span className="font-semibold text-bank-gray-dark">{downPct}% — AED {Math.round(downPayment).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={isGreen ? 10 : 20}
                    max={50}
                    step={5}
                    value={downPct}
                    onChange={e => setDownPct(Number(e.target.value))}
                    className="tc-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-bank-gray-mid">Loan Term</span>
                    <span className="font-semibold text-bank-gray-dark">{termYears} years</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={isGreen ? 7 : 5}
                    step={1}
                    value={termYears}
                    onChange={e => setTermYears(Number(e.target.value))}
                    className="tc-slider"
                  />
                </div>
              </div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-bank-gray-bg text-center">
                <p className="text-sm font-bold text-bank-gray-dark">AED {Math.round(emi).toLocaleString()}</p>
                <p className="text-xs text-bank-gray-mid">Monthly EMI</p>
              </div>
              <div className="p-3 rounded-xl bg-bank-gray-bg text-center">
                <p className="text-sm font-bold text-bank-gray-dark">AED {Math.round(totalInterest).toLocaleString()}</p>
                <p className="text-xs text-bank-gray-mid">Total Interest</p>
              </div>
              <div className="p-3 rounded-xl bg-bank-gray-bg text-center">
                <p className="text-sm font-bold text-bank-gray-dark">AED {Math.round(principal).toLocaleString()}</p>
                <p className="text-xs text-bank-gray-mid">Loan Amount</p>
              </div>
            </div>

            {/* Green loan benefits */}
            {isGreen && (
              <div className="p-4 rounded-xl bg-green-pale border border-green-deep/20 mb-4">
                <p className="text-xs font-semibold text-green-deep uppercase tracking-wider mb-2">Green Car Loan Benefits</p>
                <ul className="space-y-1.5">
                  {['10% minimum down — keep more cash', 'Up to 7-year flexible terms', 'GreenDrive tier rate reductions', '15% EV insurance discount', '3x cashback on EV charging', '30-day rate lock guarantee'].map((b, i) => (
                    <li key={i} className="text-xs text-bank-gray-dark flex items-center gap-2">
                      <span className="text-green-deep">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-bank-gray text-center">
              {isGreen
                ? 'Indicative figures only. Subject to credit approval and GreenDrive score verification.'
                : paymentMode === 'islamic'
                  ? 'Murabaha finance amount at profit rate of 0% p.a. Dubai Islamic Bank PJSC.'
                  : 'Est. monthly payment excludes taxes and fees.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TeslaBuyingJourney/FinancingModal.jsx
git commit -m "feat(configurator): add FinancingModal with green loan calculator and benefits"
```

---

### Task 10: Rewrite TeslaBuyingJourneyApp orchestrator

**Files:**
- Modify: `src/components/TeslaBuyingJourney/TeslaBuyingJourneyApp.jsx` (full rewrite)

**Step 1: Rewrite TeslaBuyingJourneyApp as single-scroll orchestrator**

Replace the entire file:

```jsx
import { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import CarImagePanel from './CarImagePanel.jsx';
import PaymentModeSelect from './PaymentModeSelect.jsx';
import VariantSection from './VariantSection.jsx';
import ExteriorSection from './ExteriorSection.jsx';
import WheelSection from './WheelSection.jsx';
import TowHitchSection from './TowHitchSection.jsx';
import InteriorSection from './InteriorSection.jsx';
import AutopilotSection from './AutopilotSection.jsx';
import ChargingSection from './ChargingSection.jsx';
import AccessoriesSection from './AccessoriesSection.jsx';
import StickyBottomBar from './StickyBottomBar.jsx';
import OrderSummary from './OrderSummary.jsx';
import FinancingModal from './FinancingModal.jsx';
import { TIERS, BASE_RATE, MOCK_DASHBOARD } from '../../utils/constants.js';

const ApplyModal = lazy(() => import('../Rate/ApplyModal.jsx'));

export default function TeslaBuyingJourneyApp({ score }) {
  const [config, setConfig] = useState({
    variant: null,
    exteriorColor: 'pearl-white',
    wheels: null,
    interior: null,
    autopilot: 'basic',
    towHitch: false,
    chargingAccessories: [],
    accessories: [],
  });
  const [paymentMode, setPaymentMode] = useState('cash');
  const [showOrder, setShowOrder] = useState(false);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const effectiveScore = score || MOCK_DASHBOARD.score;
  const tier = TIERS.find(t => t.name === effectiveScore.tier);
  const greenRate = BASE_RATE - (effectiveScore.rateReduction || 0);

  const handleConfigChange = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleOrderClick = () => {
    setShowOrder(true);
    setTimeout(() => {
      document.getElementById('tc-order-summary')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Promo banner */}
      <div className="tc-promo-banner">
        Available with 0% rate for 5 years and 1 year insurance coverage.
        <a href="#" onClick={e => { e.preventDefault(); setPaymentMode('green-loan'); }}>
          Explore Green Car Loan
        </a>
      </div>

      {/* Two-column configurator layout */}
      <div className="tc-layout">
        {/* Left — sticky car image */}
        <CarImagePanel config={config} />

        {/* Right — options panel */}
        <div className="tc-options">
          <h1 className="text-3xl font-bold text-bank-gray-dark mb-1">Model 3</h1>

          <PaymentModeSelect
            paymentMode={paymentMode}
            onPaymentModeChange={setPaymentMode}
          />

          {/* Configuration sections */}
          <VariantSection
            config={config}
            paymentMode={paymentMode}
            greenRate={greenRate}
            tierName={effectiveScore.tier}
            onConfigChange={handleConfigChange}
          />

          {config.variant && (
            <>
              <ExteriorSection config={config} onConfigChange={handleConfigChange} />
              <WheelSection config={config} onConfigChange={handleConfigChange} />
              <TowHitchSection config={config} onConfigChange={handleConfigChange} />
              <InteriorSection config={config} />
              <AutopilotSection config={config} onConfigChange={handleConfigChange} />
              <ChargingSection config={config} onConfigChange={handleConfigChange} />
              <AccessoriesSection config={config} onConfigChange={handleConfigChange} />
            </>
          )}
        </div>
      </div>

      {/* Order summary — inline reveal */}
      {showOrder && (
        <div id="tc-order-summary">
          <OrderSummary
            config={config}
            paymentMode={paymentMode}
            greenRate={greenRate}
            tierName={effectiveScore.tier}
            score={effectiveScore}
            onApply={() => setShowApplyModal(true)}
            onClose={() => setShowOrder(false)}
          />
        </div>
      )}

      {/* Sticky bottom bar */}
      {config.variant && (
        <StickyBottomBar
          config={config}
          paymentMode={paymentMode}
          greenRate={greenRate}
          tierName={effectiveScore.tier}
          onOrderClick={handleOrderClick}
          onEditTerms={() => setShowFinancingModal(true)}
        />
      )}

      {/* Financing modal */}
      {showFinancingModal && (
        <FinancingModal
          config={config}
          paymentMode={paymentMode}
          greenRate={greenRate}
          tierName={effectiveScore.tier}
          score={effectiveScore}
          onPaymentModeChange={setPaymentMode}
          onClose={() => setShowFinancingModal(false)}
        />
      )}

      {/* Apply modal (reused from Rate tab) */}
      {showApplyModal && effectiveScore && (
        <Suspense fallback={null}>
          <ApplyModal score={effectiveScore} onClose={() => setShowApplyModal(false)} />
        </Suspense>
      )}
    </>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TeslaBuyingJourney/TeslaBuyingJourneyApp.jsx
git commit -m "feat(configurator): rewrite TeslaBuyingJourneyApp as single-scroll Tesla replica with green loan"
```

---

### Task 11: Update App.jsx wrapper for new configurator layout

**Files:**
- Modify: `src/App.jsx` (lines 120-156, the `tesla-buying` channel block)

**Step 1: Update the tesla-buying channel to remove max-width constraint and loading skeleton**

The new configurator is full-width (two-column layout handles its own sizing). Replace the tesla-buying block:

Find in `src/App.jsx` the block:
```jsx
  // Tesla Buying Journey channel — configurator + financing
  if (activeChannel === 'tesla-buying') {
```

Replace the Suspense fallback and wrapper — remove `max-w-3xl mx-auto px-6 py-8` since the configurator is now full-width. The key changes:
- Remove the max-width wrapper div inside Suspense fallback
- Keep Header and Footer but the configurator itself manages its own layout

The updated block should render TeslaBuyingJourneyApp without a constrained wrapper since it uses tc-layout (full viewport grid).

**Step 2: Verify by navigating to "Buy Tesla" channel**

Expected: Two-column layout, car image on left, options on right. No max-width constraint.

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(configurator): update App.jsx wrapper for full-width configurator layout"
```

---

### Task 12: Delete old wizard components

**Files:**
- Delete: `src/components/TeslaBuyingJourney/ConfiguratorShell.jsx`
- Delete: `src/components/TeslaBuyingJourney/shared/StepProgress.jsx`
- Delete: `src/components/TeslaBuyingJourney/shared/ConfigSummaryBar.jsx`
- Delete: `src/components/TeslaBuyingJourney/shared/OptionCard.jsx`
- Delete: `src/components/TeslaBuyingJourney/shared/SpecBadge.jsx`
- Delete: `src/components/TeslaBuyingJourney/steps/VariantStep.jsx`
- Delete: `src/components/TeslaBuyingJourney/steps/ExteriorStep.jsx`
- Delete: `src/components/TeslaBuyingJourney/steps/WheelsStep.jsx`
- Delete: `src/components/TeslaBuyingJourney/steps/InteriorStep.jsx`
- Delete: `src/components/TeslaBuyingJourney/steps/AutopilotStep.jsx`
- Delete: `src/components/TeslaBuyingJourney/steps/ReviewStep.jsx`
- Delete: `src/components/TeslaBuyingJourney/steps/FinancingStep.jsx`

**Step 1: Delete all old wizard files**

```bash
rm src/components/TeslaBuyingJourney/ConfiguratorShell.jsx
rm -r src/components/TeslaBuyingJourney/shared/
rm -r src/components/TeslaBuyingJourney/steps/
```

**Step 2: Verify app still loads**

Navigate to "Buy Tesla" channel. Confirm no import errors in console.

**Step 3: Commit**

```bash
git add -u
git commit -m "chore(configurator): remove old wizard components replaced by Tesla replica"
```

---

### Task 13: End-to-end verification and polish

**Step 1: Manual verification checklist**

Test each of these in the browser:

1. Navigate to "Buy Tesla" channel
2. Verify two-column layout (image left, options right)
3. Select each variant — car image updates, specs row updates
4. Switch colors — car image updates
5. Switch wheels — car image updates, range badge updates
6. Toggle tow hitch (only visible on premium/performance)
7. Select autopilot packages
8. Add/remove charging accessories
9. Add/remove accessories
10. Switch payment modes — variant prices update
11. Select "Green Car Loan" — green accents appear, tier badge shows, EMIs use green rate
12. Click price in bottom bar — financing modal opens
13. In financing modal: adjust down payment and term sliders, EMI recalculates
14. Click "Order Now" / "Apply for Green Loan" — order summary reveals inline
15. In order summary: toggle pricing details, verify line items
16. Green loan summary shows comparison vs Tesla Finance
17. Click "Apply for Green Car Loan" — ApplyModal opens
18. Mobile responsive: stack vertically, image on top

**Step 2: Fix any issues found during verification**

**Step 3: Final commit**

```bash
git add .
git commit -m "feat(configurator): Tesla Model 3 configurator replica with Green Car Loan integration"
```
