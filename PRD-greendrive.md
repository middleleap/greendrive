# PRD: ADCB GreenDrive

## Document Info

| Field | Value |
|---|---|
| Author | Michael Hartmann, Developer Advocate — Open Finance |
| Version | 1.0 |
| Date | February 2026 |
| Status | Implementation Ready |
| Target | Claude Code implementation |

---

## 1. Product Overview

### 1.1 What We're Building

A full-stack application called **ADCB GreenDrive** that connects to the Tesla Fleet API, computes a "GreenDrive Score" from real vehicle data, and presents it in an ADCB-branded dashboard. This serves as a working prototype to demonstrate how ADCB can evolve its existing Green Car Loans into a data-driven, continuously scored product.

### 1.2 Why

ADCB already offers Green Car Loans for EVs, hybrids, and PHEVs. The UAE EV market is growing at 38% YoY with 30,000+ EVs registered in Dubai alone. Tesla's Fleet API enables real-time vehicle data sharing via OAuth consent. ADCB is the first certified bank on the Al Tareq Open Finance platform. This prototype combines these forces into a demonstrable product that can be shown to ADCB's CDO and Retail Banking leadership.

### 1.3 Success Criteria

- A CDO can open this application, see live Tesla data from a real vehicle, understand the GreenDrive Score computation, and grasp the business case — all within 5 minutes.
- The application runs locally (laptop) with zero cloud infrastructure dependencies.
- It uses real Tesla Fleet API data with graceful fallback to mock data.
- It follows ADCB brand guidelines precisely.

---

## 2. Architecture

