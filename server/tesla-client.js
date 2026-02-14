const REGION_URLS = {
  na: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
  eu: 'https://fleet-api.prd.eu.vn.cloud.tesla.com',
  cn: 'https://fleet-api.prd.cn.vn.cloud.tesla.cn',
};

const TOKEN_URL = 'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token';

let tokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

export function getTokens() {
  return tokens;
}

export function setTokens({ access_token, refresh_token, expires_in }) {
  tokens.accessToken = access_token;
  tokens.refreshToken = refresh_token;
  tokens.expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();
}

export function clearTokens() {
  tokens = { accessToken: null, refreshToken: null, expiresAt: null };
}

export function isAuthenticated() {
  return !!(tokens.accessToken && new Date(tokens.expiresAt) > new Date());
}

function getBaseUrl() {
  const region = process.env.TESLA_REGION || 'eu';
  return REGION_URLS[region] || REGION_URLS.eu;
}

async function refreshAccessToken() {
  if (!tokens.refreshToken) throw new Error('No refresh token available');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.TESLA_CLIENT_ID,
      client_secret: process.env.TESLA_CLIENT_SECRET,
      refresh_token: tokens.refreshToken,
    }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  setTokens(data);
  console.log('[Tesla] Token refreshed successfully');
}

async function wakeVehicle(vin) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/1/vehicles/${vin}/wake_up`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });
  return res.json();
}

async function waitForWake(vin, maxWaitMs = 30000) {
  const pollInterval = 5000;
  const start = Date.now();

  console.log(`[Tesla] Waking vehicle ${vin}...`);
  await wakeVehicle(vin);

  while (Date.now() - start < maxWaitMs) {
    await new Promise(r => setTimeout(r, pollInterval));
    try {
      const res = await fetch(`${getBaseUrl()}/api/1/vehicles/${vin}`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      const data = await res.json();
      if (data.response?.state === 'online') {
        console.log(`[Tesla] Vehicle ${vin} is awake`);
        return true;
      }
    } catch { /* keep polling */ }
  }

  console.log(`[Tesla] Vehicle ${vin} did not wake within ${maxWaitMs / 1000}s`);
  return false;
}

export async function teslaGet(path, { retryOnSleep = true } = {}) {
  // Auto-refresh if token is about to expire (within 60s)
  if (tokens.expiresAt && new Date(tokens.expiresAt) - Date.now() < 60000) {
    await refreshAccessToken();
  }

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });

  if (res.status === 401) {
    await refreshAccessToken();
    const retry = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    return retry.json();
  }

  if (res.status === 408 && retryOnSleep) {
    const vin = path.match(/vehicles\/([^/]+)/)?.[1];
    if (vin) {
      const awake = await waitForWake(vin);
      if (awake) {
        const retry = await fetch(`${baseUrl}${path}`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        return retry.json();
      }
    }
    throw new Error('Vehicle is asleep and could not be woken');
  }

  if (res.status === 429) {
    throw new Error('Tesla API rate limited');
  }

  if (!res.ok) {
    const body = await res.text();
    console.error(`[Tesla] API error ${res.status}: ${body}`);
    throw new Error(`Tesla API error: ${res.status}`);
  }

  return res.json();
}
