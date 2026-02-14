import crypto from 'crypto';
import { setTokens } from '../tesla-client.js';

const AUTH_URL = 'https://auth.tesla.com/oauth2/v3/authorize';
const TOKEN_URL = 'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token';

let pendingState = null;

export function getAuthUrl() {
  const state = crypto.randomBytes(16).toString('hex');
  pendingState = state;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TESLA_CLIENT_ID,
    redirect_uri: process.env.TESLA_REDIRECT_URI,
    scope: 'openid offline_access vehicle_device_data vehicle_charging_cmds',
    state,
  });

  return `${AUTH_URL}?${params.toString()}`;
}

export async function handleCallback(code, state) {
  if (state !== pendingState) {
    throw new Error('Invalid state parameter — possible CSRF');
  }
  pendingState = null;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.TESLA_CLIENT_ID,
      client_secret: process.env.TESLA_CLIENT_SECRET,
      code,
      redirect_uri: process.env.TESLA_REDIRECT_URI,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  setTokens(data);

  return data;
}
