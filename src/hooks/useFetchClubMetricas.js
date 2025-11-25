import { useState, useEffect } from 'react';
import { get } from '../services/fetchClient';

/**
 * Custom hook to fetch club metrics for the President dashboard
 * @returns {object} { data, loading, error }
 */
export default function useFetchClubMetricas() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetricas = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await get('/api/v1/clubs/metricas');
                setData(response);
            } catch (err) {
                console.error('Error fetching club metrics:', err);
                setError(err.message || 'Error al cargar las métricas del club');
            } finally {
                setLoading(false);
            }
        };

        fetchMetricas();
    }, []);

    return { data, loading, error };
}
