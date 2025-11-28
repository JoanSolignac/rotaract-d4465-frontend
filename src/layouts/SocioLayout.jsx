import { Outlet } from 'react-router-dom';
import SocioNavbar from '../components/SocioNavbar';
import useSessionValidation from '../hooks/useSessionValidation';

/**
 * Layout wrapper for Socio module pages
 * WebSocket notifications are handled globally by WebSocketProvider
 */
export default function SocioLayout() {
    // Session validation
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
