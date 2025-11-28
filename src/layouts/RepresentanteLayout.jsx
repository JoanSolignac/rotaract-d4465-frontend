import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavbarRepresentante from '../components/NavbarRepresentante';

/**
 * Layout wrapper for District Representative module pages
 * Handles authentication and role-based access control
 * WebSocket notifications are handled globally by WebSocketProvider
 */
export default function RepresentanteLayout() {
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

        // Redirect to login if not REPRESENTANTE DISTRITAL role
        if (role !== 'REPRESENTANTE DISTRITAL') {
            navigate('/login', { replace: true });
            return;
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col bg-[#050506]">
            <NavbarRepresentante />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
}
