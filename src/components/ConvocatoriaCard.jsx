import { Card, Button, Badge } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
            confirmButtonColor: '#B40032',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, inscribirme',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed && onPostular) {
            onPostular(convocatoria);
        }
    };

    return (
        <Card className="shadow-md rounded-xl hover:shadow-xl transition-shadow h-full flex flex-col">
            <div className="flex flex-col h-full">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2 min-h-[3rem]">
                    {convocatoria.titulo}
                </h3>

                {/* Club */}
                <div className="flex items-center text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-sm font-medium truncate w-full" title={convocatoria.clubNombre}>
                        {convocatoria.clubNombre}
                    </span>
                </div>

                {/* Estado */}
                <div className="mb-3">
                    <Badge color={getEstadoBadgeColor(convocatoria.estado)} className="inline-block">
                        {convocatoria.estado}
                    </Badge>
                </div>

                {/* Fechas de Postulación */}
                <div className="mb-4 text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Postulación:</span>
                    </div>
                    <p className="ml-6 text-xs">
                        {new Date(convocatoria.fechaInicioPostulacion).toLocaleDateString('es-PE')} - {new Date(convocatoria.fechaFinPostulacion).toLocaleDateString('es-PE')}
                    </p>
                </div>

                {/* Cupos */}
                <div className="mb-4 bg-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Cupos</span>
                        <span className="text-sm font-bold text-gray-900">
                            {inscritos}/{cupoMaximo}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{
                                width: `${cupoMaximo > 0 ? Math.min((inscritos / cupoMaximo) * 100, 100) : 0}%`
                            }}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                    <Button
                        color="light"
                        size="sm"
                        className="w-full"
                        onClick={() => onVerDetalles(convocatoria)}
                    >
                        Ver Convocatoria
                    </Button>

                    <Button
                        color="failure"
                        size="sm"
                        className="w-full bg-[#B40032] hover:bg-[#8a0026] border-none focus:ring-[#B40032] text-white"
                        disabled={cuposCompletos}
                        onClick={handlePostular}
                    >
                        {cuposCompletos ? "Cupos completos" : "Postular"}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
