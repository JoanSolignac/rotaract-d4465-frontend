import { Modal, Badge, Button } from 'flowbite-react';
import PropTypes from 'prop-types';
import { formatLocalDate } from '../utils/formatDate';

/**
 * ProyectoDetailsModal Component
 * Modal to display full details of a project
 */
export default function ProyectoDetailsModal({ isOpen, onClose, proyecto }) {
    if (!proyecto) return null;

    const getEstadoBadgeColor = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'ACTIVO':
            case 'ABIERTO':
                return 'success';
            case 'FINALIZADO':
            case 'CERRADO':
                return 'failure';
            case 'EN_PROGRESO':
                return 'warning';
            default:
                return 'gray';
        }
    };

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            size="4xl"
            popup
            className="[&>div>div]:bg-neutral-900 [&>div>div]:border-neutral-800"
        >
            <Modal.Header className="bg-neutral-900 border-b border-neutral-800 !p-6">
                <span className="text-xl font-bold text-white">Detalles del Proyecto</span>
            </Modal.Header>
            <Modal.Body className="bg-neutral-900 p-6">
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{proyecto.titulo}</h3>
                            <div className="flex items-center gap-3">
                                <Badge color={getEstadoBadgeColor(proyecto.estadoProyecto)}>
                                    {proyecto.estadoProyecto}
                                </Badge>
                                <span className="text-gray-400 text-sm">
                                    Club: {proyecto.clubNombre}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Inscritos</div>
                            <div className="text-2xl font-bold text-white">
                                {proyecto.inscritos} / {proyecto.cupoMaximo}
                            </div>
                        </div>
                    </div>

                    {/* Description & Objective */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                            <h4 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Descripción</h4>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {proyecto.descripcion}
                            </p>
                        </div>
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                            <h4 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Objetivo</h4>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {proyecto.objetivo}
                            </p>
                        </div>
                    </div>

                    {/* Requirements & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Requisitos</h4>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {proyecto.requisitos || 'No especificados'}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Lugar</h4>
                            <p className="text-gray-300 text-sm flex items-center">
                                <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {proyecto.lugar}
                            </p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="border-t border-neutral-800 pt-6">
                        <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Cronograma</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Inicio Postulación</span>
                                <span className="text-sm text-white font-medium">{formatLocalDate(proyecto.fechaInicioPostulacion)}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Fin Postulación</span>
                                <span className="text-sm text-white font-medium">{formatLocalDate(proyecto.fechaFinPostulacion)}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Inicio Proyecto</span>
                                <span className="text-sm text-white font-medium">{formatLocalDate(proyecto.fechaInicioProyecto)}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Fin Proyecto</span>
                                <span className="text-sm text-white font-medium">{formatLocalDate(proyecto.fechaFinProyecto)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4">
                        <Button color="gray" onClick={onClose} className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

ProyectoDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    proyecto: PropTypes.object
};
