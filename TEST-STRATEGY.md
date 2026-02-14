# Test Strategy & Plan — Bank GreenDrive

## Document Info

| Field | Value |
|---|---|
| Version | 1.0 |
| Date | February 2026 |
| Status | Proposed |
| Scope | Full-stack testing: Express backend, React frontend, scoring engine, integrations |

---

## 1. Executive Summary

Bank GreenDrive currently has no automated test infrastructure (V1 relied on manual validation). This document defines a comprehensive test strategy covering unit, integration, API, component, and end-to-end testing layers. The strategy is designed around the project's two-process architecture (Express backend on port 3001, React/Vite frontend on port 3000), the three-layer mock fallback system, and the GreenDrive scoring engine.

### Goals

- Catch scoring regressions before they affect tier assignments and rate reduction calculations
- Validate the three-layer data fallback (live → server mock → frontend mock) behaves identically from the user's perspective
- Ensure Tesla API integration handles all documented error states (401, 408, 429, 500)
- Verify brand compliance (colors, typography, layout) does not drift
- Enable confident refactoring of the scoring engine and API layer
- Provide CI-executable test suites that run without Tesla credentials

---

## 2. Test Architecture

### 2.1 Recommended Tooling

| Layer | Tool | Rationale |
|---|---|---|
| Unit tests (backend) | **Vitest** | Native ESM support (project uses `"type": "module"`), fast, compatible with Vite ecosystem |
| Unit tests (frontend) | **Vitest + React Testing Library** | Same test runner across the stack, RTL encourages testing user behavior over implementation |
| API / Integration tests | **Vitest + supertest** | HTTP assertion library for Express, no server startup needed |
| Component tests | **Vitest + @testing-library/react + jsdom** | Lightweight DOM environment for React component assertions |
| End-to-end tests | **Playwright** | Cross-browser, reliable selectors, screenshot comparison capability |
| Visual regression | **Playwright screenshots** | Lightweight approach matching the prototype scope |
| Coverage | **Vitest built-in (v8)** | Integrated coverage with no extra config |

### 2.2 Test Pyramid

```
         ┌───────────┐
         │    E2E     │   ~10 tests  — Critical user flows
         │ Playwright │
         ├───────────┤
         │ Integration│   ~20 tests  — API endpoints, data flow
         │  supertest │
         ├───────────┤
         │  Component │   ~25 tests  — React components render correctly
         │    RTL     │
         ├───────────┤
         │   Unit     │   ~45 tests  — Scoring, cache, formatters, utils
         │  Vitest    │
         └───────────┘
```

### 2.3 Directory Structure

```
greendrive/
├── tests/
│   ├── unit/
│   │   ├── scoring/
│   │   │   ├── engine.test.js
│   │   │   ├── tiers.test.js
│   │   │   └── weights.test.js
│   │   ├── cache.test.js
│   │   ├── tesla-client.test.js
│   │   └── format.test.js
│   ├── integration/
│   │   ├── api/
│   │   │   ├── dashboard.test.js
│   │   │   ├── vehicles.test.js
│   │   │   ├── vehicle-data.test.js
│   │   │   ├── charging.test.js
│   │   │   ├── green-score.test.js
│   │   │   └── auth-status.test.js
│   │   └── fallback.test.js
│   ├── components/
│   │   ├── ScoreGauge.test.jsx
│   │   ├── ScoreBreakdown.test.jsx
│   │   ├── TierBadge.test.jsx
│   │   ├── VehicleDetails.test.jsx
│   │   ├── BatteryStatus.test.jsx
│   │   ├── ChargingPattern.test.jsx
│   │   ├── RateBenefit.test.jsx
│   │   ├── TierTable.test.jsx
│   │   ├── SavingsProjection.test.jsx
│   │   ├── Header.test.jsx
│   │   ├── TabBar.test.jsx
│   │   └── shared/
│   │       ├── Card.test.jsx
│   │       ├── Badge.test.jsx
│   │       ├── ProgressBar.test.jsx
│   │       └── AnimatedNumber.test.jsx
│   ├── e2e/
│   │   ├── dashboard-flow.spec.js
│   │   ├── tab-navigation.spec.js
│   │   ├── mock-mode.spec.js
│   │   ├── dark-mode.spec.js
│   │   └── responsive.spec.js
│   └── fixtures/
│       ├── tesla-vehicle-data.json
│       ├── tesla-charging-history.json
│       ├── tesla-vehicle-list.json
│       └── tesla-error-responses.json
├── vitest.config.js
└── playwright.config.js
```

---

## 3. Unit Tests

