import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getAuthUrl, handleCallback } from './auth/tesla-oauth.js';
import { isAuthenticated, getTokens } from './tesla-client.js';
import * as cache from './cache.js';
import vehiclesRouter from './api/vehicles.js';
import vehicleDataRouter from './api/vehicle-data.js';
import chargingRouter from './api/charging.js';
import greenScoreRouter from './api/green-score.js';
import dashboardRouter from './api/dashboard.js';
import scoreHistoryRouter from './api/score-history.js';
import { seedIfEmpty } from './db.js';
import { MOCK_VEHICLE_DATA } from './mock-data.js';
import { computeGreenScore } from './scoring/engine.js';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Bank GreenDrive API',
    authenticated: isAuthenticated(),
    mode: isAuthenticated() ? 'live' : 'mock',
    endpoints: [
      '/auth',
      '/api/auth-status',
      '/api/vehicles',
      '/api/vehicle-data/:vin',
      '/api/charging-history/:vin',
      '/api/green-score/:vin',
      '/api/dashboard/:vin',
      '/api/score-history/:vin',
    ],
  });
});

// OAuth flow
app.get('/auth', (req, res) => {
  if (!process.env.TESLA_CLIENT_ID) {
    return res
      .status(400)
      .json({ error: 'Tesla credentials not configured. Running in mock mode.' });
  }
  res.redirect(getAuthUrl());
});

app.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send('Missing authorization code');
    await handleCallback(code, state);
    res.send(`
      <html><body style="font-family: 'Helvetica Neue', sans-serif; text-align: center; padding: 60px;">
        <h1 style="color: #0A6847;">Connected to Tesla</h1>
        <p>You can now close this window and return to the <a href="${FRONTEND_URL}" style="color: #BE000E;">GreenDrive Dashboard</a>.</p>
      </body></html>
    `);
  } catch (err) {
    console.error('[Callback]', err.message);
    res.status(500).send('Authentication failed. Please try again or contact support.');
  }
});

// Auth status
app.get('/api/auth-status', (req, res) => {
  const tokens = getTokens();
  res.json({
    authenticated: isAuthenticated(),
    expiresAt: tokens.expiresAt,
    region: process.env.TESLA_REGION || 'eu',
  });
});

// API routes
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/vehicle-data', vehicleDataRouter);
app.use('/api/charging-history', chargingRouter);
app.use('/api/green-score', greenScoreRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/score-history', scoreHistoryRouter);

// Partner registration (required once per region — admin only)
app.post('/api/register-partner', async (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey || req.headers['x-admin-key'] !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const region = process.env.TESLA_REGION || 'eu';
  const regionUrls = {
    na: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
    eu: 'https://fleet-api.prd.eu.vn.cloud.tesla.com',
  };
  const baseUrl = regionUrls[region] || regionUrls.eu;

  try {
    // Step 1: Get partner token via client_credentials
    const tokenRes = await fetch('https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.TESLA_CLIENT_ID,
        client_secret: process.env.TESLA_CLIENT_SECRET,
        scope: 'openid vehicle_device_data vehicle_charging_cmds',
        audience: baseUrl,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('[Partner Token]', JSON.stringify(tokenData));
      return res.status(502).json({ error: 'Failed to get partner token' });
    }
    console.log('[Partner Token] Obtained successfully');

    // Step 2: Register partner account
    const result = await fetch(`${baseUrl}/api/1/partner_accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({ domain: req.body.domain }),
    });
    const data = await result.json();
    console.log('[Partner Registration]', JSON.stringify(data));
    res.json(data);
  } catch (err) {
    console.error('[Partner Registration]', err.message);
    res.status(500).json({ error: 'Partner registration failed' });
  }
});

// Cache management (development only)
app.post('/api/cache/clear', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }
  cache.clear();
  res.json({ cleared: true });
});

app.listen(PORT, () => {
  const hasCreds = !!(process.env.TESLA_CLIENT_ID && process.env.TESLA_CLIENT_SECRET);
  console.log(`\n  Bank GreenDrive API`);
  console.log(`  http://localhost:${PORT}`);
  console.log(
    `  Mode: ${hasCreds ? 'Tesla API ready (visit /auth to connect)' : 'Mock data (no Tesla credentials)'}\n`,
  );

  // Seed score history for mock VIN so charts work immediately
  try {
    const mockScore = computeGreenScore(MOCK_VEHICLE_DATA);
    const seeded = seedIfEmpty(MOCK_VEHICLE_DATA.vin, mockScore);
    if (seeded) console.log('  Score history seeded for demo VIN');
  } catch (err) {
    console.error('[DB Seed]', err.message);
  }
});
