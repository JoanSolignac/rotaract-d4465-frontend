import { useState, useEffect } from 'react';

/**
 * Custom hook to get authenticated user data from localStorage
 * Returns user object with id, clubId, rol, correo
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadUser = () => {
            const token = localStorage.getItem('accessToken');
            const userId = localStorage.getItem('userId');
            const clubId = localStorage.getItem('clubId');
            const rol = localStorage.getItem('rol');
            const correo = localStorage.getItem('correo');
            const nombre = localStorage.getItem('nombre');

            if (token && userId) {
                const userObj = {
                    id: userId,
                    clubId: clubId || null,
                    rol: rol || null,
                    correo: correo || null,
                    nombre: nombre || null
                };
                setUser(userObj);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        // Load user on mount
        loadUser();

        // Listen for storage changes (e.g., login/logout in another tab)
        window.addEventListener('storage', loadUser);

        // Listen for custom auth-change event (for login/logout in SAME tab)
        window.addEventListener('auth-change', loadUser);

        return () => {
            window.removeEventListener('storage', loadUser);
            window.removeEventListener('auth-change', loadUser);
        };
    }, []);

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
    };

    return {
        user,
        isAuthenticated,
        logout
    };
}
