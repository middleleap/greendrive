import { useState, useEffect } from 'react';
import { API_BASE } from '../utils/constants.js';

export function useAuthStatus() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/auth-status`, { signal: AbortSignal.timeout(2000) })
      .then(r => r.json())
      .then(data => {
        setAuthenticated(data.authenticated);
        setChecking(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setChecking(false);
      });
  }, []);

  return { authenticated, checking };
}
