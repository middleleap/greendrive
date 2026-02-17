# Tesla Model 3 Configurator Redesign + Green Loan Integration

**Date:** 2026-02-17
**Status:** Approved

## Goal

Replace the current 7-step wizard configurator with a full replica of Tesla's UAE Model 3 configurator (tesla.com/en_AE/model3/design), adding a 5th "Green Car Loan" payment mode powered by GreenDrive scoring.

## Layout

Single-scroll, two-column page matching Tesla.com:

- **Left column (60%):** Sticky car image panel using Tesla's compositor CDN. View toggle (front/side) with arrow buttons. Light grey background (`#f4f4f4`).
- **Right column (40%):** All configuration options stacked vertically, white background.
- **Mobile:** Stacks vertically — car image on top, options below.
- **Sticky bottom bar:** Dynamic price + "Order Now" (or "Apply for Green Loan") CTA.

## Tesla Compositor Image Integration

Base URL: `https://static-assets.tesla.com/configurator/compositor`

Parameters: `context=design_studio_2`, `model=m3`, `size=1920`, `bkba_opt=2`, `view=STUD_FRONT34|STUD_SIDEVIEW`

Option codes are comma-separated with `$` prefix:

### Trim Codes
| Variant | Code |
|---------|------|
| Base RWD | MT367 |
| Premium LR RWD | MT369 |
| Premium LR AWD | MT370 |
| Performance | MT371 |

### Color Codes
| Color | Code | Price (AED) | Availability |
|-------|------|-------------|-------------|
| Pearl White Multi-Coat | PPSW | Included | All |
| Diamond Black | PX02 | 5,300 | All |
| Stealth Grey | PN01 | 5,300 | All |
| Marine Blue | PB02 | 5,300 | Premium/Perf |
| Ultra Red | PR01 | 8,000 | Premium/Perf |
| Quicksilver | PN00 | 8,000 | Premium/Perf |

### Wheel Codes
| Wheel | Code | Price (AED) | Availability |
|-------|------|-------------|-------------|
| 18" Prismata | W38C | Included | Base RWD |
| 18" Photon | W38A | Included | Premium LR |
| 19" Nova | W39S | 6,500 | Premium LR |
| 20" Warp | W30P | Included | Performance |

### Interior Codes
| Interior | Code | Trim |
|----------|------|------|
| Black (textile) | IBB4 | Base RWD |
| Black (microsuede) | IPB2 | LR RWD, LR AWD |
| Black (carbon fiber) | IPB4 | Performance |

Images update live as user changes color, wheels, or variant. Alternate view is preloaded for instant switching.

## Payment Mode Dropdown (5 modes)

Dropdown selector above variant cards. Modes:

1. **Cash** — one-time prices (e.g., AED 144,990)
2. **Lease** — monthly (AED 7,433 down, 36mo, 15k km)
3. **Loan** — monthly (0% APR, 60mo)
4. **Islamic Finance** — monthly (Murabaha, 0% profit rate, DIB)
5. **Green Car Loan** — monthly (greenRate, 10% down, up to 84mo)

Green Car Loan mode adds green accent to UI, shows GreenDrive tier badge, and uses `greenRate = 3.99% - score.rateReduction`.

## Variant Data (Tesla UAE current)

| Variant | Price (AED) | Range (WLTP) | 0-100 | Top Speed |
|---------|-------------|-------------|-------|-----------|
| Rear-Wheel Drive | 144,990 | 534 km | 6.2s | 201 km/h |
| Premium LR RWD | 164,990 | 750 km | 5.2s | 201 km/h |
| Premium LR AWD | 184,990 | 660 km | 4.4s | 201 km/h |
| Performance AWD | 214,990 | 571 km | 3.1s | 262 km/h |

Monthly payments per mode stored in data file (pre-calculated from Tesla.com).

## Configuration Sections

### Exterior Colors
Circular swatches in horizontal row. Variant-dependent availability (3 for base, 6 for premium/performance). Selected swatch gets ring highlight. Section shows color name + price.

### Wheels
Circular swatches with wheel images. Variant-dependent options. Shows certified range impact when switching wheels. Nova wheels reduce range.

