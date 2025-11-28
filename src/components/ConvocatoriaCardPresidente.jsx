import { Badge, Button } from 'flowbite-react';
import { formatLocalDate } from '../utils/formatDate';
import PropTypes from 'prop-types';

/**
 * ConvocatoriaCardPresidente Component
 * Card component adapted for President role
 * Shows Edit and Ver Inscripciones buttons instead of Postular
 */
export default function ConvocatoriaCardPresidente({ convocatoria, onVerInscripciones, onEditar }) {
    const inscritos = convocatoria?.inscritos ?? 0;
    const cupoMaximo = convocatoria?.cupoMaximo ?? 0;
    const cuposCompletos = inscritos >= cupoMaximo;

    const getEstadoBadgeColor = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'ABIERTA':
            case 'ACTIVO':
                return 'success';
            case 'CERRADA':
            case 'CERRADO':
                return 'failure';
            case 'EN_REVISION':
                return 'warning';
            default:
                return 'gray';
        }
    };

    return (
        <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800 hover:border-primary-600/50 transition-all duration-300 h-full flex flex-col group">
            <div className="flex flex-col h-full">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-tight group-hover:text-primary-400 transition-colors">
                    {convocatoria.titulo}
                </h3>

                {/* Estado */}
                <div className="mb-4">
                    <Badge color={getEstadoBadgeColor(convocatoria.estado)} className="inline-block rounded-md">
                        {convocatoria.estado}
                    </Badge>
                </div>

                {/* Fechas de Postulación */}
                <div className="mb-4 text-sm">
                    <div className="flex items-center mb-1 text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Postulación:</span>
                    </div>
                    <p className="ml-6 text-xs text-gray-500">
                        {formatLocalDate(convocatoria.fechaInicioPostulacion)} - {formatLocalDate(convocatoria.fechaFinPostulacion)}
                    </p>
                </div>

                {/* Publicación y Cierre */}
                <div className="mb-5 space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                        <span>Publicación:</span>
                        <span className="font-medium text-gray-400">{formatLocalDate(convocatoria.fechaPublicacion)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cierre:</span>
                        <span className="font-medium text-gray-400">{formatLocalDate(convocatoria.fechaCierre)}</span>
                    </div>
                </div>

                {/* Cupos */}
                <div className="mb-6 bg-neutral-800/50 rounded-xl p-3 border border-neutral-700/50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-400">Inscritos</span>
                        <span className={`text-sm font-bold ${cuposCompletos ? 'text-red-400' : 'text-white'}`}>
                            {inscritos}/{cupoMaximo}
                        </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${cuposCompletos ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary-600 shadow-[0_0_10px_rgba(226,15,122,0.5)]'}`}
                            style={{
                                width: `${cupoMaximo > 0 ? Math.min((inscritos / cupoMaximo) * 100, 100) : 0}%`
                            }}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-auto">
                    <Button
                        size="sm"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white border-none focus:ring-primary-500 transition-colors shadow-lg shadow-primary-600/20"
                        onClick={() => onVerInscripciones(convocatoria)}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Ver Inscripciones ({inscritos})
                    </Button>

                    <Button
                        color="light"
                        size="sm"
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 transition-colors"
                        onClick={() => onEditar(convocatoria)}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar Convocatoria
                    </Button>
                </div>
            </div>
        </div>
    );
}

ConvocatoriaCardPresidente.propTypes = {
    convocatoria: PropTypes.object.isRequired,
    onVerInscripciones: PropTypes.func.isRequired,
    onEditar: PropTypes.func.isRequired,
};
