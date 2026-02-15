# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bank GreenDrive — Data-Driven Green Finance Application. Connects to the Tesla Fleet API, computes a GreenDrive Score from real vehicle data, and displays it in a Bank-branded React dashboard. Production-deployed with Docker, Nginx, and GitHub Actions CI/CD. Read `PRD-greendrive.md` for full specifications — **always consult the PRD before implementing any feature**.

## Commands

```bash
npm install          # Install all deps (root + client)
npm run dev          # Start backend (3001) + frontend (3000) concurrently
npm run server       # Backend only
npm run client       # Frontend only
npm run build        # Vite production build → dist/
```

Useful dev endpoints:
- `GET http://localhost:3001/` — health check
- `POST http://localhost:3001/api/cache/clear` — flush in-memory cache
- `GET http://localhost:3001/auth` — start Tesla OAuth flow (when credentials configured)

No test framework yet. Validation is manual: app starts without errors, all tabs render, mock mode is indistinguishable from live (except badge). See `TEST-STRATEGY.md` for the testing roadmap.

## Architecture

**Two-process setup:** Express backend (port 3001) proxies Tesla Fleet API calls and holds tokens in-memory. React/Vite frontend (port 3000) fetches from `/api/*` endpoints. Frontend never touches Tesla directly. Project uses ESM (`"type": "module"` in package.json).

**Primary endpoint:** `GET /api/dashboard/:vin` is the aggregate endpoint — returns vehicle data, score, charging, and metadata in a single response. This is what the frontend consumes.

**Three-layer mock fallback (all mandatory):**
1. **Live data:** Authenticated → Tesla API via backend → cache 5min
2. **Server mock:** Backend reachable but not authenticated → `server/mock-data.js`
3. **Frontend mock:** Backend unreachable (2s timeout) → `src/utils/constants.js` `MOCK_DASHBOARD`

User only sees orange "MOCK DATA" vs green "LIVE DATA" badge. No errors surface to the user in any failure mode.

**Scoring engine** (`server/scoring/`): Computes 0–100 GreenDrive Score from 6 weighted categories. `weights.js` defines max points per category, `tiers.js` maps score ranges to tier names and rate reductions, `engine.js` has the computation logic.

**Database:** SQLite via `better-sqlite3` (`server/db.js`) persists score history. Seeded on startup. Data stored in `data/greendrive.db`.

**Admin tab:** Hidden behind header icon button. `PortfolioAnalytics.jsx` shows fleet-wide stats via `GET /api/portfolio-stats`.

**Styling:** Tailwind CSS 4 with CSS custom properties defined in `src/styles/bank-theme.css` — no `tailwind.config.js` file.

**Deployment:** Dockerized (`Dockerfile` + `docker-compose.yml`), Nginx reverse proxy (`deploy/nginx-greendrive.conf`), PM2 process manager (`ecosystem.config.cjs`). CI/CD via GitHub Actions (`.github/workflows/`): `ci.yml`, `deploy-staging.yml`, `deploy-production.yml`.

## Scoring Logic — Non-Obvious Details

- **VIN decoding:** Model extracted from 4th character of VIN (`S`=Model S, `3`=Model 3, `X`=Model X, `Y`=Model Y, `R`=Roadster, `C`=Cybertruck)
- **Odometer sweet spot:** 15–20k km scores maximum (20pts). Lower = assumes less EV commitment, higher = wear penalty. Scale: <5k=10, 5–10k=13, 10–15k=15, **15–20k=20**, 20–30k=13, 30k+=8
- **Charging behavior scoring:** Home/Wall Connector (`<invalid>` or `""`)=22pts, Mobile Connector=20, Public DC (CCS/CHAdeMO)=12, Supercharger=10, Disconnected/Unknown=15. Max is 25 but 22 is the highest achievable from Tesla data alone
- **Vehicle condition scoring:** Year from `car_version` → 2026+=10, 2025=8, 2024=6, <2024=4. Granular 4-tier scale, not the simpler 3-tier in the original PRD
- **Software version parsing:** Year extracted from `car_version` string (e.g., `"2025.2.6 abc123"` → `2025`), newer = higher score
- **Battery health:** `fullRangeEstimate = (battery_range / battery_level) * 100`, then compared to EPA rated range. EPA ranges (miles): S=405, 3=358, X=348, Y=330, R=310, C=340
- **Renewable Energy category:** Always scores 0 — placeholder requiring two distinct integrations: (1) DEWA bilateral API for home energy/solar data (DEWA is a utility, not an Open Finance participant); (2) Al Tareq Open Finance transaction data to categorize charging spend (DEWA billing, ADNOC, public chargers). See PRD §11.1–11.2 for full data scope
- **Suggestions:** Dynamically generated based on which categories scored low

