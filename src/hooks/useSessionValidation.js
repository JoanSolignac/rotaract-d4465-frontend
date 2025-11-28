import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

/**
 * Custom hook to periodically check if the user's session is still valid
 * by making authenticated requests and detecting 401 errors
 * 
 * This serves as a backup to WebSocket notifications for detecting
 * when a user's role has changed and their token has been invalidated
 * 
 * @param {number} intervalMs - Polling interval in milliseconds (default: 5000 = 5 seconds)
 * 
 * TEMPORARILY DISABLED: The endpoint /api/v1/usuarios/{id} is returning 500 errors
 * This is causing interference with WebSocket connections
 * TODO: Re-enable once backend endpoint is fixed
 */
export default function useSessionValidation(intervalMs = 5000) {
    const intervalRef = useRef(null);
    const isCheckingRef = useRef(false);

    useEffect(() => {
        // console.log('⚠️ useSessionValidation is temporarily disabled due to backend endpoint issues');

        // TEMPORARILY DISABLED - Uncomment when /api/v1/usuarios/{id} endpoint is fixed
        /*
        const checkSession = async () => {
            // Prevent concurrent checks
            if (isCheckingRef.current) {
                return;
            }

            const token = localStorage.getItem('accessToken');
            const userId = localStorage.getItem('userId');

            // Don't check if not logged in
            if (!token || !userId) {
                return;
            }

            try {
                isCheckingRef.current = true;

                // Make a lightweight authenticated request to verify token validity
                // Using 'mis-inscripciones' as it exists for all roles and is lightweight
                const response = await fetch(
                    `https://rotaractd4465api.up.railway.app/api/v1/inscripciones/mis-inscripciones?page=0&size=1`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // If we get 401, the token has been invalidated (likely due to role change)
                if (response.status === 401) {
                    console.log('🔒 Sesión invalidada (401) - Forzando cierre de sesión');

                    // Show alert
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Sesión Expirada',
                        text: 'Tu sesión ha expirado o tus permisos han cambiado. Por favor, inicia sesión nuevamente.',
                        confirmButtonColor: '#E2007A',
                        background: '#171717',
                        color: '#ffffff',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    // Clear localStorage and redirect
                    localStorage.clear();
                    window.location.href = '/login';
                }

            } catch (error) {
                // Network errors or other issues - don't force logout
                console.error('Session validation error:', error);
            } finally {
                isCheckingRef.current = false;
            }
        };

        // Check immediately on mount
        checkSession();

        // Start polling
        intervalRef.current = setInterval(checkSession, intervalMs);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
        */
    }, [intervalMs]);

    return null;
}
