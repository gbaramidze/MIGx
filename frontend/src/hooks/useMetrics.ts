import { useState, useEffect, useCallback } from 'react';
import { Metrics } from '../types';
import { metricsAPI } from '../services/api';

interface UseMetricsReturn {
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
  refreshMetrics: () => Promise<void>;
}

export const useMetrics = (): UseMetricsReturn => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await metricsAPI.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error loading metrics:', err);
      setError('Failed to load metrics');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  return {
    metrics,
    loading,
    error,
    refreshMetrics: loadMetrics,
  };
};