### 2.1 System Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser (http://localhost:3000)                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Next.js or Vite)                          │  │
│  │  - ADCB-branded dashboard                                  │  │
│  │  - Auto-detects live vs mock data                          │  │
│  │  - Tabs: Score / Vehicle / Charging / Rate Impact          │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
│                         │ fetch /api/*                            │
│  ┌──────────────────────▼─────────────────────────────────────┐  │
│  │  Express API Server (http://localhost:3001)                 │  │
│  │  - Tesla OAuth 2.0 flow                                    │  │
│  │  - Vehicle data proxy + caching (5 min TTL)                │  │
│  │  - GreenDrive Score computation engine                   │  │
│  │  - Charging history analysis                               │  │
│  │  - Mock data fallback                                      │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
│                         │ HTTPS                                   │
└─────────────────────────┼────────────────────────────────────────┘
                          │
         ┌────────────────▼────────────────┐
         │  Tesla Fleet API (EU Region)     │
         │  fleet-api.prd.eu.vn.cloud.tesla │
         │  - OAuth 2.0 token exchange      │
         │  - /api/1/vehicles               │
         │  - /api/1/vehicles/:vin/         │
         │    vehicle_data                   │
         │  - /api/1/vehicles/:vin/         │
         │    charge_history                 │
         └─────────────────────────────────┘
```

### 2.2 Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Vite (or Next.js) | Fast dev, hot reload, artifact-compatible |
| Styling | Tailwind CSS + ADCB CSS variables | ADCB brand compliance, responsive |
| Backend | Node.js + Express | Simple, single-file server, Tesla SDK compatibility |
| Auth | OAuth 2.0 (Tesla Fleet API) | Required by Tesla |
| Data | In-memory cache + JSON files | No database needed for demo |
| Package Manager | npm | Standard |

### 2.3 Project Structure

```
adcb-greendrive/
├── README.md                    # Quick start guide
├── SETUP.md                     # Detailed Tesla API registration walkthrough
├── package.json
├── .env.example
├── .env                         # (gitignored) actual credentials
├── .gitignore
│
├── server/
│   ├── index.js                 # Express server entry point
│   ├── auth/
│   │   └── tesla-oauth.js       # OAuth 2.0 flow (authorize, callback, refresh)
│   ├── api/
│   │   ├── vehicles.js          # GET /api/vehicles
│   │   ├── vehicle-data.js      # GET /api/vehicle-data/:vin
│   │   ├── charging.js          # GET /api/charging-history/:vin
│   │   ├── green-score.js       # GET /api/green-score/:vin
│   │   └── dashboard.js         # GET /api/dashboard/:vin (aggregate)
│   ├── scoring/
│   │   ├── engine.js            # GreenDrive Score computation
│   │   ├── tiers.js             # Tier definitions and rate mappings
│   │   └── weights.js           # Scoring weights configuration
│   ├── cache.js                 # In-memory cache with TTL
│   ├── tesla-client.js          # Tesla API HTTP client with auth
│   └── mock-data.js             # Fallback mock data
│
├── src/                         # React frontend
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Root component with routing
│   ├── hooks/
│   │   ├── useTeslaData.js      # Data fetching hook (live + fallback)
│   │   └── useAuthStatus.js     # Auth status polling
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx       # ADCB header with logo + live/mock badge
│   │   │   ├── VehicleBanner.jsx # Dark gradient banner with vehicle stats
│   │   │   ├── TabBar.jsx       # Navigation tabs
│   │   │   └── Footer.jsx       # Data source attribution
│   │   ├── Score/
│   │   │   ├── ScoreGauge.jsx   # Circular animated gauge (0-100)
│   │   │   ├── ScoreBreakdown.jsx # Bar chart of score components
│   │   │   └── TierBadge.jsx    # Green tier badge
│   │   ├── Vehicle/
│   │   │   ├── VehicleDetails.jsx # VIN, model, odometer, software
│   │   │   ├── BatteryStatus.jsx  # Battery level, range, health
│   │   │   └── LocationMap.jsx    # Simple map pin (optional)
│   │   ├── Charging/
│   │   │   ├── ChargingPattern.jsx # Home vs public ratio analysis
│   │   │   ├── EnvironmentalImpact.jsx # CO2 savings, energy stats
│   │   │   └── DataSources.jsx    # Open Finance consent status cards
│   │   ├── Rate/
│   │   │   ├── RateBenefit.jsx    # Current vs Green rate comparison
│   │   │   ├── TierTable.jsx      # All tiers with "you are here" marker
│   │   │   └── SavingsProjection.jsx # Annual + lifetime savings
│   │   └── shared/
│   │       ├── Card.jsx           # Reusable card component
│   │       ├── AnimatedNumber.jsx # Count-up animation
│   │       ├── ProgressBar.jsx    # Horizontal bar with animation
│   │       ├── Badge.jsx          # Status badge
│   │       └── KVRow.jsx          # Key-value row for detail lists
│   ├── styles/
│   │   └── adcb-theme.css         # ADCB CSS variables and base styles
│   └── utils/
│       ├── format.js              # Number/date formatters
│       └── constants.js           # Colors, tier definitions, config
│
├── public/
│   ├── index.html
│   └── assets/
│       └── logos/                 # ADCB logo SVGs (copy from brand guidelines)
│           ├── default.svg
│           ├── default-2.svg
│           └── plectrum.svg
│
└── scripts/
    └── generate-keys.sh          # OpenSSL key generation helper
```

---

## 3. Backend Specification

### 3.1 Environment Variables

```env
# Tesla Fleet API
TESLA_CLIENT_ID=<from developer.tesla.com>
TESLA_CLIENT_SECRET=<from developer.tesla.com>
TESLA_REDIRECT_URI=http://localhost:3001/callback

# Tesla API Region — UAE falls under EU
# Options: na | eu | cn
TESLA_REGION=eu

# Server
PORT=3001

# Frontend origin (for CORS)
FRONTEND_URL=http://localhost:3000

# Cache TTL in seconds (default 300 = 5 min)
CACHE_TTL=300
```

### 3.2 Tesla OAuth 2.0 Flow

**Authorization URL:** `https://auth.tesla.com/oauth2/v3/authorize`
**Token URL:** `https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token`
**Fleet API Base (EU):** `https://fleet-api.prd.eu.vn.cloud.tesla.com`

**Scopes required (read-only — no commands):**

| Scope | Purpose | Required |
|---|---|---|
| `openid` | Sign in with Tesla | Yes |
| `offline_access` | Refresh tokens without re-login | Yes |
| `vehicle_device_data` | Battery, odometer, state, software | Yes |
| `vehicle_charging_cmds` | Charging history, session data | Yes |
| `vehicle_location` | Lat/lng for demo map | Optional |

**Flow:**

1. `GET /auth` → redirect to Tesla authorize URL with client_id, scopes, redirect_uri, state
2. User logs in at Tesla, grants permissions
3. Tesla redirects to `GET /callback?code=<code>&state=<state>`
4. Server exchanges code for access_token + refresh_token via POST to token URL
5. Tokens stored in-memory (never persisted to disk)
6. Access token included as `Authorization: Bearer <token>` on all Fleet API calls
7. Auto-refresh when token expires (refresh_token is single-use, Tesla returns a new one)

**Important:** Token exchange MUST use `fleet-auth.prd.vn.cloud.tesla.com`, NOT `auth.tesla.com`. Tesla requires this as of Aug 2025.

### 3.3 API Endpoints

#### `GET /` — Health check
Returns server status, auth status, and available endpoints.

#### `GET /auth` — Start OAuth flow
Redirects to Tesla authorization page.

#### `GET /callback` — OAuth callback
Exchanges code for tokens. Renders a success page with link to `/api/vehicles`.

#### `GET /api/auth-status`
```json
{
  "authenticated": true,
  "expiresAt": "2026-02-14T18:30:00Z",
  "region": "eu"
}
```

#### `GET /api/vehicles`
Lists all vehicles on the authenticated Tesla account.
```json
[
  {
    "id": 12345678,
    "vin": "5YJ3E7EB4NF000000",
    "displayName": "My Tesla",
    "model": "Model Y",
    "state": "online",
    "inService": false
  }
]
```

#### `GET /api/vehicle-data/:vin`
Returns structured vehicle data (cleaned from raw Tesla response).
```json
{
  "vin": "5YJ3E7EB4NF000000",
  "displayName": "My Tesla",
  "model": "Model Y",
  "software": "2025.2.6",
  "battery": {
    "level": 78,
    "range_km": 385,
    "charging": "Complete",
    "chargerType": "Home",
    "energyAdded_kWh": 52.4,
    "chargeLimitPct": 80,
    "scheduledCharging": "Off"
  },
  "odometer": {
    "miles": 7980,
    "km": 12840
  },
  "climate": {
    "insideTemp_C": 24.5,
    "outsideTemp_C": 38.2,
    "isClimateOn": false
  },
  "location": {
    "latitude": 24.4539,
    "longitude": 54.3773,
    "heading": 180
  },
  "state": {
    "locked": true,
    "sentryMode": true,
    "softwareUpdate": "available"
  }
}
```

#### `GET /api/charging-history/:vin`
Returns charging session history (if available from Tesla).

#### `GET /api/green-score/:vin`
Computes and returns the GreenDrive Score.
```json
{
  "vin": "5YJ3E7EB4NF000000",
  "model": "Model Y",
  "totalScore": 78,
  "maxPossible": 100,
  "tier": "Gold Green",
  "rateReduction": 0.40,
  "breakdown": {
    "batteryHealth": { "score": 18, "max": 20, "detail": "97% estimated health" },
    "chargingBehavior": { "score": 22, "max": 25, "detail": "Home charging detected" },
    "efficiency": { "score": 15, "max": 20, "detail": "12,840 km — moderate usage" },
    "evOwnership": { "score": 15, "max": 15, "detail": "Full BEV" },
    "vehicleCondition": { "score": 8, "max": 10, "detail": "Software 2025.2.6 — up to date" },
    "renewableEnergy": { "score": 0, "max": 10, "detail": "Pending DEWA/Open Finance consent" }
  },
  "computedAt": "2026-02-14T15:30:00Z",
  "dataSource": "live_tesla_fleet_api"
}
```

#### `GET /api/dashboard/:vin`
Aggregate endpoint — returns everything the frontend needs in a single call. Combines vehicle data + green score + metadata. This is the primary endpoint the React frontend calls.

### 3.4 Tesla API Client (`server/tesla-client.js`)

Wrapper around `fetch` that:
- Adds `Authorization: Bearer <token>` header automatically
- Checks token expiry before each call, auto-refreshes if needed
- Handles Tesla API errors (401 → refresh, 408 → vehicle asleep, 429 → rate limit)
- Routes to correct regional endpoint based on `TESLA_REGION` env var
- Logs all API calls for debugging (but never logs tokens)

**Vehicle wake handling:** If the car is asleep, the `vehicle_data` endpoint returns 408. The client should:
1. Call `POST /api/1/vehicles/:vin/wake_up`
2. Wait up to 30 seconds, polling every 5 seconds
3. Retry the data request once awake
4. If still asleep after 30s, return cached data or error

### 3.5 Cache (`server/cache.js`)

Simple in-memory Map with TTL:
- Key: string (e.g., `vehicle-data-{vin}`)
- Value: `{ data, timestamp }`
- TTL: configurable via `CACHE_TTL` env var (default 300s = 5 min)
- `get(key)` → returns data if fresh, null if stale
- `set(key, data)` → stores with current timestamp
- `clear()` → flush all cache (exposed as `POST /api/cache/clear` for dev)

---

## 4. GreenDrive Score Engine

### 4.1 Scoring Model

The score is 0–100, computed from six weighted categories:

| Category | Max Points | Data Source | Logic |
|---|---|---|---|
| Battery Health | 20 | Tesla API: `charge_state.battery_range`, `battery_level` | Estimate full-charge range vs EPA rated range for model. Higher retention = higher score. |
| Charging Behavior | 25 | Tesla API: `charge_state.fast_charger_type`, `charging_state` | Home/wall connector charging scores highest (25). Supercharger scores lowest (10). Public L2 mid-range (18). Default 15 if not currently charging. |
| Efficiency | 20 | Tesla API: `vehicle_state.odometer` | Moderate usage (10,000–20,000 km/year) scores highest. Very high or very low mileage scores lower. |
| EV Ownership | 15 | VIN decode (position 4) | Full BEV = 15. PHEV = 10. Hybrid = 5. ICE = 0. |
| Vehicle Condition | 10 | Tesla API: `vehicle_state.car_version` | Recent software (2025/2024) = 10. Older = 7. Very old = 4. |
| Renewable Energy | 10 | Future: DEWA via Open Finance | Currently 0 (pending consent). Placeholder for solar panel detection, green energy tariff, DEWA data integration. |

### 4.2 Tier Definitions (`server/scoring/tiers.js`)

```javascript
const TIERS = [
  { name: "Platinum Green", minScore: 85, maxScore: 100, rateReduction: 0.50, color: "#0A6847" },
  { name: "Gold Green",     minScore: 70, maxScore: 84,  rateReduction: 0.40, color: "#16A34A" },
  { name: "Silver Green",   minScore: 55, maxScore: 69,  rateReduction: 0.25, color: "#22C55E" },
  { name: "Bronze Green",   minScore: 40, maxScore: 54,  rateReduction: 0.10, color: "#F26B43" },
  { name: "Standard",       minScore: 0,  maxScore: 39,  rateReduction: 0.00, color: "#A5A5A5" },
];
```

### 4.3 VIN Decoder

Tesla VIN position 4 identifies the model:
- `S` → Model S
- `3` → Model 3
- `X` → Model X
- `Y` → Model Y
- `R` → Roadster
- `C` → Cybertruck

EPA rated ranges (miles) for battery health calculation:
- Model S: 405
- Model 3 LR: 358
- Model X: 348
- Model Y LR: 330
- Cybertruck: 340

### 4.4 Score Improvement Suggestions

The engine should also return actionable suggestions when score < 85:

```javascript
function getSuggestions(breakdown) {
  const suggestions = [];
  if (breakdown.chargingBehavior.score < 20) {
    suggestions.push({ action: "Increase home charging ratio", potentialPoints: 5 });
  }
  if (breakdown.renewableEnergy.score === 0) {
    suggestions.push({ action: "Connect DEWA via Open Finance", potentialPoints: 10 });
  }
  if (breakdown.vehicleCondition.score < 10) {
    suggestions.push({ action: "Update vehicle software", potentialPoints: 3 });
  }
  return suggestions;
}
```

---

## 5. Frontend Specification

### 5.1 ADCB Brand Guidelines

**Colors (use CSS variables):**
```css
:root {
  --adcb-red: #BE000E;           /* Primary — CTAs, accents */
  --adcb-red-bright: #EC2427;    /* Chart accents */
  --adcb-maroon: #8E000B;        /* Headings */
  --adcb-maroon-dark: #5F0007;   /* Deep emphasis */
  --adcb-pink: #F7E5E5;          /* Callout backgrounds */
  --adcb-gray-dark: #3F3F3F;     /* Body text */
  --adcb-gray-mid: #7F7F7F;      /* Secondary text */
  --adcb-gray: #A5A5A5;          /* Borders, subtle */
  --adcb-gray-alt: #E4E4E4;      /* Alternate rows */
  --adcb-gray-bg: #F2F2F2;       /* Section backgrounds */
  --adcb-blue: #00B0F0;          /* Info callouts */
  --adcb-blue-ice: #EBFAFF;      /* Light info backgrounds */
  --adcb-teal: #253943;          /* Dark accent */
  --adcb-orange: #F26B43;        /* Warnings */
  
  /* Green score theme */
  --green-deep: #0A6847;
  --green-main: #16A34A;
  --green-light: #22C55E;
  --green-pale: #DCFCE7;
  --green-pastel: #F0FDF4;
}
```

**Typography:**
- Font stack: `'Helvetica Neue', Helvetica, Arial, sans-serif`
- Headings: weight 500 (medium)
- Body: weight 300 (light)
- No Inter, no Roboto, no system fonts

**Logo:**
- Use `default.svg` on white backgrounds (header)
- Use `default-2.svg` on dark backgrounds (vehicle banner)
- Use `plectrum.svg` as favicon
- ADCB plectrum (triangle) can be rendered as CSS clip-path for icons

**Design rules:**
- No top red bar (ADCB template is clean white)
- Cards: white background, 1px `#E4E4E4` border, 12px border-radius, subtle shadow
- Callout boxes: `#F7E5E5` background with `#BE000E` left border (3px)
- Tables: alternating `#F2F2F2` / white rows, no heavy colored headers
- Links: `#BE000E`, hover `#8E000B`

