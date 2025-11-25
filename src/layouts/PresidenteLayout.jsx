import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavbarPresidente from '../components/NavbarPresidente';

/**
 * Layout wrapper for President module pages
 * Handles authentication and role-based access control
 */
export default function PresidenteLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('rol');

        // Redirect to login if no token
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        // Redirect to unauthorized if not PRESIDENTE role
        if (role !== 'PRESIDENTE') {
            navigate('/login', { replace: true });
            return;
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col bg-[#050506]">
            <NavbarPresidente />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
}
