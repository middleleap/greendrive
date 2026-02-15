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