## Critical Implementation Gotchas

- **Tesla API region for UAE is EU:** `https://fleet-api.prd.eu.vn.cloud.tesla.com`
- **Token exchange URL:** `https://fleet-auth.prd.vn.cloud.tesla.com` (NOT auth.tesla.com)
- **Read-only scopes only:** Never request `vehicle_cmds`
- **Vehicle wake handling:** 408 response → call `wake_up`, poll every 5s for up to 30s, then retry
- **Tokens are server-side only:** Never sent to frontend, never persisted to disk, lost on restart
- **Charger type detection:** Empty string or `"<invalid>"` in `fast_charger_type` means home/wall connector (highest score), not an error
- **Token auto-refresh:** `tesla-client.js` refreshes tokens when <60s remaining before expiry

## Brand Rules

- **Colors:** Primary Red `#BE000E`, Dark Maroon `#8E000B`, Green theme `#0A6847`/`#16A34A`/`#22C55E`, Teal `#253943`. Full palette in PRD §5.1.
- **Font stack:** `'Helvetica Neue', Helvetica, Arial, sans-serif` — no Inter, no Roboto, no system fonts
- **Cards:** White bg, 1px `#E4E4E4` border, 12px border-radius, subtle shadow
- **Callouts:** `#F7E5E5` background with `#BE000E` 3px left border
- **No top red bar.** Clean white header.
- **Logos:** `default.svg` on white, `default-2.svg` on dark, `plectrum.svg` as favicon

## Key Components Beyond PRD Scope

These were added post-V1 and are now part of the production app:

- **StickyApplyBar** (`shared/StickyApplyBar.jsx`) — persistent green rate CTA bar at page bottom
- **GreenCallout** (`shared/GreenCallout.jsx`) — reusable green-themed callout for rate CTAs
- **GreenRateTeaser** (`Score/GreenRateTeaser.jsx`) — rate teaser shown in Score tab
- **ChargingRateImpact** (`Charging/ChargingRateImpact.jsx`) — rate impact shown in Charging tab
- **CompetitiveRates** / **CrossSell** (`Rate/`) — competitive rate comparison and cross-sell cards
- **ApplyModal** (`Rate/ApplyModal.jsx`) — rate application modal (lazy-loaded)
- **PreQualCertificate** / **RateLock** (`Rate/`) — pre-qualification and rate lock components
- **ScoreHistory** (`Score/ScoreHistory.jsx`) — score trend over time (backed by SQLite)
- **Skeleton** (`shared/Skeleton.jsx`) — loading skeletons for all 4 tabs
- **ErrorBoundary** (`shared/ErrorBoundary.jsx`) — React error boundary wrapper
- **VehicleMap** (`Vehicle/VehicleMap.jsx`) — Leaflet map with vehicle location (lazy-loaded)
- **PortfolioAnalytics** (`Admin/PortfolioAnalytics.jsx`) — admin fleet analytics (lazy-loaded)

## What NOT to Build

No user auth (beyond Tesla OAuth), no Al Tareq/Open Finance integration (placeholder only), no mobile app.