### 5.2 Data Fetching Pattern (`hooks/useTeslaData.js`)

```javascript
// Pseudo-code for the data hook
function useTeslaData() {
  const [data, setData] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try to reach local server
    fetch('http://localhost:3001/api/auth-status', { signal: AbortSignal.timeout(2000) })
      .then(r => r.json())
      .then(status => {
        if (status.authenticated) {
          // 2. Server is running + authenticated → fetch live vehicle list
          setIsLive(true);
          return fetch('http://localhost:3001/api/vehicles').then(r => r.json());
        }
        throw new Error('Not authenticated');
      })
      .then(vehicles => {
        if (vehicles.length > 0) {
          // 3. Fetch dashboard data for first vehicle
          return fetch(`http://localhost:3001/api/dashboard/${vehicles[0].vin}`).then(r => r.json());
        }
        throw new Error('No vehicles');
      })
      .then(dashboard => { setData(dashboard); setLoading(false); })
      .catch(() => {
        // 4. Any failure → fall back to mock data silently
        setData(MOCK_DATA);
        setIsLive(false);
        setLoading(false);
      });
  }, []);

  return { data, isLive, loading, refresh };
}
```

### 5.3 Page Layout

```
┌───────────────────────────────────────────────────────────┐
│  [ADCB Logo]  ADCB  GreenDrive            [● LIVE DATA]   │
├───────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Dark gradient banner                                │  │
│  │  Vehicle Name · Model · VIN · Software              │  │
│  │                    Odometer │ Battery │ Range │ State │  │
│  └─────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────┤
│  [Score]  [Vehicle]  [Charging]  [Rate Impact]            │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────┐  ┌──────────────────────────────────────┐  │
│  │  Gauge   │  │  Score Breakdown (animated bars)      │  │
│  │  78/100  │  │  Battery Health    ████████░░ 18/20   │  │
│  │          │  │  Charging Behavior █████████░ 22/25   │  │
│  │  Gold    │  │  Efficiency        ███████░░░ 15/20   │  │
│  │  Green   │  │  EV Ownership      ███████████ 15/15  │  │
│  │          │  │  Condition          ████████░░  8/10   │  │
│  │  LIVE    │  │  Renewable Energy   ░░░░░░░░░░  0/10  │  │
│  └──────────┘  └──────────────────────────────────────┘  │
│                                                           │
│  ┌─ Callout ─────────────────────────────────────────┐   │
│  │ Score 78/100 qualifies for Gold Green tier with    │   │
│  │ 0.40% rate reduction. Connect DEWA for +10 pts.   │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  Live data from Tesla Fleet API · Last updated: just now  │
└───────────────────────────────────────────────────────────┘
```

### 5.4 Animations

- **Score gauge:** SVG circle with `stroke-dashoffset` animation, 1.2s cubic-bezier ease
- **Number counters:** requestAnimationFrame count-up from 0 to target, 1.2s duration
- **Progress bars:** width transition from 0% to target%, 1s cubic-bezier, staggered delay per bar
- **Page load:** opacity fade-in 0.6s on mount
- **Tab switch:** no animation, instant swap (keeps it feeling snappy)
- **Data refresh:** brief loading skeleton or spinner, then data populates

### 5.5 Responsive Behavior

- Desktop (>1024px): 2-column grid layout as shown above
- Tablet (768–1024px): 2-column with reduced padding
- Mobile (<768px): Single column, stacked cards

The primary demo target is a laptop screen in a meeting room, so desktop layout is the priority.

---

## 6. Mock Data

When the Tesla server is not running or not authenticated, the frontend must fall back to realistic mock data. This must be seamless — the only visible difference is a badge that says "MOCK DATA" (orange) vs "LIVE DATA" (green).

Mock data should represent a realistic UAE Tesla owner:
- Model Y Long Range
- ~12,840 km on the odometer
- 78% battery level
- Home charging (Wall Connector)
- Located in Abu Dhabi (lat 24.4539, lng 54.3773)
- GreenDrive Score: 78 (Gold Green tier)
- Software: 2025.2.6

---

## 7. Security & Privacy Requirements

| Requirement | Implementation |
|---|---|
| Tokens never persisted to disk | In-memory only. Lost on server restart. |
| No vehicle commands | Only `vehicle_device_data` and `vehicle_charging_cmds` scopes. No `vehicle_cmds`. |
| No data sent to third parties | All processing is local. No analytics, no telemetry, no external calls except Tesla API. |
| CORS restricted | Server only accepts requests from `FRONTEND_URL` (localhost:3000). |
| Token never exposed to frontend | Frontend calls server proxy endpoints. Token stays server-side. |
| State parameter in OAuth | Random 16-byte hex to prevent CSRF. |
| Rate limiting awareness | Cache all responses for 5 minutes. Don't wake vehicle unnecessarily. |

---

## 8. Tesla Fleet API Reference

### 8.1 Region Endpoints

| Region | Fleet API Base URL |
|---|---|
| North America | `https://fleet-api.prd.na.vn.cloud.tesla.com` |
| Europe (incl. UAE) | `https://fleet-api.prd.eu.vn.cloud.tesla.com` |
| China | `https://fleet-api.prd.cn.vn.cloud.tesla.cn` |