### 3.1 Scoring Engine (`server/scoring/engine.js`)

The scoring engine is the most critical business logic in the application. Every scoring function requires thorough boundary-value testing.

#### 3.1.1 `scoreBatteryHealth`

| # | Test Case | Input | Expected Score | Expected Detail |
|---|-----------|-------|----------------|-----------------|
| 1 | Perfect health — Model Y, full retention | `battery_level: 100, battery_range: 330, vin: '5YJYGDEE...'` | 20 | "100% estimated health" |
| 2 | Good health — Model Y, 90% retention | `battery_level: 80, battery_range: 237.6` | 18 | "90% estimated health" |
| 3 | Degraded — Model Y, 70% retention | `battery_level: 80, battery_range: 184.8` | 14 | "70% estimated health" |
| 4 | Missing battery_level | `battery_level: null` | 10 | "Insufficient data" |
| 5 | Missing battery_range | `battery_range: null` | 10 | "Insufficient data" |
| 6 | Over 100% retention (capped) | `battery_level: 50, battery_range: 200` | 20 | "100% estimated health" |
| 7 | Model S EPA range (405 mi) | `vin: '5YJS...', battery_level: 100, battery_range: 405` | 20 | "100% estimated health" |
| 8 | Model 3 EPA range (358 mi) | `vin: '5YJ3...', battery_level: 100, battery_range: 358` | 20 | "100% estimated health" |
| 9 | Cybertruck EPA range (340 mi) | `vin: '5YJC...', battery_level: 100, battery_range: 340` | 20 | "100% estimated health" |
| 10 | Unknown model defaults to 330 mi | `vin: '5YJZDEE...'` | Uses 330 | — |

#### 3.1.2 `scoreChargingBehavior`

| # | Test Case | `fast_charger_type` | `charging_state` | Expected Score |
|---|-----------|---------------------|------------------|----------------|
| 1 | Home charger (empty string) | `""` | `"Complete"` | 22 |
| 2 | Home charger (`<invalid>`) | `"<invalid>"` | `"Charging"` | 22 |
| 3 | Mobile Connector | `"MCSingleWireCAN"` | `"Charging"` | 20 |
| 4 | Public DC — CCS | `"CCS"` | `"Charging"` | 12 |
| 5 | Public DC — CHAdeMO | `"CHAdeMO"` | `"Charging"` | 12 |
| 6 | Supercharger | `"Tesla"` | `"Charging"` | 10 |
| 7 | Disconnected | `""` | `"Disconnected"` | 15 |
| 8 | Unknown charger type | `"SomeNewType"` | `"Charging"` | 15 |
| 9 | No charge_state at all | (undefined) | (undefined) | 15 |

#### 3.1.3 `scoreEfficiency`

| # | Test Case | Odometer (miles) | km (approx) | Expected Score |
|---|-----------|-----------------|-------------|----------------|
| 1 | Very low usage | 1,000 | ~1,609 | 10 |
| 2 | Low boundary | 3,107 | ~5,000 | 10→13 boundary |
| 3 | Light usage | 5,000 | ~8,047 | 13 |
| 4 | Moderate usage | 8,000 | ~12,875 | 15 |
| 5 | Sweet spot lower bound | 9,321 | ~15,000 | 20 |
| 6 | Sweet spot middle | 10,500 | ~16,898 | 20 |
| 7 | Sweet spot upper bound | 12,427 | ~20,000 | 20 |
| 8 | High usage | 15,534 | ~25,000 | 13 |
| 9 | Very high usage | 21,748 | ~35,000 | 8 |
| 10 | Zero odometer | 0 | 0 | 10 |
| 11 | No vehicle_state | (undefined) | 0 | 10 |

#### 3.1.4 `scoreEvOwnership`

| # | Test Case | VIN char 3 | Expected Score | Expected Detail |
|---|-----------|-----------|----------------|-----------------|
| 1 | Model S | `S` | 15 | "Full BEV" |
| 2 | Model 3 | `3` | 15 | "Full BEV" |
| 3 | Model X | `X` | 15 | "Full BEV" |
| 4 | Model Y | `Y` | 15 | "Full BEV" |
| 5 | Roadster | `R` | 15 | "Full BEV" |
| 6 | Cybertruck | `C` | 15 | "Full BEV" |
| 7 | Unknown model code | `Z` | 10 | "Vehicle type unconfirmed" |
| 8 | Null VIN | `null` | 10 | "Vehicle type unconfirmed" |

#### 3.1.5 `scoreVehicleCondition`

