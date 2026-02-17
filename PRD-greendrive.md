# PRD: Bank GreenDrive

## Document Info

| Field | Value |
|---|---|
| Author | Michael Hartmann, Developer Advocate — Open Finance |
| Version | 2.0 |
| Date | February 2026 |
| Status | Production |
| Target | Claude Code implementation |

---

## 1. Product Overview

### 1.1 What We're Building

A full-stack application called **Bank GreenDrive** that connects to the Tesla Fleet API, computes a "GreenDrive Score" from real vehicle data, and presents it in a Bank-branded dashboard. This is a production application demonstrating how a bank can evolve its existing Green Car Loans into a data-driven, continuously scored product — deployed with Docker, Nginx, and CI/CD pipelines.

### 1.2 Why

Banks already offer Green Car Loans for EVs, hybrids, and PHEVs. The UAE EV market is growing at 38% YoY with 30,000+ EVs registered in Dubai alone. Tesla's Fleet API enables real-time vehicle data sharing via OAuth consent. The CBUAE's Al Tareq Open Finance platform (operated by Nebras) mandates all licensed banks and insurers to provide API access — enabling transaction categorization, insurance data sharing, and service initiation. This application combines these forces into a production-ready product that can be demonstrated to a bank's CDO and Retail Banking leadership.

### 1.3 Success Criteria

- A CDO can open this application, see live Tesla data from a real vehicle, understand the GreenDrive Score computation, and grasp the business case — all within 5 minutes.
- The application runs locally or in production (Docker + Nginx) with minimal infrastructure.
- It uses real Tesla Fleet API data with graceful fallback to mock data.
- It follows Bank brand guidelines precisely.
- Score history is persisted and trends are visible over time.
- CI/CD pipelines ensure code quality and automated deployments.

---

## 2. Architecture

### 2.1 System Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser (http://localhost:3000)                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Vite)                                     │  │
│  │  - Bank-branded dashboard                                   │  │
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
| Frontend | React 18 + Vite 6 | Fast dev, hot reload, production builds |
| Styling | Tailwind CSS 4 + Bank CSS variables | Bank brand compliance, responsive |
| Maps | Leaflet + react-leaflet | Vehicle location visualization |
| Backend | Node.js + Express | Simple server, Tesla SDK compatibility |
| Security | Helmet + CSP headers | Production-grade HTTP security |
| Auth | OAuth 2.0 (Tesla Fleet API) | Required by Tesla |
| Data | SQLite (better-sqlite3) + in-memory cache | Score history persistence + 5min API cache |
| Deployment | Docker + Nginx + PM2 | Containerized production deployment |
| CI/CD | GitHub Actions | Lint, build, staging/production deploys |
| Package Manager | npm | Standard |

### 2.3 Project Structure