### 8.2 Key Endpoints Used

| Method | Path | Scope Required | Purpose |
|---|---|---|---|
| GET | `/api/1/vehicles` | `vehicle_device_data` | List vehicles |
| GET | `/api/1/vehicles/:vin/vehicle_data` | `vehicle_device_data` | Full vehicle state |
| GET | `/api/1/vehicles/:vin/charge_history` | `vehicle_charging_cmds` | Charging sessions |
| POST | `/api/1/vehicles/:vin/wake_up` | `vehicle_device_data` | Wake sleeping vehicle |

### 8.3 Vehicle Data Response Structure (relevant fields)

```json
{
  "response": {
    "charge_state": {
      "battery_level": 78,
      "battery_range": 239.21,
      "charging_state": "Complete",
      "charge_energy_added": 52.41,
      "charge_limit_soc": 80,
      "charger_actual_current": 0,
      "fast_charger_type": "<invalid>",
      "scheduled_charging_mode": "Off",
      "time_to_full_charge": 0
    },
    "vehicle_state": {
      "odometer": 7980.3,
      "car_version": "2025.2.6 abc123",
      "vehicle_name": "My Tesla",
      "locked": true,
      "sentry_mode": true,
      "software_update": { "status": "" }
    },
    "drive_state": {
      "latitude": 24.4539,
      "longitude": 54.3773,
      "heading": 180,
      "speed": null
    },
    "climate_state": {
      "inside_temp": 24.5,
      "outside_temp": 38.2,
      "is_climate_on": false
    },
    "vehicle_config": {
      "car_type": "modely",
      "trim_badging": "74d",
      "exterior_color": "SolidBlack"
    }
  }
}
```

