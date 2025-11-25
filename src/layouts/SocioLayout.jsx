import { Outlet } from 'react-router-dom';
import SocioNavbar from '../components/SocioNavbar';

export default function SocioLayout() {
    return (
        <div className="min-h-screen bg-[#050506] text-white">
            <SocioNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
