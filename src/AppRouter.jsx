import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ClubsPage from './pages/ClubsPage';
import ClubPage from './pages/ClubPage';
import ConvocatoriasPage from './pages/ConvocatoriasPage';
import ProyectosPage from './pages/ProyectosPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import InteresadoDashboard from './pages/InteresadoDashboard';
import InteresadoClubsPage from './pages/InteresadoClubsPage';
import InteresadoClubPage from './pages/InteresadoClubPage';
import InteresadoConvocatoriasPage from './pages/InteresadoConvocatoriasPage';
import MisInscripcionesPage from './pages/MisInscripcionesPage';
import EditProfilePage from './pages/EditProfilePage';

// President Module Imports
// President Module Imports
import PresidenteLayout from './layouts/PresidenteLayout';
import PresidenteInicio from './pages/Presidente/Inicio';
import PresidenteConvocatorias from './pages/Presidente/Convocatorias';
import PresidenteProyectos from './pages/Presidente/Proyectos';
import ClubMembersPage from './pages/Presidente/ClubMembersPage';
import AsistenciaPage from './pages/Presidente/AsistenciaPage';
import CreateProjectPage from './pages/Presidente/CreateProjectPage';
import CreateConvocatoriaPage from './pages/Presidente/CreateConvocatoriaPage';
import EditClubPage from './pages/Presidente/EditClubPage';

// Socio Module Imports
import SocioLayout from './layouts/SocioLayout';
import SocioInicio from './pages/Socio/Inicio';
import SocioProyectos from './pages/Socio/Proyectos';
import SocioInscripciones from './pages/Socio/Inscripciones';
import HistorialAsistenciasPage from './pages/Socio/HistorialAsistenciasPage';

// Representante Module Imports
import RepresentanteLayout from './layouts/RepresentanteLayout';
import RepresentanteDashboard from './pages/Representante/Dashboard';
import RepresentanteClubsPage from './pages/Representante/ClubsPage';
import CreateClubPage from './pages/Representante/CreateClubPage';
import ClubDetailPage from './pages/Representante/ClubDetailPage';
import RDTransferPage from './pages/Representante/RDTransferPage';

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
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Shared Authenticated Routes */}
                <Route path="/perfil/editar" element={<EditProfilePage />} />

                {/* Interesado Routes */}
                <Route path="/interesado" element={<InteresadoDashboard />} />
                <Route path="/interesado/clubs" element={<InteresadoClubsPage />} />
                <Route path="/interesado/club/:id" element={<InteresadoClubPage />} />
                <Route path="/interesado/convocatorias" element={<InteresadoConvocatoriasPage />} />
                <Route path="/interesado/inscripciones" element={<MisInscripcionesPage />} />

                {/* Presidente Routes */}
                <Route path="/presidente" element={<PresidenteLayout />}>
                    <Route index element={<PresidenteInicio />} />
                    <Route path="convocatorias" element={<PresidenteConvocatorias />} />
                    <Route path="proyectos" element={<PresidenteProyectos />} />
                    <Route path="proyectos/:proyectoId/asistencia" element={<AsistenciaPage />} />
                    <Route path="miembros" element={<ClubMembersPage />} />
                    <Route path="mi-club/editar" element={<EditClubPage />} />
                    <Route path="proyectos/crear" element={<CreateProjectPage />} />
                    <Route path="convocatorias/crear" element={<CreateConvocatoriaPage />} />
                </Route>

                {/* Socio Routes */}
                <Route path="/socio" element={<SocioLayout />}>
                    <Route index element={<SocioInicio />} />
                    <Route path="proyectos" element={<SocioProyectos />} />
                    <Route path="inscripciones" element={<SocioInscripciones />} />
                    <Route path="historial-asistencias" element={<HistorialAsistenciasPage />} />
                </Route>

                {/* Representante Routes */}
                <Route path="/representante" element={<RepresentanteLayout />}>
                    <Route index element={<RepresentanteDashboard />} />
                    <Route path="clubes" element={<RepresentanteClubsPage />} />
                    <Route path="clubes/crear" element={<CreateClubPage />} />
                    <Route path="clubes/:id" element={<ClubDetailPage />} />
                    <Route path="transferir" element={<RDTransferPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