### 8.4 Charger Type Interpretation

| `fast_charger_type` value | Meaning | Score Impact |
|---|---|---|
| `""` or `"<invalid>"` | Home / Wall Connector (AC) | Highest (25 pts) |
| `"Tesla"` | Tesla Supercharger (DC) | Lower (10 pts) |
| `"CCS"` or `"CHAdeMO"` | Public DC fast charger | Mid (12 pts) |
| `"MCSingleWireCAN"` | Mobile Connector | Good (20 pts) |

### 8.5 Vehicle Wake States

| `state` value | Meaning | Action |
|---|---|---|
| `"online"` | Awake, ready for data | Fetch directly |
| `"asleep"` | Sleeping, no data | Call wake_up, wait, retry |
| `"offline"` | No connectivity | Return cached data |

### 8.6 Error Handling

| HTTP Status | Meaning | Action |
|---|---|---|
| 200 | Success | Parse and return |
| 401 | Token expired | Refresh token, retry once |
| 404 | Vehicle not found | Check VIN |
| 408 | Vehicle asleep | Wake and retry (up to 30s) |
| 429 | Rate limited | Wait 60s, return cached data |
| 500+ | Tesla server error | Return cached data or error |

---

## 9. Development Workflow

### 9.1 Getting Started (for Claude Code)

