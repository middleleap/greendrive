# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bank GreenDrive — Data-Driven Green Finance Prototype. Connects to the Tesla Fleet API, computes a GreenDrive Score from real vehicle data, and displays it in a Bank-branded React dashboard. Read `PRD-greendrive.md` for full specifications — **always consult the PRD before implementing any feature**.

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

No test framework in V1. Validation is manual: app starts without errors, all four tabs render, mock mode is indistinguishable from live (except badge).

## Architecture

**Two-process setup:** Express backend (port 3001) proxies Tesla Fleet API calls and holds tokens in-memory. React/Vite frontend (port 3000) fetches from `/api/*` endpoints. Frontend never touches Tesla directly. Project uses ESM (`"type": "module"` in package.json).

**Primary endpoint:** `GET /api/dashboard/:vin` is the aggregate endpoint — returns vehicle data, score, charging, and metadata in a single response. This is what the frontend consumes.

**Three-layer mock fallback (all mandatory):**
1. **Live data:** Authenticated → Tesla API via backend → cache 5min
2. **Server mock:** Backend reachable but not authenticated → `server/mock-data.js`
3. **Frontend mock:** Backend unreachable (2s timeout) → `src/utils/constants.js` `MOCK_DASHBOARD`

User only sees orange "MOCK DATA" vs green "LIVE DATA" badge. No errors surface to the user in any failure mode.

**Scoring engine** (`server/scoring/`): Computes 0–100 GreenDrive Score from 6 weighted categories. `weights.js` defines max points per category, `tiers.js` maps score ranges to tier names and rate reductions, `engine.js` has the computation logic.

**Styling:** Tailwind CSS 4 with CSS custom properties defined in `src/styles/bank-theme.css` — no `tailwind.config.js` file.

## Scoring Logic — Non-Obvious Details

- **VIN decoding:** Model extracted from 4th character of VIN (`S`=Model S, `3`=Model 3, `X`=Model X, `Y`=Model Y, `R`=Roadster, `C`=Cybertruck)
- **Odometer sweet spot:** 15–20k km scores maximum (20pts). Lower = assumes less EV commitment, higher = wear penalty
- **Software version parsing:** Year extracted from `car_version` string (e.g., `"2025.2.6 abc123"` → `2025`), newer = higher score
- **Battery health:** `fullRangeEstimate = (battery_range / battery_level) * 100`, then compared to EPA rated range
- **Renewable Energy category:** Always scores 0 — placeholder for future DEWA/Open Finance integration
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

## What NOT to Build

No database, no user auth (beyond Tesla OAuth), no Al Tareq/Open Finance integration (placeholder only), no mobile app, no unit tests.
