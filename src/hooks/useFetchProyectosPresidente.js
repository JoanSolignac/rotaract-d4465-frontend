import { useState, useEffect } from 'react';
import { get } from '../services/fetchClient';

/**
 * Custom hook to fetch projects for the President's club
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @param {string} search - Search query
 * @returns {object} { data, loading, error, refetch }
 */
export default function useFetchProyectosPresidente(page = 0, size = 10, search = '') {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProyectos = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = `/api/v1/proyectos?page=${page}&size=${size}`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await get(url);
            setData(response);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message || 'Error al cargar los proyectos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProyectos();
    }, [page, size, search]);

    return { data, loading, error, refetch: fetchProyectos };
}
