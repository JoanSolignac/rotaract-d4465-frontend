import { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

/**
 * Custom hook to periodically check if the user's session is still valid
 * by making authenticated requests and detecting 401 errors
 * 
 * This serves as a backup to WebSocket notifications for detecting
 * when a user's role has changed and their token has been invalidated
 * 
 * @param {number} intervalMs - Polling interval in milliseconds (default: 30000 = 30 seconds)
 */
export default function useSessionValidation(intervalMs = 30000) {
    const intervalRef = useRef(null);
    const isCheckingRef = useRef(false);

    useEffect(() => {
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
                // Using the user's own profile endpoint as a health check
                const response = await fetch(
                    `https://rotaractd4465api.up.railway.app/api/v1/usuarios/${userId}`,
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
                    console.log('Session invalidated - forcing logout');

                    // Show alert
                    await Swal.fire({
                        icon: 'info',
                        title: 'Sesión Actualizada',
                        html: 'Tu cuenta ha sido actualizada.<br><br><small class="text-gray-400">Se cerrará tu sesión para aplicar los cambios.</small>',
                        confirmButtonColor: '#8C1D40',
                        background: '#171717',
                        color: '#ffffff',
                        timer: 3000,
                        timerProgressBar: true,
                        allowOutsideClick: false
                    });

                    // Clear localStorage and redirect
                    localStorage.clear();
                    window.location.href = '/login';
                }

                // If we get 200, session is still valid - no action needed
                // Any other error is likely a network issue, so we don't force logout

            } catch (error) {
                // Network errors or other issues - don't force logout
                console.error('Session validation error:', error);
            } finally {
                isCheckingRef.current = false;
            }
        };

        // Start polling
        intervalRef.current = setInterval(checkSession, intervalMs);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [intervalMs]);

    return null;
}
