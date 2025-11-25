import { useState, useEffect } from 'react';
import { get } from '../services/fetchClient';

/**
 * Custom hook to fetch inscripciones for a specific convocatoria
 * @param {number} convocatoriaId - ID of the convocatoria
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @returns {object} { data, loading, error, refetch }
 */
export default function useFetchInscripciones(convocatoriaId, page = 0, size = 10) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInscripciones = async () => {
        if (!convocatoriaId) {
            setData(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await get(`/api/v1/convocatorias/${convocatoriaId}/inscripciones?page=${page}&size=${size}`);
            setData(response);
        } catch (err) {
            console.error('Error fetching inscripciones:', err);
            setError(err.message || 'Error al cargar las inscripciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInscripciones();
    }, [convocatoriaId, page, size]);

    return { data, loading, error, refetch: fetchInscripciones };
}
