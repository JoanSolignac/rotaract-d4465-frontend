import { Badge, Button } from 'flowbite-react';
import { HiCalendar, HiClock, HiUsers } from 'react-icons/hi';
import { formatLocalDate } from '../utils/formatDate';
import { useNavigate } from 'react-router-dom';

export default function ProyectoCard({ proyecto, onVerDetalles, onPostular }) {
    const navigate = useNavigate();
    const isAuthenticated = Boolean(localStorage.getItem("accessToken"));
    const cuposCompletos = proyecto.inscritos >= proyecto.cupoMaximo;
    const disponible = proyecto.disponible;

    const getEstadoBadgeColor = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'EN_PROGRESO':
            case 'ENPROGRESO':
                return 'info';
            case 'COMPLETADO':
                return 'success';
            case 'CANCELADO':
                return 'failure';
            case 'PLANIFICADO':
            case 'EN_POSTULACION':
                return 'warning';
            default:
                return 'gray';
        }
    };

    const handlePostular = () => {
        if (onPostular) {
            onPostular(proyecto);
            return;
        }

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // Logic for authenticated user
        console.log("Postular click - Authenticated");
    };

    const porcentajeCupos = Math.min((proyecto.inscritos / proyecto.cupoMaximo) * 100, 100);

    return (
        <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800 hover:border-primary-600/50 transition-all duration-300 h-full flex flex-col group">
            <div className="flex flex-col h-full">
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-primary-400 transition-colors" title={proyecto.titulo}>
                    {proyecto.titulo}
                </h3>

                {/* Club */}
                <div className="flex items-center text-gray-400 mb-3">
                    <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-sm font-medium truncate">{proyecto.clubNombre}</span>
                </div>

                {/* Lugar */}
                <div className="flex items-center text-gray-400 mb-3">
                    <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm truncate">{proyecto.lugar}</span>
                </div>

                {/* Estado */}
                <div className="mb-4">
                    <Badge color={getEstadoBadgeColor(proyecto.estadoProyecto)} className="inline-block rounded-md">
                        {proyecto.estadoProyecto}
                    </Badge>
                </div>

                {/* Fechas */}
                <div className="mb-4 text-sm text-gray-400 space-y-2">
                    {/* Postulación */}
                    <div>
                        <div className="flex items-center mb-1">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="font-medium">Postulación:</span>
                        </div>
                        <p className="ml-6 text-xs">
                            {formatLocalDate(proyecto.fechaInicioPostulacion)} - {formatLocalDate(proyecto.fechaFinPostulacion)}
                        </p>
                    </div>

                    {/* Ejecución */}
                    <div>
                        <div className="flex items-center mb-1">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">Ejecución:</span>
                        </div>
                        <p className="ml-6 text-xs">
                            {formatLocalDate(proyecto.fechaInicioProyecto)} - {formatLocalDate(proyecto.fechaFinProyecto)}
                        </p>
                    </div>
                </div>

                {/* Cupos */}
                <div className="mb-6 bg-neutral-800/50 rounded-xl p-3 border border-neutral-700/50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-400">Cupos</span>
                        <span className="text-sm font-bold text-white">
                            {proyecto.inscritos}/{proyecto.cupoMaximo}
                        </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all shadow-[0_0_10px_rgba(226,15,122,0.5)]"
                            style={{
                                width: `${porcentajeCupos}%`
                            }}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-auto">
                    <Button
                        color="light"
                        size="sm"
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 transition-colors"
                        onClick={() => onVerDetalles(proyecto)}
                    >
                        Ver Proyecto
                    </Button>

                    <Button
                        size="sm"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white border-none focus:ring-primary-500 transition-colors shadow-lg shadow-primary-600/20"
                        disabled={cuposCompletos || !disponible}
                        onClick={handlePostular}
                    >
                        {cuposCompletos ? "Cupos completos" : !disponible ? "No disponible" : "Postular"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