```
greendrive/
├── README.md                    # Quick start guide
├── CLAUDE.md                    # Claude Code guidance
├── PRD-greendrive.md            # This document
├── TEST-STRATEGY.md             # Testing roadmap
├── SECURITY.md                  # Security documentation
├── package.json
├── vite.config.js               # Vite config (React + Tailwind plugins, port 3000)
├── .env.example
├── .env                         # (gitignored) actual credentials
├── .gitignore
├── .eslintrc.json               # ESLint config
├── .prettierrc                  # Prettier config
├── Dockerfile                   # Production Docker image
├── docker-compose.yml           # Docker Compose stack
├── ecosystem.config.cjs         # PM2 process manager config
│
├── server/
│   ├── index.js                 # Express server entry (Helmet, CORS, routes, DB seed)
│   ├── auth/
│   │   └── tesla-oauth.js       # OAuth 2.0 flow (authorize, callback, refresh)
│   ├── api/
│   │   ├── vehicles.js          # GET /api/vehicles
│   │   ├── vehicle-data.js      # GET /api/vehicle-data/:vin
│   │   ├── charging.js          # GET /api/charging/:vin
│   │   ├── green-score.js       # GET /api/green-score/:vin
│   │   ├── dashboard.js         # GET /api/dashboard/:vin (aggregate)
│   │   ├── score-history.js     # GET /api/score-history/:vin
│   │   └── portfolio-stats.js   # GET /api/portfolio-stats (admin)
│   ├── scoring/
│   │   ├── engine.js            # GreenDrive Score computation
│   │   ├── tiers.js             # Tier definitions and rate mappings
│   │   └── weights.js           # Scoring weights configuration
│   ├── cache.js                 # In-memory cache with TTL
│   ├── db.js                    # SQLite database (score history persistence)
│   ├── tesla-client.js          # Tesla API HTTP client with auth
│   └── mock-data.js             # Fallback mock data (3-vehicle fleet)
│
├── data/
│   └── greendrive.db            # SQLite database (auto-created, gitignored)
│
├── src/                         # React frontend
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Root component (tabs, lazy-loaded modal/map/admin)
│   ├── hooks/
│   │   ├── useTeslaData.js      # Data fetching hook (live + fallback)
│   │   └── useAuthStatus.js     # Auth status polling
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx       # Bank header with logo + live/mock badge + admin icon
│   │   │   ├── VehicleBanner.jsx # Dark gradient banner with vehicle stats
│   │   │   ├── TabBar.jsx       # Navigation tabs (Score, Vehicle, Charging, Rate)
│   │   │   └── Footer.jsx       # Data source attribution
│   │   ├── Score/
│   │   │   ├── ScoreGauge.jsx   # Circular animated gauge (0-100)
│   │   │   ├── ScoreBreakdown.jsx # Bar chart of score components
│   │   │   ├── ScoreHistory.jsx  # Score trend over time (SQLite-backed)
│   │   │   ├── GreenRateTeaser.jsx # Green rate CTA in Score tab
│   │   │   └── TierBadge.jsx    # Green tier badge
│   │   ├── Vehicle/
│   │   │   ├── VehicleDetails.jsx # VIN, model, odometer, software
│   │   │   ├── BatteryStatus.jsx  # Battery level, range, health
│   │   │   └── VehicleMap.jsx     # Leaflet map with vehicle location (lazy-loaded)
│   │   ├── Charging/
│   │   │   ├── ChargingPattern.jsx    # Home vs public ratio analysis
│   │   │   ├── ChargingRateImpact.jsx # Rate impact shown in Charging tab
│   │   │   ├── ChargingCost.jsx       # Charging cost calculations
│   │   │   ├── EnvironmentalImpact.jsx # CO2 savings, energy stats
│   │   │   └── DataSources.jsx        # Data source status cards (Tesla, DEWA, Open Finance)
│   │   ├── Rate/
│   │   │   ├── RateBenefit.jsx        # Current vs Green rate comparison
│   │   │   ├── TierTable.jsx          # All tiers with "you are here" marker
│   │   │   ├── SavingsProjection.jsx  # Annual + lifetime savings
│   │   │   ├── CompetitiveRates.jsx   # Competitive rate comparison
│   │   │   ├── CrossSell.jsx          # Cross-sell opportunities
│   │   │   ├── ApplyModal.jsx         # Rate application modal (lazy-loaded)
│   │   │   ├── PreQualCertificate.jsx # Pre-qualification certificate
│   │   │   └── RateLock.jsx           # Rate lock-in info
│   │   ├── Admin/
│   │   │   └── PortfolioAnalytics.jsx # Fleet-wide analytics (lazy-loaded)
│   │   └── shared/
│   │       ├── Card.jsx           # Reusable card component
│   │       ├── AnimatedNumber.jsx # Count-up animation
│   │       ├── ProgressBar.jsx    # Horizontal bar with animation
│   │       ├── Badge.jsx          # Status badge
│   │       ├── KVRow.jsx          # Key-value row for detail lists
│   │       ├── Skeleton.jsx       # Loading skeletons (Score, Vehicle, Charging, Rate)
│   │       ├── ErrorBoundary.jsx  # React error boundary wrapper
│   │       ├── StickyApplyBar.jsx # Persistent green rate CTA at page bottom
│   │       └── GreenCallout.jsx   # Reusable green-themed callout
│   ├── styles/
│   │   └── bank-theme.css         # Bank CSS variables, Tailwind import, dark mode
│   └── utils/
│       ├── format.js              # Number/date formatters
│       └── constants.js           # Colors, tier definitions, mock data, config
│
├── public/
│   └── assets/
│       └── logos/                 # Bank logo SVGs
│           ├── default.svg       # Logo on white backgrounds
│           ├── default-2.svg     # Logo on dark backgrounds
│           └── plectrum.svg      # Favicon
│
├── deploy/
│   ├── setup.sh                  # Production deployment setup
│   └── nginx-greendrive.conf     # Nginx reverse proxy config
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                # CI pipeline (lint, build)
│   │   ├── deploy-staging.yml    # Staging deployment
│   │   └── deploy-production.yml # Production deployment
│   ├── dependabot.yml            # Dependency updates
│   ├── CODEOWNERS                # Code ownership rules
│   └── pull_request_template.md  # PR template
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
    "renewableEnergy": { "score": 0, "max": 10, "detail": "Pending — requires DEWA bilateral API + Open Finance transaction data" }
  },
  "computedAt": "2026-02-14T15:30:00Z",
  "dataSource": "live_tesla_fleet_api"
}
```

#### `GET /api/dashboard/:vin`
Aggregate endpoint — returns everything the frontend needs in a single call. Combines vehicle data + green score + metadata. This is the primary endpoint the React frontend calls.

#### `GET /api/score-history/:vin`
Returns historical score data persisted in SQLite, used by the `ScoreHistory` component to render trends over time.

#### `GET /api/portfolio-stats`
Returns fleet-wide analytics for the admin view (total vehicles, average score, tier distribution). Used by the `PortfolioAnalytics` component.

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

### 3.6 Database (`server/db.js`)

SQLite via `better-sqlite3` for persistent data:
- Score history records (VIN, score, tier, breakdown, timestamp)
- Auto-seeded on startup if empty
- Stored in `data/greendrive.db` (gitignored)
- Used by `/api/score-history/:vin` and `/api/portfolio-stats`

---

## 4. GreenDrive Score Engine

### 4.1 Scoring Model

The score is 0–100, computed from six weighted categories:

