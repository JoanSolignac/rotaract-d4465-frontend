import { useState, useEffect } from 'react';
import { get } from '../services/fetchClient';

/**
 * Custom hook to fetch convocatorias for the President's club
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @returns {object} { data, loading, error, refetch }
 */
export default function useFetchConvocatoriasPresidente(page = 0, size = 12) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchConvocatorias = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await get(`/api/v1/convocatorias?page=${page}&size=${size}`);
            setData(response);
        } catch (err) {
            console.error('Error fetching convocatorias:', err);
            setError(err.message || 'Error al cargar las convocatorias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConvocatorias();
    }, [page, size]);

    return { data, loading, error, refetch: fetchConvocatorias };
}