| # | Test Case | `car_version` | Expected Score |
|---|-----------|---------------|----------------|
| 1 | Latest (2026) | `"2026.1.2 xyz"` | 10 |
| 2 | Up to date (2025) | `"2025.2.6 abc123"` | 8 |
| 3 | Recent (2024) | `"2024.44.3 def"` | 6 |
| 4 | Outdated (2023) | `"2023.12.1 ghi"` | 4 |
| 5 | Very old (2020) | `"2020.4.1 jkl"` | 4 |
| 6 | Empty string | `""` | 4 |
| 7 | No vehicle_state | (undefined) | 4 |
| 8 | Non-standard format | `"custom_build"` | 4 |

#### 3.1.6 `scoreRenewableEnergy`

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | Always returns 0 | `{ score: 0, detail: 'Pending DEWA/Open Finance consent' }` |

#### 3.1.7 `computeGreenScore` (Integration of All Categories)

| # | Test Case | Description | Expected Tier |
|---|-----------|-------------|---------------|
| 1 | Mock data defaults | Using `MOCK_VEHICLE_DATA` | Gold Green (score ~78) |
| 2 | Platinum scenario | Home charging, 17k km, 2026 software, perfect battery | Platinum Green (≥85) |
| 3 | Standard scenario | Supercharger, 40k km, 2022 software, degraded battery | Standard (≤39) |
| 4 | Boundary: 85 exactly | Engineered to score exactly 85 | Platinum Green |
| 5 | Boundary: 84 exactly | Engineered to score exactly 84 | Gold Green |
| 6 | Boundary: 70 exactly | Score exactly 70 | Gold Green |
| 7 | Boundary: 69 exactly | Score exactly 69 | Silver Green |
| 8 | Total score is sum | Sum of all breakdown scores equals totalScore | — |
| 9 | Suggestions generated | Low charging behavior triggers suggestion | Contains "Increase home charging ratio" |
| 10 | Renewable suggestion always present | renewableEnergy is always 0 | Contains "Connect DEWA via Open Finance" |

#### 3.1.8 `getSuggestions`

| # | Condition | Expected Suggestion |
|---|-----------|---------------------|
| 1 | `chargingBehavior.score < 20` | "Increase home charging ratio" (+5 pts) |
| 2 | `renewableEnergy.score === 0` | "Connect DEWA via Open Finance" (+10 pts) |
| 3 | `vehicleCondition.score < 8` | "Update vehicle software" (+3 pts) |
| 4 | `batteryHealth.score < 16` | "Maintain battery between 20-80%" (+4 pts) |
| 5 | All conditions met | All 4 suggestions present |
| 6 | No conditions met (except renewable) | Only renewable suggestion |

### 3.2 Tier Definitions (`server/scoring/tiers.js`)

| # | Test Case | Score | Expected Tier |
|---|-----------|-------|---------------|
| 1 | Maximum score | 100 | Platinum Green |
| 2 | Platinum lower bound | 85 | Platinum Green |
| 3 | Gold upper bound | 84 | Gold Green |
| 4 | Gold lower bound | 70 | Gold Green |
| 5 | Silver upper bound | 69 | Silver Green |
| 6 | Silver lower bound | 55 | Silver Green |
| 7 | Bronze upper bound | 54 | Bronze Green |
| 8 | Bronze lower bound | 40 | Bronze Green |
| 9 | Standard upper bound | 39 | Standard |
| 10 | Zero score | 0 | Standard |
| 11 | Negative score (defensive) | -1 | Standard (fallback) |
| 12 | Rate reduction correctness | 85 | 0.50% |
| 13 | Rate reduction correctness | 70 | 0.40% |
| 14 | Color correctness | 85 | `#0A6847` |
| 15 | Weights sum to 100 | — | `sum(WEIGHTS.*.max) === 100` |

### 3.3 Cache (`server/cache.js`)

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | Set and get | `set('k', data)` then `get('k')` returns data |
| 2 | TTL expiry | After TTL passes, `get('k')` returns `null` |
| 3 | Clear | `clear()` empties all entries |
| 4 | Non-existent key | `get('unknown')` returns `null` |
| 5 | Overwrite | `set('k', d1)` then `set('k', d2)` — `get('k')` returns `d2` |
| 6 | Multiple keys | Independent TTL per key |

### 3.4 Format Utilities (`src/utils/format.js`)

