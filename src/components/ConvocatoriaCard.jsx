import { Badge, Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatLocalDate } from '../utils/formatDate';

export default function ConvocatoriaCard({ convocatoria, onVerDetalles, onPostular }) {
    const navigate = useNavigate();
    const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

    // Safe handling for potentially missing data
    const inscritos = convocatoria?.inscritos ?? 0;
    const cupoMaximo = convocatoria?.cupoMaximo ?? 0;
    const cuposCompletos = inscritos >= cupoMaximo;

    const getEstadoBadgeColor = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'ABIERTA':
                return 'success';
            case 'CERRADA':
                return 'failure';
            case 'EN_REVISION':
                return 'warning';
            default:
                return 'gray';
        }
    };

    const handlePostular = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Show confirmation dialog
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas inscribirte a la convocatoria "${convocatoria.titulo}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#E20F7A',
            cancelButtonColor: '#374151',
            confirmButtonText: 'Sí, inscribirme',
            cancelButtonText: 'Cancelar',
            background: '#171717',
            color: '#ffffff'
        });

        if (result.isConfirmed && onPostular) {
            onPostular(convocatoria);
        }
    };

    return (
        <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800 hover:border-primary-600/50 transition-all duration-300 h-full flex flex-col group">
            <div className="flex flex-col h-full">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-primary-400 transition-colors">
                    {convocatoria.titulo}
                </h3>

                {/* Club */}
                <div className="flex items-center text-gray-400 mb-4">
                    <svg className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-sm font-medium truncate w-full" title={convocatoria.clubNombre}>
                        {convocatoria.clubNombre}
                    </span>
                </div>

                {/* Estado */}
                <div className="mb-4">
                    <Badge color={getEstadoBadgeColor(convocatoria.estado)} className="inline-block rounded-md">
                        {convocatoria.estado}
                    </Badge>
                </div>

                {/* Fechas de Postulación */}
                <div className="mb-5 text-sm text-gray-400">
                    <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Postulación:</span>
                    </div>
                    <p className="ml-6 text-xs text-gray-500">
                        {formatLocalDate(convocatoria.fechaInicioPostulacion)} - {formatLocalDate(convocatoria.fechaFinPostulacion)}
                    </p>
                </div>

                {/* Cupos */}
                <div className="mb-6 bg-neutral-800/50 rounded-xl p-3 border border-neutral-700/50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-400">Cupos</span>
                        <span className="text-sm font-bold text-white">
                            {inscritos}/{cupoMaximo}
                        </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all shadow-[0_0_10px_rgba(226,15,122,0.5)]"
                            style={{
                                width: `${cupoMaximo > 0 ? Math.min((inscritos / cupoMaximo) * 100, 100) : 0}%`
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
                        onClick={() => onVerDetalles(convocatoria)}
                    >
                        Ver Convocatoria
                    </Button>

                    <Button
                        size="sm"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white border-none focus:ring-primary-500 transition-colors shadow-lg shadow-primary-600/20"
                        disabled={cuposCompletos}
                        onClick={handlePostular}
                    >
                        {cuposCompletos ? "Cupos completos" : "Postular"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