### Tow Hitch
Checkbox card. AED 5,000. Only available on Premium and Performance variants (not base RWD).

### Interior
Single option per variant (Black). Circular swatch selector.

### Autopilot Packages
3 radio-button cards:
- Basic Autopilot — Included
- Enhanced Autopilot — AED 14,100
- Full Self-Driving — AED 28,100

### Charging Accessories
2 checkbox cards with product description:
- Wall Connector — AED 2,300
- Mobile Connector — AED 909

### Accessories
3 checkbox rows:
- All-Weather Interior Liners — AED 720
- Roof Rack — AED 1,872
- Center Console Trays — AED 150

## Green Loan Differentiation

When Green Car Loan payment mode is active:

### Variant Cards
Each shows Green EMI with green pill badge: `"Gold tier - 3.49%"`

### Financing Modal
Triggered by "Edit Financial Terms" link. Shows:
- Left: car image (rear 3/4 view)
- Right: Green Loan calculator with down payment slider (10-50%), term selector (2-7 years), rate with tier badge, EMI result with Tesla Finance comparison, benefits checklist

### Sticky Bottom Bar
Green accent. Shows: `"AED X,XXX /mo - Gold Green Rate"` + green "Apply for Green Loan" button instead of "Order Now".

### Order Summary (Green mode)
Bank-branded inline summary with:
- Config line-item pricing
- Green Loan terms
- Side-by-side comparison vs Tesla Finance
- Total cost of financing comparison
- "Apply for Green Car Loan" CTA → opens existing ApplyModal
- Tier progress indicator

## Component Architecture

```
TeslaBuyingJourneyApp.jsx          <- orchestrator
  PromoBanner.jsx                  <- gold offer banner
  ConfiguratorLayout.jsx           <- 2-column responsive layout
    CarImagePanel.jsx              <- sticky, compositor images, view toggle
    OptionsPanel.jsx               <- scrollable right panel
      PaymentModeSelect.jsx        <- 5-mode dropdown
      VariantSection.jsx           <- specs + variant cards
      ExteriorSection.jsx          <- color swatches
      WheelSection.jsx             <- wheel swatches + range impact
      TowHitchSection.jsx          <- checkbox
      InteriorSection.jsx          <- interior swatch
      AutopilotSection.jsx         <- 3 radio cards
      ChargingSection.jsx          <- 2 checkbox cards
      AccessoriesSection.jsx       <- 3 checkbox rows
  OrderSummary.jsx                 <- inline reveal
    PricingBreakdown.jsx           <- line items
    GreenLoanSummary.jsx           <- green loan comparison
  FinancingModal.jsx               <- terms editor
  CompareModal.jsx                 <- features & compare models
  StickyBottomBar.jsx              <- price + CTA
```

## Data File

`tesla-configurator-data.js` rewritten with:
- All variant/color/wheel/interior/autopilot data with Tesla option codes
- Variant-dependent availability maps
- `buildTeslaImageUrl()` compositor function
- All 5 payment mode calculators
- Tow hitch, charging, accessories data
- Compare features data structure

## What Gets Deleted

All current wizard components replaced:
- ConfiguratorShell.jsx (wizard wrapper)
- StepProgress.jsx (step dots)
- ConfigSummaryBar.jsx (wizard summary bar)
- VariantStep.jsx, ExteriorStep.jsx, WheelsStep.jsx, InteriorStep.jsx, AutopilotStep.jsx, ReviewStep.jsx, FinancingStep.jsx (all 7 steps)
- OptionCard.jsx, SpecBadge.jsx (wizard shared components)

Reused from existing codebase:
- ApplyModal.jsx (lazy-loaded rate application modal)
- GreenDrive score/tier data from dashboard

## CSS Approach

New CSS classes in `bank-theme.css` for:
- Two-column configurator layout with sticky image panel
- Tesla-style radio cards and circular swatches
- Payment mode dropdown
- Sticky bottom bar
- Financing modal
- Order summary
- Green Loan accent styling

Remove old wizard CSS classes (cfg-step-dot, cfg-step-connector, etc.).