| # | Function | Input | Expected Output |
|---|----------|-------|-----------------|
| 1 | `formatNumber` | `1234` | `"1,234"` |
| 2 | `formatNumber` | `null` | `"—"` |
| 3 | `formatNumber` | `0` | `"0"` |
| 4 | `formatKm` | `12840` | `"12,840 km"` |
| 5 | `formatKm` | `null` | `"—"` |
| 6 | `formatPercent` | `78` | `"78%"` |
| 7 | `formatPercent` | `null` | `"—"` |
| 8 | `formatPercent` | `0` | `"0%"` |
| 9 | `formatTemp` | `24.5` | `"24.5°C"` |
| 10 | `formatTemp` | `null` | `"—"` |
| 11 | `formatDate` | `"2026-02-13T12:00:00Z"` | `"13 Feb 2026"` |
| 12 | `formatDate` | `""` | `"—"` |
| 13 | `formatTimeAgo` | (< 60s ago) | `"just now"` |
| 14 | `formatTimeAgo` | (5 min ago) | `"5m ago"` |
| 15 | `formatTimeAgo` | (3 hours ago) | `"3h ago"` |
| 16 | `formatTimeAgo` | (2 days ago) | Falls back to `formatDate` |
| 17 | `formatAed` | `3200` | `"AED 3,200"` |
| 18 | `formatAed` | `null` | `"—"` |
| 19 | `formatRateReduction` | `0.5` | `"0.50%"` |
| 20 | `formatRateReduction` | `0` | `"0.00%"` |

### 3.5 Tesla Client (`server/tesla-client.js`)

These tests require mocking the global `fetch` function.

| # | Test Case | Setup | Expected Behavior |
|---|-----------|-------|-------------------|
| 1 | `setTokens` stores correctly | Call `setTokens({ access_token, refresh_token, expires_in: 3600 })` | `getTokens()` returns valid tokens |
| 2 | `isAuthenticated` — valid token | Set tokens with future expiry | Returns `true` |
| 3 | `isAuthenticated` — expired token | Set tokens with past expiry | Returns `false` |
| 4 | `isAuthenticated` — no token | `clearTokens()` | Returns `false` |
| 5 | `clearTokens` wipes state | Set then clear | `getTokens()` returns nulls |
| 6 | `teslaGet` — success (200) | Mock fetch returns 200 | Returns parsed JSON |
| 7 | `teslaGet` — 401 triggers refresh | Mock 401 then 200 | Calls refresh, retries, returns data |
| 8 | `teslaGet` — 408 triggers wake | Mock 408 then vehicle online | Calls `wake_up`, polls, retries |
| 9 | `teslaGet` — 408 vehicle won't wake | Mock 408, poll times out | Throws "Vehicle is asleep" error |
| 10 | `teslaGet` — 429 rate limit | Mock 429 | Throws "Tesla API rate limited" |
| 11 | `teslaGet` — auto-refresh near expiry | Token expires in < 60s | Refreshes before making call |
| 12 | Region URL — EU (default) | `TESLA_REGION=eu` | Uses `fleet-api.prd.eu.vn.cloud.tesla.com` |
| 13 | Region URL — NA | `TESLA_REGION=na` | Uses `fleet-api.prd.na.vn.cloud.tesla.com` |
| 14 | Refresh failure clears tokens | Mock refresh returns 400 | `isAuthenticated()` returns `false` |

---

## 4. Integration Tests (API Layer)

All API integration tests should use `supertest` against the Express app, with the Tesla client mocked to return controlled data.

### 4.1 `GET /api/dashboard/:vin`

| # | Test Case | Auth State | Expected |
|---|-----------|-----------|----------|
| 1 | Returns mock when unauthenticated | Not authenticated | Mock data, `metadata.dataSource === 'mock'` |
| 2 | Returns mock when `forceMock=true` | Authenticated | Mock data, `metadata.dataSource === 'mock'` |
| 3 | Returns live data when authenticated | Authenticated, Tesla API mocked | Live data, `metadata.dataSource === 'live'` |
| 4 | Caches live data | Authenticated | Second call returns cached (no Tesla API hit) |
| 5 | Falls back to cache on error | Authenticated, Tesla throws | Cached data returned |
| 6 | Falls back to mock on error (no cache) | Authenticated, Tesla throws, no cache | Mock data returned |
| 7 | Response shape validation | Any | Contains `vehicle`, `score`, `charging`, `metadata` keys |
| 8 | Score computed correctly | Mock data | `score.totalScore` matches `computeGreenScore(MOCK_VEHICLE_DATA)` |
| 9 | Vehicle data transformation | Mock data | `vehicle.odometer.km` is miles × 1.60934, rounded |
| 10 | Charger type interpretation | `fast_charger_type: '<invalid>'` | `vehicle.battery.chargerType === 'Home'` |

