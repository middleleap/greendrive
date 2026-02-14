import { useState, useEffect, useCallback } from 'react';
import { API_BASE, MOCK_DASHBOARD } from '../utils/constants.js';

export function useTeslaData(forceMock = false) {
  const [data, setData] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const isInitial = !data;
    if (isInitial) setLoading(true);
    setRefreshing(true);

    const mockParam = forceMock ? '?forceMock=true' : '';

    try {
      const statusRes = await fetch(`${API_BASE}/api/auth-status`, {
        signal: AbortSignal.timeout(2000),
      });
      const status = await statusRes.json();

      if (status.authenticated && !forceMock) {
        const vehiclesRes = await fetch(`${API_BASE}/api/vehicles`);
        const vehicles = await vehiclesRes.json();

        if (vehicles.length > 0) {
          const dashRes = await fetch(`${API_BASE}/api/dashboard/${vehicles[0].vin}`);
          const dashboard = await dashRes.json();
          setData(dashboard);
          setIsLive(dashboard.metadata?.dataSource === 'live');
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }

      // Server running but not authenticated (or forceMock) — fetch mock from server
      const vehiclesRes = await fetch(`${API_BASE}/api/vehicles${mockParam}`);
      const vehicles = await vehiclesRes.json();
      if (vehicles.length > 0) {
        const dashRes = await fetch(`${API_BASE}/api/dashboard/${vehicles[0].vin}${mockParam}`);
        const dashboard = await dashRes.json();
        setData(dashboard);
        setIsLive(false);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      throw new Error('No vehicles');
    } catch {
      // Server not reachable — use frontend mock data (only on initial load)
      if (!data) setData(MOCK_DASHBOARD);
      setIsLive(false);
      setLoading(false);
      setRefreshing(false);
    }
  }, [data, forceMock]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceMock]);

  return { data, isLive, loading, refreshing, refresh: fetchData };
}
