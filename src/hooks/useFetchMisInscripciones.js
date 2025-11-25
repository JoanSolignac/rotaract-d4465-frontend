import { useState, useEffect } from 'react';
import { get } from '../services/fetchClient';

/**
 * Custom hook to fetch user's inscriptions
 * @returns {object} { data, loading, error, refetch }
 */
export default function useFetchMisInscripciones() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInscripciones = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await get('/api/v1/inscripciones/mis');
            // API returns a Page object, so we access content
            setData(response.content && Array.isArray(response.content) ? response.content : []);
        } catch (err) {
            console.error('Error fetching inscriptions:', err);
            setError(err.message || 'Error al cargar tus inscripciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInscripciones();
    }, []);

    return { data, loading, error, refetch: fetchInscripciones };
}