### 4.2 `GET /api/vehicles`

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | Returns mock vehicles when unauthenticated | Array with mock vehicle, `dataSource: 'mock'` |
| 2 | Returns live vehicles when authenticated | Array from Tesla API |
| 3 | Falls back to mock on API error | Mock vehicle list |
| 4 | Response shape | Each item has `id, vin, displayName, model, state, inService, dataSource` |

### 4.3 `GET /api/green-score/:vin`

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | Returns score for mock data | Score object with breakdown |
| 2 | Score matches standalone computation | Same as calling `computeGreenScore()` directly |

### 4.4 `GET /api/auth-status`

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | Not authenticated | `{ authenticated: false }` |
| 2 | Authenticated | `{ authenticated: true, expiresAt: ..., region: 'eu' }` |

### 4.5 `GET /` (Health Check)

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | Returns status ok | `{ status: 'ok' }` |
| 2 | Shows auth status | `authenticated` field matches actual state |
| 3 | Lists endpoints | `endpoints` array is non-empty |

### 4.6 `POST /api/cache/clear`

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | Clears cached data | Subsequent GET returns fresh data (not cached) |

### 4.7 Three-Layer Fallback Integration

| # | Test Case | Server State | Tesla Auth | Expected Source |
|---|-----------|-------------|-----------|-----------------|
| 1 | Live data flow | Running | Authenticated | `dataSource: 'live'` |
| 2 | Server mock flow | Running | Not authenticated | `dataSource: 'mock'` (from server) |
| 3 | Frontend mock flow | Down | N/A | Uses `MOCK_DASHBOARD` from `constants.js` |
| 4 | Badge shows correctly | Any | Any | Green "LIVE DATA" or orange "MOCK DATA" |
| 5 | Mock ↔ live indistinguishable | Both | Both | Same data shape, same UI rendering |

---

## 5. Component Tests

All component tests should verify rendering with mock dashboard data. Use `@testing-library/react` with a jsdom environment.

### 5.1 Score Tab Components

| # | Component | Test Cases |
|---|-----------|-----------|
| 1 | `ScoreGauge` | Renders score number (e.g., "78"), renders SVG circle, stroke-dashoffset reflects score |
| 2 | `ScoreGauge` | Score of 0 renders full offset, score of 100 renders zero offset |
| 3 | `ScoreBreakdown` | Renders all 6 category labels (Battery Health, Charging Behavior, etc.) |
| 4 | `ScoreBreakdown` | Progress bar widths reflect score/max ratio |
| 5 | `ScoreBreakdown` | Shows score text (e.g., "18/20") for each category |
| 6 | `TierBadge` | Displays tier name ("Gold Green") |
| 7 | `TierBadge` | Displays rate reduction ("0.40%") |
| 8 | `TierBadge` | Applies correct tier color |

### 5.2 Vehicle Tab Components

| # | Component | Test Cases |
|---|-----------|-----------|
| 1 | `VehicleDetails` | Displays VIN, model name, software version |
| 2 | `VehicleDetails` | Displays odometer in km format |
| 3 | `VehicleDetails` | Shows lock state and sentry mode status |
| 4 | `BatteryStatus` | Shows battery percentage (e.g., "78%") |
| 5 | `BatteryStatus` | Shows range in km |
| 6 | `BatteryStatus` | Shows charging state and charger type |
| 7 | `VehicleMap` | Renders Leaflet map container |
| 8 | `VehicleMap` | Centers on provided lat/lng |

### 5.3 Charging Tab Components

| # | Component | Test Cases |
|---|-----------|-----------|
| 1 | `ChargingPattern` | Shows home/supercharger/public percentage breakdown |
| 2 | `ChargingPattern` | Renders recent charging sessions |
| 3 | `EnvironmentalImpact` | Shows CO2 saved, trees equivalent, gasoline saved |
| 4 | `ChargingCost` | Displays cost saved in AED |
| 5 | `DataSources` | Shows data source explanation |

### 5.4 Rate Tab Components

| # | Component | Test Cases |
|---|-----------|-----------|
| 1 | `RateBenefit` | Shows standard rate (3.99%) and green rate (3.99% - reduction) |
| 2 | `RateBenefit` | Reduction matches tier |
| 3 | `TierTable` | Renders all 5 tiers with correct names, score ranges, and colors |
| 4 | `TierTable` | Highlights current tier |
| 5 | `SavingsProjection` | Computes correct monthly payment difference |
| 6 | `SavingsProjection` | Shows loan amount (AED 250,000), term (5 years) |

