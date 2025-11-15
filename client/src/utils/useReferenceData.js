import { useState, useEffect } from 'react';
import referenceDataService from './referenceDataService';

export function useReferenceData(type) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await referenceDataService.fetchReferenceData(type);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          console.error(`Error fetching ${type}:`, err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [type]);

  return { data, loading, error };
}

export function useBulkReferenceData(types) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await referenceDataService.fetchBulkData(types);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          console.error('Error fetching bulk data:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (types && types.length > 0) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [types.join(',')]);

  return { data, loading, error };
}
