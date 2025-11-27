import { Outlet } from 'react-router-dom';
import SocioNavbar from '../components/SocioNavbar';
import useWebSocketNotifications from '../hooks/useWebSocketNotifications';
import useSessionValidation from '../hooks/useSessionValidation';

/**
 * Layout wrapper for Socio module pages
 * Integrates WebSocket notifications and session validation
 */
export default function SocioLayout() {
    // Initialize WebSocket notifications and session validation
    const userId = localStorage.getItem('userId');
    useWebSocketNotifications(userId);
    useSessionValidation(30000); // Check every 30 seconds

    return (
        <div className="min-h-screen bg-[#050506] text-white">
            <SocioNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