| Category | Max Points | Data Source | Logic |
|---|---|---|---|
| Battery Health | 20 | Tesla API: `charge_state.battery_range`, `battery_level` | Estimate full-charge range vs EPA rated range for model. Higher retention = higher score. |
| Charging Behavior | 25 | Tesla API: `charge_state.fast_charger_type`, `charging_state` | Home/Wall Connector = 22pts. Mobile Connector = 20. Public DC (CCS/CHAdeMO) = 12. Supercharger = 10. Disconnected/Unknown = 15. Max 25 reserved for future home+renewable combo. |
| Efficiency | 20 | Tesla API: `vehicle_state.odometer` | <5k km = 10. 5–10k = 13. 10–15k = 15. **15–20k = 20 (max)**. 20–30k = 13. 30k+ = 8. Sweet spot rewards moderate EV usage. |
| EV Ownership | 15 | VIN decode (position 4) | Tesla BEV (any model) = 15. Non-Tesla/unknown = 10. |
| Vehicle Condition | 10 | Tesla API: `vehicle_state.car_version` | 2026+ = 10. 2025 = 8. 2024 = 6. <2024 = 4. Granular 4-tier scale rewarding current software. |
| Renewable Energy | 10 | Future: DEWA bilateral API + Al Tareq Open Finance | Currently 0 (pending). Requires two distinct integrations: **(1) DEWA bilateral API** for home energy consumption, solar panel status, and green tariff detection (DEWA is a utility, not an Open Finance participant); **(2) Al Tareq Open Finance** transaction data via bank APIs (`/accounts/{id}/transactions`) to categorize charging spend at DEWA, ADNOC, public EV chargers, etc. These are distinct data sources — DEWA is a utility integration, Open Finance is CBUAE-regulated financial data sharing via the Nebras platform. |

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
- Roadster: 310
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
    suggestions.push({ action: "Connect DEWA for home energy data", potentialPoints: 10 });
  }
  if (breakdown.vehicleCondition.score < 10) {
    suggestions.push({ action: "Update vehicle software", potentialPoints: 3 });
  }
  return suggestions;
}
```

---

## 5. Frontend Specification

### 5.1 Bank Brand Guidelines

**Colors (use CSS variables):**
```css
:root {
  --color-bank-red: #BE000E;           /* Primary — CTAs, accents */
  --color-bank-red-bright: #EC2427;    /* Chart accents */
  --color-bank-maroon: #8E000B;        /* Headings */
  --color-bank-maroon-dark: #5F0007;   /* Deep emphasis */
  --color-bank-pink: #F7E5E5;          /* Callout backgrounds */
  --color-bank-gray-dark: #3F3F3F;     /* Body text */
  --color-bank-gray-mid: #7F7F7F;      /* Secondary text */
  --color-bank-gray: #A5A5A5;          /* Borders, subtle */
  --color-bank-gray-alt: #E4E4E4;      /* Alternate rows */
  --color-bank-gray-bg: #F2F2F2;       /* Section backgrounds */
  --color-bank-blue: #00B0F0;          /* Info callouts */
  --color-bank-blue-ice: #EBFAFF;      /* Light info backgrounds */
  --color-bank-teal: #253943;          /* Dark accent */
  --color-bank-orange: #F26B43;        /* Warnings */
  
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
- Bank plectrum (triangle) can be rendered as CSS clip-path for icons

**Design rules:**
- No top red bar (Bank template is clean white)
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
│  [Bank Logo]  Bank  GreenDrive            [● LIVE DATA]   │
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
├───────────────────────────────────────────────────────────┤
│  ┌─ Sticky Apply Bar (fixed bottom) ─────────────────┐   │
│  │ You qualify for Gold Green rate · [Apply Now →]    │   │
│  └───────────────────────────────────────────────────┘   │
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
| HTTP security headers | Helmet middleware with Content Security Policy (CSP). |
| Token never exposed to frontend | Frontend calls server proxy endpoints. Token stays server-side. |
| State parameter in OAuth | Random 16-byte hex to prevent CSRF. |
| Rate limiting awareness | Cache all responses for 5 minutes. Don't wake vehicle unnecessarily. |
| Dependency auditing | `npm audit` via CI pipeline, Dependabot for automated PRs. |

See `SECURITY.md` for full security documentation.

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
| `""` or `"<invalid>"` | Home / Wall Connector (AC) | Highest (22 pts) |
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

### 9.1 Getting Started

```bash
# 1. Clone and install
git clone <repo-url> && cd greendrive
npm install

# 2. Copy .env.example to .env and configure (optional — works without credentials)
cp .env.example .env

# 3. Run in development
npm run dev          # Starts backend (3001) + frontend (3000) concurrently
```

### 9.2 Development Commands

```bash
npm run dev          # Backend + frontend concurrently
npm run server       # Backend only (node server/index.js)
npm run client       # Frontend only (vite --port 3000)
npm run build        # Production build (vite build → dist/)
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check
npm run healthcheck  # Check if server is running
```

### 9.2.1 Docker Deployment

```bash
docker-compose up -d           # Start production stack
docker-compose down            # Stop production stack
```

### 9.3 Testing Without Tesla Credentials

The app must work entirely on mock data when no `.env` credentials are present. This allows development and review without a Tesla account. The server should start in "mock mode" and log a warning.

---

## 10. Implemented Since V1

These were originally planned as future work and are now production features:

| Feature | Implementation |
|---|---|
| Historical score tracking | SQLite persistence via `better-sqlite3`, `ScoreHistory` component, `/api/score-history/:vin` endpoint |
| Multi-vehicle mock support | 3-vehicle fleet in mock data (Model Y, Model 3, Model X) |
| Production deployment | Docker + Nginx + PM2, GitHub Actions CI/CD (staging + production) |
| Portfolio analytics | Admin tab with fleet-wide stats via `/api/portfolio-stats` |
| Green rate CTAs | StickyApplyBar, GreenCallout, GreenRateTeaser, CompetitiveRates, CrossSell, ApplyModal |
| Security hardening | Helmet + CSP headers, ESLint security plugin, Dependabot, `SECURITY.md` |

## 11. Future Enhancements

These are documented for context and should not be built without approval.

### 11.1 Al Tareq Open Finance Integration

The CBUAE Al Tareq platform (Nebras-operated, Ozone-powered) provides three API families relevant to GreenDrive:

**Banking Data Sharing** (available since Oct 2025 — Retail R2):
| API | Endpoint | GreenDrive Use Case |
|-----|----------|---------------------|
| Account Transactions | `GET /accounts/{id}/transactions` | Categorize EV charging spend (DEWA billing, ADNOC, public chargers) to enrich Renewable Energy score |
| Account Balances | `GET /accounts/{id}/balances` | Affordability assessment for green rate pre-qualification |
| Customer Data | `GET /customer` | KYC enrichment, address verification for DEWA matching |
| Scheduled Payments | `GET /accounts/{id}/scheduled-payments` | Detect existing auto-loan payments for refinancing |

**Insurance Data Sharing**:
| API | Endpoint | GreenDrive Use Case |
|-----|----------|---------------------|
| Policies | `GET /policies`, `GET /policies/{id}` | Detect motor insurance type (comprehensive EV coverage vs basic), cross-sell green insurance |
| Claims | `GET /claims`, `GET /policies/{id}/claims` | Risk assessment — claims history for rate determination |

**Service Initiation** (unique UAE capability — goes beyond data sharing):
| API | Endpoint | GreenDrive Use Case |
|-----|----------|---------------------|
| Domestic Payments (SIP) | `POST /domestic-payments` | One-click loan repayment from within dashboard |
| Recurring Payments (VRP/FRP) | Payment consent APIs | Set up auto-debit for green rate loan payments |
| Payment Refunds | `GET /payment-consents/{id}/refund` | Handle overpayment refunds |

**Consent**: Requires customer authorization via Al Tareq Consent Mobile App. Long-lived consents valid up to 365 days. Customer can revoke at any time.

**Timeline**: Banking transactions available now (R2). Extended data — cards, loans, mortgages — available from Apr 2026 (R4+). Insurance APIs in production.

### 11.2 DEWA Utility Integration

DEWA is a utility company, NOT an Al Tareq participant. Requires a separate bilateral API:
- Home energy consumption data (kWh usage patterns)
- Solar panel detection and green tariff status
- Net metering data for renewable energy scoring

This is distinct from Open Finance — DEWA data enriches the Renewable Energy category directly, while Open Finance transaction data provides indirect signals (DEWA bill amounts, charging station payments).

### 11.3 Other Future Enhancements

| Enhancement | Description | When |
|---|---|---|
| Multi-vehicle live selector | Vehicle selector dropdown for authenticated multi-car accounts | After pilot |
| Fleet Telemetry streaming | Real-time websocket data from Tesla | After pilot |
| BYD / Mercedes EV support | Additional OEM API integrations | Phase 2 |
| Bank SSO integration | Enterprise single sign-on replacing Tesla-only OAuth | Phase 2 |
| Mobile app version | React Native or Flutter | Phase 2 |
| Automated testing | Unit + integration tests per `TEST-STRATEGY.md` | Ongoing |

---

## 12. Definition of Done

The application meets production readiness when:

### Core Functionality
1. ✅ `npm install && npm run dev` launches both server and frontend
2. ✅ Without Tesla credentials: app loads with mock data, all tabs functional
3. ✅ With Tesla credentials: OAuth flow works, real vehicle data displays
4. ✅ "LIVE DATA" / "MOCK DATA" badge shows correct state
5. ✅ GreenDrive Score computes from real data with visible breakdown
6. ✅ All tabs render correctly: Score, Vehicle, Charging, Rate Impact (+ hidden Admin)
7. ✅ Bank branding (colors, typography, logo) matches guidelines
8. ✅ Score gauge animates on load
9. ✅ Refresh button fetches fresh data from Tesla API
10. ✅ Vehicle wake handling works (30s timeout with retry)
11. ✅ Error states display gracefully (no blank screens, no console errors)

### Production Features
12. ✅ Score history persisted in SQLite with trend visualization
13. ✅ Green rate CTAs present across tabs with sticky apply bar
14. ✅ Loading skeletons and error boundaries for resilient UX
15. ✅ Helmet + CSP security headers active
16. ✅ Docker + Nginx deployment stack operational
17. ✅ CI/CD pipelines passing (lint, build, deploy)
18. ✅ ESLint + Prettier enforced
19. ✅ Runs on macOS and Linux with Node.js 18+

---

## 13. My Vehicles — Mobile Retail App

### 13.1 Document Info

| Field | Value |
|---|---|
| Product Name | My Vehicles — Connected Vehicle Management Hub |
| Platform | ADCB Digital Banking · Al Tareq Open Finance Platform |
| Product Owner | Open Finance / Developer Advocacy |
| Business Sponsor | CDO / Retail Banking |
| Document Version | 2.0 — Mobile Retail App |
| Date | February 2026 |
| Classification | Internal — Confidential |
| Standards Alignment | UAE Open Finance v2.1-final |
| Al Tareq Use Case | Connected Vehicle Finance & Insurance |
| Prototype Reference | my-vehicles-prototype.jsx |

### 13.2 Executive Summary

My Vehicles is a mobile-first connected vehicle management hub embedded in ADCB's digital banking app. It gives retail customers a single visual interface to see all their vehicles, monitor vehicle health via OEM APIs, manage auto loans with one-tap refinancing, and compare/switch motor insurance — all powered by Al Tareq Open Finance APIs and aligned to CBUAE Standards v2.1.

This section defines the mobile retail app based on a working interactive prototype (my-vehicles-prototype.jsx). The prototype demonstrates five core screens (Fleet, Vehicle Detail, Refinance Journey, Insurance Journey, OEM Connection) and is aligned to the Insurance Data Sharing and Motor Insurance specifications from UAE Open Finance Standards v2.1-final.

My Vehicles is ADCB's second Al Tareq TPP use case, building on GreenDrive infrastructure. Where GreenDrive proved the platform with a single product (green auto loans), My Vehicles generalizes it into a persistent, multi-vehicle, multi-journey hub that exercises Insurance Data Sharing, Insurance Quote Initiation, and Consent Management APIs.

#### 13.2.1 Value Proposition

- **For customers:** A single place to see all your cars, understand their real-time health and value, refinance your auto loan if rates improve, compare insurance quotes from multiple insurers via Al Tareq, and manage your entire vehicle fleet — all inside the ADCB app.
- **For ADCB:** A persistent engagement surface that generates recurring interaction (not just at loan origination), creates natural cross-sell moments, deepens TPP data moat through ongoing OEM + Open Finance connections, and increases switching costs by making ADCB the operating system for vehicle ownership.
- **For the CDO / TPP strategy:** Exercises Al Tareq Insurance Data Sharing (ReadInsurancePolicies, ReadInsuranceProduct, ReadInsurancePremium, ReadCustomerClaims), Insurance Quote Initiation (motor-insurance-quotes API), and Consent Management. Demonstrates that TPP infrastructure is a platform, not a one-off.

#### 13.2.2 Standards Alignment

This product is designed in compliance with the following CBUAE Open Finance Standards v2.1-final specifications:

- **Insurance Data Sharing:** Consent authorization flow (ICS-1 through ICS-10), Data Cluster permissions (§6.1), consent lifecycle states (§7), single-use and long-lived consent durations, active and expired policy display.
- **Motor Insurance:** Quote data clusters (§5.2.1–5.2.7): Motor Policy, Vehicle Details, Car Registration, Main Driver, Additional Drivers, Existing Insurance, Car Finance. Coverage types (Comprehensive, Third Party Liability). Optional Cover Add-Ons (1.08.01–1.08.09). Engine Properties (Electric/Hybrid/ICE with BatteryCapacity).
- **Insurance Quote Initiation:** TPP-initiated multi-insurer quote request, LFI quote response with customer service metrics, quote lifecycle states, customer redirection to LFI for acceptance.

### 13.3 Problem Statement

Today, vehicle ownership in UAE banking is a disconnected experience. The auto loan lives in the loans section. Motor insurance is managed through a separate insurer portal or broker. Vehicle health data (battery status, service history, mileage) exists only in the manufacturer's app. When a customer wants to refinance or switch insurance, they must navigate multiple systems and start from scratch each time.

Banks have no persistent relationship with the vehicle itself — only with the loan. Once the loan is paid off, the customer disappears. There is no engagement surface, no reason to return, and no data to power the next financial product.

Meanwhile, OEM APIs (Tesla, BMW, Mercedes, BYD) now expose rich vehicle telemetry, and the Al Tareq Open Finance platform enables consent-managed access to insurance policies, premium data, claims history, and multi-insurer quote initiation. The infrastructure exists to build a unified experience — but no UAE bank has done it.

For electric vehicles specifically, the April 2024 UAE floods caused premiums to double, 50% total loss rates, and insurer retreat from the EV segment. Customers need tools to compare insurance options, ensure flood cover is included, and leverage their driving data (via GreenDrive Score) to negotiate better premiums.

### 13.4 Product Vision

My Vehicles transforms ADCB from a lender into a vehicle ownership platform. The customer opens the ADCB app, navigates to the Vehicles tab, sees their cars displayed with real photos, and can:

- **See real-time vehicle data** — battery health, mileage, charge status, GreenDrive Score (if connected to OEM API).
- **View current auto loan details** — outstanding balance, rate, remaining term, next payment, refinancing savings available.
- **Refinance the auto loan** — one-tap journey when a better rate is available based on improved GreenDrive Score or market conditions.
- **View current motor insurance policy** — pulled via Al Tareq Insurance Data Sharing API with full data cluster visibility (policy details, product info, premium, claims).
- **Compare and switch insurance** — Al Tareq Insurance Quote Initiation sends requirements to multiple insurer LFIs, returns quotes with coverage details, Optional Cover Add-Ons, and flood cover indicators.
- **Manage data sharing consent** — see which permissions are granted (ReadInsurancePolicies, ReadInsuranceProduct, etc.), consent expiry, and revocation controls.
- **Add a new vehicle** — connect OEM API, link existing loan/insurance, or start a new purchase journey.
- **Monitor fleet** — multi-vehicle customers see a portfolio overview with alerts (insurance renewal, rate improvement, battery degradation).

Everything happens within the ADCB mobile app. The customer is redirected to the insurer LFI's app only to authenticate consent authorization and to accept a selected insurance quote (per v2.1 Standards §4.1). Consent is managed through Al Tareq's CBUAE-regulated framework with mandatory annual expiry and anytime revocation.

### 13.5 App Screens & Information Architecture

The following screen definitions are derived from the working prototype. Each screen maps to specific Al Tareq APIs, v2.1 data fields, and user journeys.

#### 13.5.1 Fleet Screen (Home)

The primary landing screen when the user navigates to the Vehicles tab. Shows all vehicles in a scrollable card layout with portfolio summary and alert system.

**Portfolio Summary Card:**
A gradient card (ADCB Teal #253943 → Maroon #5F0007) displaying:
- Total portfolio value (sum of all loan balances).
- Vehicle count.
- Annual insurance cost (sum of all motor insurance premiums).
- Connected vehicle ratio (vehicles with active OEM API link vs. total).
- ADCB plectrum watermark (white variant, low opacity) for brand identity.

**Alert Badges:**
Horizontally scrollable alert strip below the portfolio card. Each badge is a pill linking to its vehicle and relevant journey:
- Rate badge (green): Better auto loan rate available based on GreenDrive Score improvement or market rates. Links to Refinance Journey.
- Renewal badge (amber): Insurance renewal approaching. Displays days remaining. Links to Insurance tab.
- Score badge (blue): GreenDrive Score changed. Links to Health tab.
- Connect badge (pink/maroon): Vehicle not connected to OEM API. Links to OEM Connection journey.

**Vehicle Cards:**
Each vehicle is a full-width card displaying:
- Vehicle identity: Year, Make, Model (e.g., "2024 Tesla Model 3 Performance"). PlateSource, PlateCode, PlateNumber (e.g., "DXB Z 14729" per v2.1 §5.2.3 Car Registration fields). EngineType display (Electric/Hybrid/ICE per v2.1 §2.12).
- GreenDrive Score gauge: Circular progress indicator (0–100) with tier badge (Standard/Bronze/Silver/Gold/Platinum) for connected vehicles. Dashed "Connect" button for disconnected vehicles.
- Summary stats row: Loan rate %, annual insurance premium (AED), odometer reading (km).
- Battery bar: Charge level %, State of Health % (for connected EVs only).
- Alert badges: Overlaid in top-right corner.

**Add Vehicle Card:**
A dashed-border card at the bottom of the fleet list with a "+" icon. Tapping initiates the Add Vehicle flow (OEM OAuth connection or manual VIN entry).

#### 13.5.2 Vehicle Detail Screen

Accessed by tapping a vehicle card. Shows vehicle hero, specs bar, and a tabbed content area.

**Vehicle Hero:** Year, Make, Model, PlateSource + PlateCode + PlateNumber, odometer, GreenDrive Score gauge and tier badge (if connected).

**Specs Bar:** A horizontal row showing key vehicle specifications — Power (hp), Torque (Nm), 0–100 km/h acceleration, Top speed.

**Tab Navigation:** Four tabs (three for disconnected vehicles):
- **Overview:** Quick action buttons, alert feed, vehicle identity card, summary cards (loan, insurance, battery, efficiency).
- **Loan:** Full auto loan details with refinancing call-to-action.
- **Insurance:** Full motor insurance policy view aligned to v2.1 Insurance Data Sharing. Data Sharing Consent status. Quote initiation.
- **Health:** GreenDrive Score breakdown, battery status. Only shown for OEM-connected vehicles.

#### 13.5.3 Insurance Tab

This is the most v2.1-aligned screen. It implements Insurance Data Sharing (§6 Data Clusters), Motor Insurance Cover Options (§1.1.1), and OptionalCoverAddOns (§5.2.1 fields 1.08.01–1.08.09).

**Motor Insurance Policy Card fields mapped to v2.1:**

| UI Field | Data Cluster / Permission | Standard Ref |
|---|---|---|
| Policy ID | ReadInsurancePolicies | §6.1 row 1 |
| Provider | ReadInsurancePolicies | §6.1 row 1 |
| Policy Type | ReadInsuranceProduct | §5.2.1 field 1.01 |
| Coverage Type | ReadInsuranceProduct | §1.1.1 |
| Registration Type | ReadInsuranceProduct | §5.2.1 field 1.03 |
| Annual Premium | ReadInsurancePremium | §5.2 IDSLR-1 |
| Policy Period | ReadInsuranceProduct | §5.2.1 fields 1.04–1.05 |
| Days to Renewal | Derived | Product logic |
| Claims History | ReadCustomerClaims | §6.1 row 6 |

**Cover Add-Ons Section (v2.1 §5.2.1 fields 1.08.01–1.08.09):**

| # | Add-On | API Field | Description |
|---|---|---|---|
| 1.08.01 | Driver Cover | DriverCover | Bodily injury/death compensation |
| 1.08.02 | Passenger Cover | PassengerCover | Medical/disability for passengers |
| 1.08.03 | Roadside Assistance | RoadsideAssistance | Breakdown recovery services |
| 1.08.04 | Protected No Claims | ProtectedNoClaims | Retain NCD after a claim |
| 1.08.05 | Agency Repairs | AgencyRepairs | Authorized service center repairs |
| 1.08.06 | Loss of Keys | LossOfKeys | Key replacement coverage |
| 1.08.07 | Hire Car | HireCar | Replacement car during repair |
| 1.08.08 | GCC Cover | GCC | Coverage across GCC countries |
| 1.08.09 | Oman Cover | OmanCover | Extended coverage to Oman |

Active add-ons display as green pills with a check icon. Inactive add-ons display as gray pills with an X icon. The counter shows "X/9 active".

**Data Sharing Consent Card:**
- Authorised state: Green badge, granted permissions as monospace pills, consent expiry date, "Manage Consent" link.
- No consent state: Pink/maroon callout explaining consent via Al Tareq is required.

**Quote Initiation CTA:** A blue "Get Quotes via Al Tareq" button that launches the Insurance Quote Journey modal.

### 13.6 User Journeys

#### 13.6.1 Auto Loan Refinancing

| Step | Action | Detail |
|---|---|---|
| 1 | Rate Comparison | Modal opens showing current rate (struck through) vs. new rate. Savings displayed monthly and annually. Rate improvement based on GreenDrive Score tier. |
| 2 | Pre-Approval | Checklist: income verified via Al Tareq Bank Data Sharing, vehicle collateral valued from OEM API, GreenDrive Score and tier, pre-approved with no documents. Rate locked for 48 hours. |
| 3 | Confirm & Sign | Final terms: new rate, new monthly payment, savings, remaining term, settlement fee. Digital signature via ADCB e-sign. |

#### 13.6.2 Insurance Data Sharing Consent (ICS-1 through ICS-10)

| Step | Action | Detail |
|---|---|---|
| ICS-1 | User Setup | Present ADCB TPP Terms & Conditions and Privacy Notice. |
| ICS-2 | Data Sharing Consent | Display data clusters being requested using standard language from §6.1. Confirm consent duration. |
| ICS-3 | Consent Staging | ADCB calls LFI's PAR endpoint via API Hub. Consent set to AwaitingAuthorisation. |
| ICS-4 | Hand-off to LFI | User informed of redirect to insurer for authentication. |
| ICS-5 | User Authentication | LFI authenticates user via MFA. |
| ICS-6 | Display Consent Details | LFI shows data permissions, active and expired policies. User selects policies. |
| ICS-7 | Consent Authorization | User authorizes. LFI notifies API Hub. Status updated to Authorised. |
| ICS-8/9 | Return to ADCB | Confirmation screen. Insurance tab updates with policy data. |
| ICS-10 | Token Exchange | ADCB exchanges authorization code for access + refresh tokens. |

#### 13.6.3 Motor Insurance Quote Initiation

| Step | Action | Detail |
|---|---|---|
| 1 | Consent & Data Sharing | Guide through consent flow if none exists. Single-use consent (24hr) for quote-only. |
| 2 | Quote Requirements | Confirm CoverageType, InsurancePolicyType, RegistrationType, toggle OptionalCoverAddOns. |
| 3 | Quote Retrieval | POST /motor-insurance-quotes. Holding screen while retrieving quotes from LFIs. |
| 4 | Quote Comparison | Side-by-side quote cards: insurer, premium, coverage, flood cover, add-ons, "Best Deal" badge. |
| 5 | Quote Acceptance | User redirected to selected insurer LFI to complete and accept quote (per v2.1 §4.1). |

#### 13.6.4 OEM API Connection

| Step | Action | Detail |
|---|---|---|
| 1 | Benefits display | Vehicle image + benefits: battery health, GreenDrive Score, accurate insurance quotes, maintenance alerts. |
| 2 | OAuth flow | In-app browser opens OEM OAuth endpoint. User authenticates and grants read access. |
| 3 | Data enrichment | Vehicle card updates with live telemetry. GreenDrive Score computed. Health tab available. |

### 13.7 Detailed Requirements

#### 13.7.1 Vehicle Display & Management

| ID | Requirement | Priority | Phase |
|---|---|---|---|
| MV-01 | Visual vehicle cards with make, model, year, PlateSource/PlateCode/PlateNumber, EngineType | P0 | 1 |
| MV-02 | Multiple vehicles per customer with scrollable fleet view and portfolio summary | P0 | 1 |
| MV-03 | GreenDrive Score gauge (0–100) with tier badge on connected vehicles | P0 | 1 |
| MV-04 | Vehicle Identity Card with all Motor Insurance Quote API fields | P0 | 1 |
| MV-05 | OEM API connection via OAuth 2.0 (Tesla Fleet API first, EU region) | P0 | 1 |
| MV-06 | Live vehicle data: battery SoH%, charge level%, odometer, range, efficiency | P1 | 1 |
| MV-07 | Battery bar with charge level color coding and SoH display | P1 | 1 |
| MV-08 | Alert badge system: rate (green), renewal (amber), score (blue), connect (pink) | P0 | 1 |
| MV-09 | Add Vehicle card supporting OEM OAuth or manual VIN entry | P1 | 1 |
| MV-10 | Remove/disconnect vehicle with data deletion and consent revocation | P0 | 1 |
| MV-11 | Multi-OEM support: BMW CarData, Mercedes High Mobility, Smartcar | P2 | 3 |
| MV-12 | Specs bar: power, torque, 0–100, top speed from Make/Model/Trim lookup | P1 | 1 |

#### 13.7.2 Auto Loan & Refinancing

| ID | Requirement | Priority | Phase |
|---|---|---|---|
| RF-01 | Loan detail view: balance, rate, monthly payment, remaining term | P0 | 1 |
| RF-02 | Rate comparison callout: current vs. new rate with savings | P0 | 1 |
| RF-03 | Pre-approval using Al Tareq Bank Data Sharing + OEM collateral valuation | P0 | 2 |
| RF-04 | GreenDrive Score-based rate tier (Standard 0.00% to Platinum 0.50% reduction) | P0 | 1 |
| RF-05 | 3-step refinancing modal: Rate Comparison → Pre-Approval → Confirm & Sign | P0 | 2 |
| RF-06 | Digital signature and loan booking within app | P0 | 2 |
| RF-07 | Rate lock for 48 hours with countdown | P1 | 2 |
| RF-08 | Proactive push notification for better rate | P1 | 2 |
| RF-09 | Post-refinance insurance review prompt | P1 | 2 |
| RF-10 | Balance transfer from competitor via Al Tareq cross-bank data | P2 | 3 |

#### 13.7.3 Motor Insurance (v2.1 Aligned)

| ID | Requirement | Priority | Phase |
|---|---|---|---|
| IN-01 | Policy display with all v2.1 Data Cluster fields | P0 | 1 |
| IN-02 | All 9 OptionalCoverAddOns as toggle pills with active/inactive state | P0 | 1 |
| IN-03 | Flood & Natural Disaster cover indicator with warning when missing | P0 | 1 |
| IN-04 | Data Sharing Consent card with status, permissions, expiry, controls | P0 | 1 |
| IN-05 | Insurance Data Sharing consent flow (ICS-1 through ICS-10) with LFI redirect | P0 | 2 |
| IN-06 | Quote Initiation via POST /motor-insurance-quotes | P0 | 2 |
| IN-07 | Multi-insurer quote comparison cards with "Best Deal" badge | P0 | 2 |
| IN-08 | OptionalCoverAddOns selectable as toggle grid before requesting quotes | P0 | 2 |
| IN-09 | Customer redirection to LFI for quote acceptance (per v2.1 §4.1) | P0 | 2 |
| IN-10 | EngineType and BatteryCapacity in quote API request body | P0 | 1 |
| IN-11 | ReadInsurancePremium support with JWE decryption | P1 | 2 |
| IN-12 | Renewal reminders (30/14/7 days) with countdown | P0 | 1 |
| IN-13 | Consent modification with BaseConsentId linking | P1 | 2 |
| IN-14 | Single-use consent (24hr) and long-lived consent (up to 1 year) | P0 | 2 |
| IN-15 | Data attribution footer: "Policy data via Al Tareq Insurance Data Sharing API · v2.1" | P0 | 1 |
| IN-16 | Premium reduction pathway via GreenDrive Score | P1 | 2 |
| IN-17 | PlateSource/PlateCode/PlateNumber on card and in quote request | P0 | 1 |

#### 13.7.4 GreenDrive Score & Health

| ID | Requirement | Priority | Phase |
|---|---|---|---|
| GD-01 | GreenDrive Score (0–100) from 6 categories | P0 | 1 |
| GD-02 | Category breakdown bars on Health tab | P0 | 1 |
| GD-03 | Battery status card: charge bar, SoH %, range, cell voltage | P0 | 1 |
| GD-04 | Live data attribution with refresh icon | P0 | 1 |
| GD-05 | Score trend tracking and milestone notifications | P1 | 2 |
| GD-06 | DEWA utility data for Renewable Energy scoring | P2 | 3 |

#### 13.7.5 Alerts & Notifications

| ID | Requirement | Priority | Phase |
|---|---|---|---|
| AL-01 | Insurance renewal approaching (30/14/7 days) — amber badge | P0 | 1 |
| AL-02 | Better loan rate available — green badge | P1 | 1 |
| AL-03 | GreenDrive Score change — blue badge | P1 | 1 |
| AL-04 | OEM connection prompt — pink badge | P1 | 1 |
| AL-05 | Battery health degradation detected | P2 | 2 |
| AL-06 | Flood risk alert | P2 | 3 |
| AL-07 | Push notifications for high-priority alerts | P1 | 2 |

### 13.8 Technical Architecture

#### 13.8.1 System Overview

My Vehicles is a micro-frontend widget embedded in ADCB's digital banking shell (mobile-first, responsive web). It communicates with a dedicated backend API layer that orchestrates data from three sources: OEM vehicle APIs, Al Tareq Open Finance APIs via the API Hub, and ADCB core banking systems.

| Layer | Components |
|---|---|
| Presentation | My Vehicles micro-frontend (React). ADCB brand-compliant UI with custom SVG icon system. Responsive mobile-first layout in 780px phone frame. |
| API Gateway | Kong API Gateway (existing ADCB infra). Rate limiting, mTLS, request routing. |
| Orchestration | My Vehicles Backend Service (Node.js/Express, extending GreenDrive server). |
| Al Tareq APIs | Insurance Data Sharing, Insurance Quote Initiation, Bank Data Sharing, Consent Management. |
| OEM APIs | Tesla Fleet API (Phase 1). BMW CarData, Mercedes High Mobility, Smartcar (Phase 3). |
| Infrastructure | AWS (Bahrain region). Redis for session/cache. PostgreSQL for vehicle records, consent state. |

#### 13.8.2 Motor Insurance Quote API Field Mapping

| Data Cluster | API Field | UI Source | Required |
|---|---|---|---|
| Motor Policy | CoverageType | Quote requirements screen | Yes |
| Motor Policy | InsurancePolicyType | Quote requirements screen | No |
| Motor Policy | RegistrationType | Quote requirements screen | No |
| Motor Policy | PolicyStartDate | Auto-set to current policy end date | Yes |
| Motor Policy | CarUsage | Vehicle Identity Card | Yes |
| Motor Policy | OptionalCoverAddOns (all 9) | Toggle grid | Yes (each) |
| Vehicle Details | ChassisNumber | Vehicle Identity Card | No |
| Vehicle Details | ModelYear | Vehicle card header | Yes |
| Vehicle Details | Make | Vehicle card header | Yes |
| Vehicle Details | Model | Vehicle card header | Yes |
| Vehicle Details | EngineType | Vehicle Identity Card | Yes |
| Vehicle Details | BatteryCapacity | Vehicle Identity Card | No (EV conditional) |
| Car Registration | PlateCode | Vehicle card subtitle | No |
| Car Registration | PlateNumber | Vehicle card subtitle | No |
| Car Registration | PlateSource | Vehicle card subtitle | No |

### 13.9 Relationship to GreenDrive

| Dimension | GreenDrive | My Vehicles |
|---|---|---|
| Scope | Single product: green auto loan + scoring | Multi-journey hub: overview, refinance, insurance, fleet, OEM connection |
| Lifecycle moment | Loan origination (one-time) | Ongoing vehicle ownership (persistent) |
| Customer touchpoint | Applied for at point of sale | Always-on in ADCB mobile app Vehicles tab |
| Insurance integration | Score influences premium (indirect) | Full v2.1 Insurance Data Sharing + Quote Initiation (direct) |
| Data model | Single vehicle, score-focused | Multi-vehicle fleet, all v2.1 Motor Insurance API fields |
| Revenue model | Rate discount + bancassurance | Refinancing + insurance switch commission + cross-sell + retention |
| What it proves | TPP platform works for a single product | TPP platform is reusable across multiple financial + insurance journeys |

GreenDrive Score is a feature within My Vehicles. The existing GreenDrive prototype becomes the scoring engine module. My Vehicles wraps it in a persistent, multi-vehicle, multi-journey experience with full v2.1 Insurance API alignment.

### 13.10 Phased Delivery

| Phase | Timeline | Scope |
|---|---|---|
| Phase 1 — Foundation | Q3 2026 | Vehicle display from loan records + Tesla Fleet API. GreenDrive Score. Insurance policy view (read-only via Al Tareq). All 9 add-on pills. Consent status display. Alert badges. Portfolio summary. |
| Phase 2 — Journeys | Q4 2026 | Full refinancing journey. Insurance consent flow (ICS-1–ICS-10). Quote Initiation. Multi-insurer comparison. Push notifications. |
| Phase 3 — Expansion | H1 2027 | Multi-OEM. DEWA utility data. Competitor loan balance transfer. Arabic language support. |

### 13.11 Success Metrics

| Metric | Target (6 months) | Rationale |
|---|---|---|
| OEM API connections | 500 vehicles | Customer willingness to connect vehicle data to bank |
| Monthly active users | 1,500 MAU | Hub drives recurring engagement |
| Refinancing conversion | 8% of eligible | Better-rate notifications convert at higher rate |
| Insurance quote requests | 200/month | Insurance Quote Initiation API adoption |
| Insurance switch rate | 15% at renewal | In-app comparison exceeds broker channel |
| Consent grant rate | 70%+ | Users willing to authorize Insurance Data Sharing |
| Cross-sell attachment | 30% loan + insurance | Bundled journey increases attachment |
| TPP API call volume | 50K calls/month | TPP infrastructure scales with real traffic |

### 13.12 Integration with GreenDrive Web App

The My Vehicles mobile retail channel is integrated into the existing GreenDrive application as a parallel interface accessible via a channel switcher in the header. The architecture supports three distinct channels:

1. **GreenDrive** (existing): Web dashboard for single-vehicle GreenDrive Score analysis, charging patterns, and rate impact.
2. **My Vehicles** (new): Mobile-first retail hub for multi-vehicle fleet management, loan refinancing, and insurance via Al Tareq.
3. **Admin** (existing): Portfolio analytics for fleet-wide aggregate statistics.

The channel switcher is a segmented control in the header that allows switching between channels without page reload. All channels share the same Express backend, authentication state, and mock data fallback system. The My Vehicles channel renders inside a 780px mobile phone frame to demonstrate the mobile-first experience in the desktop web environment.
