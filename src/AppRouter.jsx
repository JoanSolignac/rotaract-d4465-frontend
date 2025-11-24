import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ClubsPage from './pages/ClubsPage';
import ClubPage from './pages/ClubPage';
import ConvocatoriasPage from './pages/ConvocatoriasPage';
import ProyectosPage from './pages/ProyectosPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InteresadoDashboard from './pages/InteresadoDashboard';
import InteresadoClubsPage from './pages/InteresadoClubsPage';
import InteresadoClubPage from './pages/InteresadoClubPage';
import InteresadoConvocatoriasPage from './pages/InteresadoConvocatoriasPage';
import MisInscripcionesPage from './pages/MisInscripcionesPage';

/**
 * AppRouter Component
 * Main application router configuration
 */
export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/clubes" element={<ClubsPage />} />
                <Route path="/club/:id" element={<ClubPage />} />
                <Route path="/convocatorias" element={<ConvocatoriasPage />} />
                <Route path="/proyectos" element={<ProyectosPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Interesado Routes */}
                <Route path="/interesado" element={<InteresadoDashboard />} />
                <Route path="/interesado/clubs" element={<InteresadoClubsPage />} />
                <Route path="/interesado/club/:id" element={<InteresadoClubPage />} />
                <Route path="/interesado/convocatorias" element={<InteresadoConvocatoriasPage />} />
                <Route path="/interesado/inscripciones" element={<MisInscripcionesPage />} />
            </Routes>
        </BrowserRouter>
    );
}