```bash
# 1. Initialize project
mkdir adcb-greendrive && cd adcb-greendrive
npm init -y

# 2. Install backend deps
npm install express cors dotenv

# 3. Install frontend deps (Vite + React)
npm create vite@latest client -- --template react
cd client && npm install && cd ..

# 4. Install Tailwind in frontend
cd client && npm install -D tailwindcss @tailwindcss/vite && cd ..

# 5. Copy .env.example to .env and configure
cp .env.example .env
```

### 9.2 Development Commands

```bash
# Run backend server
node server/index.js

# Run frontend (in separate terminal)
cd client && npm run dev

# Run both concurrently (add concurrently to devDeps)
npm run dev
```

### 9.3 Testing Without Tesla Credentials

The app must work entirely on mock data when no `.env` credentials are present. This allows development and review without a Tesla account. The server should start in "mock mode" and log a warning.

---

## 10. Future Enhancements (Out of Scope for V1)

These are documented for context but should NOT be built now:

| Enhancement | Description | When |
|---|---|---|
| Al Tareq / Open Finance integration | DEWA energy data, ADCB transaction categorization | After CDO approval |
| Multi-vehicle support | Vehicle selector dropdown | After pilot |
| Historical score tracking | Score over time chart, stored in SQLite | After pilot |
| Fleet Telemetry streaming | Real-time websocket data from Tesla | After pilot |
| BYD / Mercedes EV support | Additional OEM API integrations | Phase 2 |
| Production deployment | AWS/Azure hosted, ADCB SSO | After pilot approval |
| Mobile app version | React Native or Flutter | Phase 2 |

---

## 11. Definition of Done

The prototype is complete when:

1. ✅ `npm install && npm start` launches both server and frontend
2. ✅ Without Tesla credentials: app loads with mock data, all tabs functional
3. ✅ With Tesla credentials: OAuth flow works, real vehicle data displays
4. ✅ "LIVE DATA" / "MOCK DATA" badge shows correct state
5. ✅ GreenDrive Score computes from real data with visible breakdown
6. ✅ All four tabs render correctly: Score, Vehicle, Charging, Rate Impact
7. ✅ ADCB branding (colors, typography, logo) matches guidelines
8. ✅ Score gauge animates on load
9. ✅ Refresh button fetches fresh data from Tesla API
10. ✅ Vehicle wake handling works (30s timeout with retry)
11. ✅ Error states display gracefully (no blank screens, no console errors)
12. ✅ Runs on macOS and Windows with Node.js 18+
