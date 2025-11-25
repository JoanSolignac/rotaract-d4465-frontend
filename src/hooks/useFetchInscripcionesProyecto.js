import { useState, useEffect } from 'react';
import { get } from '../services/fetchClient';

/**
 * Custom hook to fetch inscripciones for a specific project
 * @param {number} proyectoId - Project ID
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @returns {object} { data, loading, error, refetch }
 */
export default function useFetchInscripcionesProyecto(proyectoId, page = 0, size = 10) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInscripciones = async () => {
        if (!proyectoId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await get(`/api/v1/proyectos/${proyectoId}/inscripciones?page=${page}&size=${size}`);
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
    }, [proyectoId, page, size]);

    return { data, loading, error, refetch: fetchInscripciones };
}
