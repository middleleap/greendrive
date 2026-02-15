# Bank GreenDrive

Data-driven Green Finance application that connects to the Tesla Fleet API, computes a GreenDrive Score from real vehicle data, and displays it in a Bank-branded dashboard.

Built for demo to Bank CDO and Retail Banking leadership — shows how Bank can evolve existing Green Car Loans into a continuously scored, data-driven product.

## Quick Start

```bash
npm install
npm run dev
```

Opens at **http://localhost:3000**. Works immediately with mock data — no Tesla credentials needed.

## Connecting to Tesla (Optional)

1. Register an app at [developer.tesla.com](https://developer.tesla.com)
2. Generate keys: `bash scripts/generate-keys.sh`
3. Upload `keys/public.pem` to your Tesla developer app
4. Copy `.env.example` to `.env` and fill in your credentials:
   ```
   TESLA_CLIENT_ID=<from developer.tesla.com>
   TESLA_CLIENT_SECRET=<from developer.tesla.com>
   TESLA_REDIRECT_URI=http://localhost:3001/callback
   TESLA_REGION=eu
   ```
5. Run `npm run dev` and visit **http://localhost:3001/auth** to start the OAuth flow

Once authenticated, the dashboard switches from mock data to live Tesla data automatically.

## GreenDrive Score

0–100 score computed from six categories:

| Category | Max | Source |
|----------|-----|--------|
| Battery Health | 20 | Battery range retention vs EPA rated range |
| Charging Behavior | 25 | Home charging scores highest, Supercharger lowest |
| Efficiency | 20 | Moderate usage (10–20k km) is optimal |
| EV Ownership | 15 | Full BEV = max score |
| Vehicle Condition | 10 | Recent software version scores higher |
| Renewable Energy | 10 | Pending DEWA/Open Finance integration |

### Tiers

| Tier | Score | Rate Reduction |
|------|-------|----------------|
| Platinum Green | 85–100 | 0.50% |
| Gold Green | 70–84 | 0.40% |
| Silver Green | 55–69 | 0.25% |
| Bronze Green | 40–54 | 0.10% |
| Standard | 0–39 | 0.00% |

## Architecture

```
Browser (localhost:3000)          Express API (localhost:3001)          Tesla Fleet API
┌─────────────────────┐          ┌─────────────────────────┐          ┌─────────────────┐
│  React + Vite       │  /api/*  │  OAuth 2.0 proxy        │  HTTPS   │  EU region       │
│  Tailwind CSS       │ ──────── │  Score engine            │ ──────── │  Vehicle data    │
│  Bank branded       │          │  In-memory cache (5min)  │          │  Charge history  │
└─────────────────────┘          └─────────────────────────┘          └─────────────────┘
```

Frontend never touches Tesla directly. Tokens stay server-side, in-memory only.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + frontend concurrently |
| `npm run server` | Backend only (port 3001) |
| `npm run client` | Frontend only (port 3000) |
| `npm run build` | Production build to `dist/` |

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** React 18 + Vite 6 + Tailwind CSS 4
- **Auth:** Tesla OAuth 2.0 (EU region for UAE)
- **Data:** In-memory cache, no database

## Project Structure

```
server/
  index.js              Express entry point
  auth/tesla-oauth.js   OAuth 2.0 flow
  tesla-client.js       Tesla API client with wake handling
  scoring/engine.js     GreenDrive Score computation
  api/dashboard.js      Aggregate endpoint (primary)
  cache.js              In-memory TTL cache
  mock-data.js          Realistic UAE Tesla owner data

src/
  App.jsx               Root with 4-tab layout
  hooks/useTeslaData.js Data fetching with live/mock fallback
  components/
    Score/              Gauge, breakdown bars, tier badge
    Vehicle/            Details, battery status
    Charging/           Patterns, environmental impact, data sources
    Rate/               Rate comparison, tier table, savings projection
    Layout/             Header, banner, tabs, footer
    shared/             Card, AnimatedNumber, ProgressBar, Badge, KVRow
```

## License

Internal application — not for distribution.
