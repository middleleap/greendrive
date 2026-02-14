# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ADCB GreenDrive — Data-Driven Green Finance Prototype. Connects to the Tesla Fleet API, computes a GreenDrive Score from real vehicle data, and displays it in an ADCB-branded React dashboard. Read `PRD-greendrive.md` for full specifications — **always consult the PRD before implementing any feature**.

## Commands

```bash
npm install          # Install all deps (root + client)
npm run dev          # Start backend (3001) + frontend (3000) concurrently
npm run server       # Backend only
npm run client       # Frontend only
```

No test framework in V1. Validation is manual: app starts without errors, all four tabs render, mock mode is indistinguishable from live (except badge).

## Architecture

**Two-process setup:** Express backend (port 3001) proxies Tesla Fleet API calls and holds tokens in-memory. React/Vite frontend (port 3000) fetches from `/api/*` endpoints. Frontend never touches Tesla directly.

**Data flow:**
1. Frontend `useTeslaData` hook tries `GET /api/auth-status` with 2s timeout
2. If authenticated → fetches `/api/vehicles` → `/api/dashboard/:vin` (aggregate endpoint)
3. Any failure → silently falls back to bundled mock data (no user-visible error)
4. Backend caches all Tesla responses in-memory with 5-min TTL (`server/cache.js`)

**Mock data fallback is mandatory.** The app must work fully without Tesla credentials. The only visible difference is an orange "MOCK DATA" badge vs green "LIVE DATA" badge.

**Scoring engine** (`server/scoring/`): Computes 0–100 GreenDrive Score from 6 weighted categories. See PRD §4 for weights, tier definitions, and VIN decoding logic.

## Critical Implementation Gotchas

- **Tesla API region for UAE is EU:** `https://fleet-api.prd.eu.vn.cloud.tesla.com`
- **Token exchange URL:** `https://fleet-auth.prd.vn.cloud.tesla.com` (NOT auth.tesla.com)
- **Read-only scopes only:** Never request `vehicle_cmds`
- **Vehicle wake handling:** 408 response → call `wake_up`, poll every 5s for up to 30s, then retry
- **Tokens are server-side only:** Never sent to frontend, never persisted to disk, lost on restart
- **Charger type detection:** Empty string or `"<invalid>"` in `fast_charger_type` means home/wall connector (highest score), not an error

## ADCB Brand Rules

- **Colors:** Primary Red `#BE000E`, Dark Maroon `#8E000B`, Green theme `#0A6847`/`#16A34A`/`#22C55E`, Teal `#253943`. Full palette in PRD §5.1.
- **Font stack:** `'Helvetica Neue', Helvetica, Arial, sans-serif` — no Inter, no Roboto, no system fonts
- **Cards:** White bg, 1px `#E4E4E4` border, 12px border-radius, subtle shadow
- **Callouts:** `#F7E5E5` background with `#BE000E` 3px left border
- **No top red bar.** ADCB template is clean white header.
- **Logos:** `default.svg` on white, `default-2.svg` on dark, `plectrum.svg` as favicon

## What NOT to Build

No database, no user auth (beyond Tesla OAuth), no Al Tareq/Open Finance integration (placeholder only), no mobile app, no CI/CD, no production deployment, no unit tests.
