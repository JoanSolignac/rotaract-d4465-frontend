import { Modal, Button, Badge } from 'flowbite-react';
import { formatLocalDate } from '../utils/formatDate';
import Swal from 'sweetalert2';
import { post } from '../services/fetchClient';
import PropTypes from 'prop-types';

export default function ProyectoDisponibleModal({ isOpen, onClose, proyecto, onPostulacionSuccess }) {
    if (!proyecto) return null;

    const inscritos = proyecto.inscritos ?? 0;
    const cupoMaximo = proyecto.cupoMaximo ?? 0;
    const cuposCompletos = inscritos >= cupoMaximo;

    const handlePostular = async () => {
        const result = await Swal.fire({
            title: '¿Deseas postularte a este proyecto?',
            text: `Estás a punto de inscribirte en "${proyecto.titulo}".`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#E20F7A',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, postularme',
            cancelButtonText: 'Cancelar',
            background: '#171717',
            color: '#ffffff'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Procesando...',
                    text: 'Enviando tu postulación',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    background: '#171717',
                    color: '#ffffff'
                });

                await post(`/api/v1/proyectos/${proyecto.id}/inscribirse`, {});

                await Swal.fire({
                    icon: 'success',
                    title: '¡Postulación Exitosa!',
                    text: 'Te has inscrito correctamente al proyecto.',
                    confirmButtonColor: '#E20F7A',
                    background: '#171717',
                    color: '#ffffff'
                });

                onPostulacionSuccess();
                onClose();

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'No se pudo completar la inscripción.',
                    confirmButtonColor: '#E20F7A',
                    background: '#171717',
                    color: '#ffffff'
                });
            }
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="4xl" className="dark">
            <Modal.Header className="bg-neutral-900 border-b border-neutral-800">
                <span className="text-white font-bold text-xl md:text-2xl">{proyecto.titulo}</span>
            </Modal.Header>
            <Modal.Body className="bg-neutral-900 text-gray-300">
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge color="info" size="sm">{proyecto.clubNombre}</Badge>
                        <Badge color={cuposCompletos ? 'failure' : 'success'} size="sm">
                            {cuposCompletos ? 'Cupos Llenos' : 'Cupos Disponibles'}
                        </Badge>
                        <Badge color="gray" size="sm">{proyecto.estadoProyecto}</Badge>
                    </div>

                    {/* Description & Objective */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Descripción</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{proyecto.descripcion}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Objetivo</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{proyecto.objetivo}</p>
                        </div>
                    </div>

                    {/* Requirements & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Requisitos</h4>
                            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{proyecto.requisitos}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Lugar</h4>
                            <div className="flex items-center text-gray-400">
                                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{proyecto.lugar}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                        <h4 className="text-lg font-semibold text-white mb-4">Cronograma</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-gray-500 mb-1">Inicio del Proyecto</span>
                                <span className="font-medium text-white">{formatLocalDate(proyecto.fechaInicioProyecto)}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">Fin del Proyecto</span>
                                <span className="font-medium text-white">{formatLocalDate(proyecto.fechaFinProyecto)}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">Cierre de Inscripciones</span>
                                <span className="font-medium text-white">{formatLocalDate(proyecto.fechaFinPostulacion)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Capacity Progress */}
                    <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-400">Ocupación</span>
                            <span className={`text-sm font-bold ${cuposCompletos ? 'text-red-400' : 'text-white'}`}>
                                {inscritos} / {cupoMaximo} inscritos
                            </span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${cuposCompletos ? 'bg-red-500' : 'bg-primary-600'}`}
                                style={{ width: `${cupoMaximo > 0 ? Math.min((inscritos / cupoMaximo) * 100, 100) : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-neutral-900 border-t border-neutral-800 flex justify-end gap-3">
                <Button color="gray" onClick={onClose} className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700">
                    Cerrar
                </Button>
                <Button
                    onClick={handlePostular}
                    disabled={cuposCompletos}
                    className={`text-white ${cuposCompletos ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                    {cuposCompletos ? 'Cupos Llenos' : 'Postularme'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

ProyectoDisponibleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    proyecto: PropTypes.object,
    onPostulacionSuccess: PropTypes.func.isRequired
};
