import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ClubsPage from './pages/ClubsPage';
import ClubPage from './pages/ClubPage';
import ConvocatoriasPage from './pages/ConvocatoriasPage';
import ProyectosPage from './pages/ProyectosPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

/**
 * AppRouter Component
 * Main application router configuration
 */
export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/clubes" element={<ClubsPage />} />
                <Route path="/club/:id" element={<ClubPage />} />
                <Route path="/convocatorias" element={<ConvocatoriasPage />} />
                <Route path="/proyectos" element={<ProyectosPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}