### 5.5 Layout Components

| # | Component | Test Cases |
|---|-----------|-----------|
| 1 | `Header` | Renders bank logo |
| 2 | `Header` | Shows "LIVE DATA" badge when `isLive=true` |
| 3 | `Header` | Shows "MOCK DATA" badge when `isLive=false` |
| 4 | `Header` | Refresh button triggers callback |
| 5 | `Header` | Dark mode toggle switches class on `<html>` |
| 6 | `TabBar` | Renders 4 tabs: Score, Vehicle, Charging, Rate Impact |
| 7 | `TabBar` | Active tab has visual distinction |
| 8 | `TabBar` | Click triggers tab change callback |
| 9 | `Footer` | Shows last updated timestamp |
| 10 | `VehicleBanner` | Shows vehicle name, model, and score |

### 5.6 Shared Components

| # | Component | Test Cases |
|---|-----------|-----------|
| 1 | `Card` | Renders children content |
| 2 | `Card` | Has correct CSS classes (border, shadow, radius) |
| 3 | `Badge` | Renders correct text and color variant |
| 4 | `ProgressBar` | Width style matches percentage prop |
| 5 | `ProgressBar` | Shows label and detail text |
| 6 | `AnimatedNumber` | Renders final number value (after animation or immediately in test) |
| 7 | `AnimatedNumber` | Supports prefix/suffix (e.g., "AED", "%") |
| 8 | `KVRow` | Renders key label and value |

---

## 6. End-to-End Tests (Playwright)

E2E tests run against the full application (backend + frontend). The backend starts in mock mode (no Tesla credentials).

### 6.1 Dashboard Flow

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | App loads successfully | Navigate to `localhost:3000` | No console errors, content renders |
| 2 | Score tab renders by default | Load app | Score gauge visible, breakdown visible |
| 3 | Score gauge shows correct value | Load app | Gauge displays "78" (mock data score) |
| 4 | Mock badge is visible | Load app without Tesla credentials | Orange "MOCK DATA" badge in header |

### 6.2 Tab Navigation

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Switch to Vehicle tab | Click "Vehicle" tab | Vehicle details card visible, map visible |
| 2 | Switch to Charging tab | Click "Charging" tab | Charging pattern and environmental impact visible |
| 3 | Switch to Rate Impact tab | Click "Rate Impact" tab | Rate comparison and tier table visible |
| 4 | Tab switch is instant | Click through all tabs | No loading spinner between tabs |
| 5 | Return to Score tab | Click "Score" after visiting others | Score gauge still shows correct value |

### 6.3 Mock Mode Behavior

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | All tabs render with mock data | Navigate through all 4 tabs | All content renders, no "undefined" or empty sections |
| 2 | Vehicle details match mock | Open Vehicle tab | VIN shows `5YJYGDEE1NF000000`, Model Y |
| 3 | Battery shows correct mock values | Open Vehicle tab | 78%, range in km, charging "Complete" |
| 4 | Charging sessions render | Open Charging tab | 8 sessions visible |
| 5 | Environmental impact shows values | Open Charging tab | CO2, trees, gasoline, cost — all non-zero |

### 6.4 Dark Mode

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Toggle dark mode on | Click dark mode toggle | `<html>` has `dark` class, background changes |
| 2 | Toggle dark mode off | Click toggle again | `dark` class removed, light background |
| 3 | Dark mode persists across refresh | Enable dark mode, reload page | Dark mode still active |
| 4 | All cards readable in dark mode | Enable dark mode, visit all tabs | Text visible, no contrast issues |

### 6.5 Responsive Layout

| # | Test Case | Viewport | Expected |
|---|-----------|----------|----------|
| 1 | Desktop layout | 1280×800 | 2-column grid on Score tab |
| 2 | Tablet layout | 768×1024 | 2-column with reduced padding |
| 3 | Mobile layout | 375×812 | Single column, stacked cards |
| 4 | Tabs remain accessible on mobile | 375×812 | All 4 tabs visible and clickable |

### 6.6 Refresh Functionality

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Refresh button works | Click refresh button | Data reloads, "Last updated" timestamp updates |
| 2 | Loading state during refresh | Click refresh | Brief loading indicator shown |

---

## 7. Security Testing

These checks align with the project's security requirements (PRD §7) and OWASP guidelines.

