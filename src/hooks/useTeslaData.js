import { useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE, MOCK_DASHBOARD, MOCK_DASHBOARDS, MOCK_VEHICLES } from '../utils/constants.js';

export function useTeslaData(selectedVin = null) {
  const [data, setData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const loadedOnce = useRef(false);

  const fetchData = useCallback(async () => {
    if (!loadedOnce.current) setLoading(true);
    setRefreshing(true);

    try {
      const statusRes = await fetch(`${API_BASE}/api/auth-status`, {
        signal: AbortSignal.timeout(2000),
      });
      const status = await statusRes.json();

      if (status.authenticated) {
        // Live mode — fetch real data from Tesla API via backend
        const vehiclesRes = await fetch(`${API_BASE}/api/vehicles`);
        const vehiclesList = await vehiclesRes.json();
        setVehicles(vehiclesList);

        if (vehiclesList.length > 0) {
          const vin = selectedVin || vehiclesList[0].vin;
          const dashRes = await fetch(`${API_BASE}/api/dashboard/${vin}`);
          const dashboard = await dashRes.json();
          setData(dashboard);
          setIsLive(dashboard.metadata?.dataSource === 'live');
        }
      } else {
        // Server-mock mode — use client-side mock for multi-vehicle support
        setVehicles(MOCK_VEHICLES);
        const vin = selectedVin || MOCK_VEHICLES[0].vin;
        setData(MOCK_DASHBOARDS[vin] || MOCK_DASHBOARD);
        setIsLive(false);
      }
    } catch {
      // Frontend-mock mode — server unreachable
      setVehicles(MOCK_VEHICLES);
      const vin = selectedVin || MOCK_VEHICLES[0].vin;
      setData(MOCK_DASHBOARDS[vin] || MOCK_DASHBOARD);
      setIsLive(false);
    } finally {
      loadedOnce.current = true;
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedVin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, vehicles, isLive, loading, refreshing, refresh: fetchData };
}