| # | Test Area | Check | Method |
|---|-----------|-------|--------|
| 1 | OAuth CSRF | State parameter is random, validated on callback | Unit test `tesla-oauth.js` |
| 2 | Token exposure | Access token never appears in frontend responses | Grep API responses for token strings |
| 3 | CORS | Only `FRONTEND_URL` origin accepted | `supertest` with wrong Origin header |
| 4 | Helmet headers | CSP, X-Frame-Options, etc. present | Assert response headers |
| 5 | No eval/Function | ESLint security plugin catches these | `npm run lint` in CI |
| 6 | No disk persistence | Tokens only in memory | Code review assertion — no `fs.write` for tokens |
| 7 | Input validation — VIN | Malformed VIN in URL | No crashes, returns mock or error gracefully |
| 8 | No command injection | `vin` param with shell metacharacters | Express route handles safely |
| 9 | Dependency audit | `npm audit` | `npm run audit:security` in CI |

---

## 8. Brand Compliance Testing

| # | Check | Expected | Method |
|---|-------|----------|--------|
| 1 | Primary red | `#BE000E` used for CTAs/accents | CSS variable assertion or visual test |
| 2 | Font stack | `'Helvetica Neue', Helvetica, Arial, sans-serif` | Computed style assertion in E2E |
| 3 | Card styling | White bg, 1px `#E4E4E4` border, 12px radius | Component test or screenshot |
| 4 | No top red bar | Header is clean white | Visual assertion |
| 5 | Logo files | `default.svg` in header, `plectrum.svg` as favicon | E2E assertion on `src` attributes |
| 6 | Callout boxes | `#F7E5E5` bg, `#BE000E` 3px left border | CSS assertion |
| 7 | Green score colors | Deep `#0A6847`, Main `#16A34A`, Light `#22C55E` | Tier badge color assertions |

---

## 9. Test Data Management

### 9.1 Fixtures

Create JSON fixture files in `tests/fixtures/` that mirror real Tesla API responses:

- **`tesla-vehicle-data.json`**: Copy of `MOCK_VEHICLE_DATA` structure from `server/mock-data.js`
- **`tesla-charging-history.json`**: Copy of `MOCK_CHARGING_HISTORY` structure
- **`tesla-vehicle-list.json`**: Copy of `MOCK_VEHICLE_LIST` structure
- **`tesla-error-responses.json`**: Error payloads for 401, 408, 429, 500 scenarios

### 9.2 Fixture Variants

For scoring boundary tests, create parameterized fixtures:

```javascript
// tests/fixtures/scoring-scenarios.js
export const SCORING_SCENARIOS = {
  platinum: {
    description: 'Ideal vehicle — should score ≥85',
    vehicleData: {
      vin: '5YJYGDEE1NF000000',
      charge_state: {
        battery_level: 95,
        battery_range: 313.5,  // 95% of 330mi EPA
        charging_state: 'Complete',
        fast_charger_type: '<invalid>',  // Home charger
      },
      vehicle_state: {
        odometer: 10500,  // ~16,900 km — sweet spot
        car_version: '2026.1.2 xyz',
      },
    },
    expectedTier: 'Platinum Green',
    expectedMinScore: 85,
  },
  standard: {
    description: 'Poor conditions — should score ≤39',
    vehicleData: { /* ... */ },
    expectedTier: 'Standard',
    expectedMaxScore: 39,
  },
  // ... boundary cases
};
```

### 9.3 Mock Strategy

| Dependency | Mock Approach |
|-----------|---------------|
| Tesla Fleet API | Mock `global.fetch` in unit tests; mock `teslaGet` in integration tests |
| Cache | Use real cache module (in-memory, fast, no external deps) |
| Time/Date | Use `vi.useFakeTimers()` for cache TTL and token expiry tests |
| Browser APIs (localStorage) | jsdom provides these automatically |
| Leaflet map | Mock `react-leaflet` components (avoid canvas/WebGL issues in jsdom) |

---

## 10. CI/CD Integration

### 10.1 Pipeline Stages

```yaml
# .github/workflows/ci.yml additions
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      # Stage 1: Static analysis
      - run: npm run lint
      - run: npm run format:check

      # Stage 2: Unit tests (fast, no server needed)
      - run: npx vitest run --reporter=verbose tests/unit/

      # Stage 3: Integration tests (starts Express internally)
      - run: npx vitest run --reporter=verbose tests/integration/

      # Stage 4: Component tests
      - run: npx vitest run --reporter=verbose tests/components/

      # Stage 5: E2E tests (starts both servers)
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test

      # Stage 6: Security
      - run: npm run audit:security
```

### 10.2 Configuration Files

#### `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['server/**/*.js', 'src/**/*.{js,jsx}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
    setupFiles: ['tests/setup.js'],
  },
});
```

#### `playwright.config.js`

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run server',
      port: 3001,
      reuseExistingServer: true,
    },
    {
      command: 'npm run client',
      port: 3000,
      reuseExistingServer: true,
    },
  ],
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
```

### 10.3 npm Scripts (Additions)

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:unit": "vitest run tests/unit/",
    "test:integration": "vitest run tests/integration/",
    "test:components": "vitest run tests/components/",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 11. Coverage Targets

| Area | Target | Rationale |
|------|--------|-----------|
| Scoring engine (`server/scoring/`) | **95%** statements, **90%** branches | Core business logic; incorrect scoring = incorrect rate reductions |
| API routes (`server/api/`) | **80%** statements | Data transformation and fallback logic |
| Tesla client (`server/tesla-client.js`) | **80%** branches | Error handling paths are critical |
| Cache (`server/cache.js`) | **100%** | Small module, fully testable |
| Format utilities (`src/utils/format.js`) | **100%** | Pure functions, fully testable |
| React components (`src/components/`) | **70%** statements | Rendering correctness; animations hard to test in jsdom |
| Hooks (`src/hooks/`) | **75%** | Async data fetching logic with fallback |
| **Overall** | **70%** statements, **60%** branches | Baseline for a prototype graduating to production |

---

## 12. Risk-Based Test Prioritization

Tests should be implemented in this order, based on business risk:

### Priority 1 — Critical (Implement First)

| Area | Risk | Tests |
|------|------|-------|
| Scoring engine | Wrong score → wrong tier → wrong rate reduction → financial impact | All `engine.test.js` tests (~30 cases) |
| Tier boundaries | Off-by-one → customer in wrong tier | All `tiers.test.js` boundary tests |
| Dashboard endpoint | Broken endpoint → blank screen | `dashboard.test.js` shape + fallback tests |
| Three-layer fallback | Failure to fall back → user sees errors | `fallback.test.js` |

### Priority 2 — High (Implement Second)

| Area | Risk | Tests |
|------|------|-------|
| Tesla client error handling | Unhandled 408/401/429 → crashes | `tesla-client.test.js` |
| Cache TTL | Stale data served or cache miss storms | `cache.test.js` |
| Format utilities | Wrong AED/km/% display → confusing UI | `format.test.js` |
| Score tab components | Gauge shows wrong number → misleading | `ScoreGauge.test.jsx`, `ScoreBreakdown.test.jsx` |

### Priority 3 — Medium (Implement Third)

| Area | Risk | Tests |
|------|------|-------|
| Other API endpoints | Redundant with dashboard but standalone users exist | `vehicles.test.js`, etc. |
| Rate tab components | Wrong savings projection → misleading financial info | `SavingsProjection.test.jsx` |
| Layout components | Badge shows wrong mode | `Header.test.jsx`, `Badge.test.jsx` |
| E2E tab navigation | Tabs don't switch | `tab-navigation.spec.js` |

### Priority 4 — Low (Implement Last)

| Area | Risk | Tests |
|------|------|-------|
| Dark mode | Cosmetic only | `dark-mode.spec.js` |
| Responsive layout | Demo target is laptop | `responsive.spec.js` |
| Brand compliance | Visual drift | Screenshot tests |
| Security headers | Helmet defaults handle most | Header assertions |

---

## 13. Test Environment Requirements

| Requirement | Detail |
|-------------|--------|
| Node.js | 18+ (matches project requirement) |
| No Tesla credentials needed | All tests run against mock data |
| No database | In-memory cache only |
| No network access | All external APIs mocked |
| Deterministic time | Use `vi.useFakeTimers()` for time-sensitive tests |
| CI runner | Ubuntu latest (GitHub Actions) |
| Browser (E2E) | Chromium only (sufficient for prototype) |

---

## 14. Maintenance & Evolution

### When to Update Tests

- **Scoring weight changes** → Update `weights.test.js` and boundary scenarios in `engine.test.js`
- **New tier added** → Update `tiers.test.js`, boundary cases, `TierTable.test.jsx`
- **New API endpoint** → Add integration test file
- **New React component** → Add component test file
- **Tesla API contract change** → Update fixtures in `tests/fixtures/`
- **DEWA/Open Finance integration** (future) → Remove "always 0" test for renewableEnergy, add real scoring tests

### Test Review Checklist

For every PR:
1. Do new/changed scoring rules have boundary tests?
2. Do new API endpoints have integration tests for success, error, and mock fallback?
3. Do new components have rendering tests with mock data?
4. Does `npm run test` pass?
5. Is coverage above thresholds?
