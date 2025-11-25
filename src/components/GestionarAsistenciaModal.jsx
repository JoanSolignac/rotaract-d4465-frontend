import { Modal, Button } from 'flowbite-react';
import PropTypes from 'prop-types';

/**
 * GestionarAsistenciaModal Component
 * Placeholder modal for attendance management
 */
export default function GestionarAsistenciaModal({ isOpen, onClose }) {
    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            size="md"
            popup
            className="[&>div>div]:bg-neutral-900 [&>div>div]:border-neutral-800"
        >
            <Modal.Header className="bg-neutral-900 border-b border-neutral-800 !p-6">
                <span className="text-xl font-bold text-white">Gestión de Asistencia</span>
            </Modal.Header>
            <Modal.Body className="bg-neutral-900 p-6 text-center">
                <div className="flex flex-col items-center justify-center py-4">
                    <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-300 text-lg font-medium">En construcción</p>
                    <p className="text-gray-500 mt-2">
                        La funcionalidad de gestión de asistencia estará disponible próximamente.
                    </p>
                </div>
                <div className="flex justify-center mt-6">
                    <Button color="gray" onClick={onClose} className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700">
                        Cerrar
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

GestionarAsistenciaModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
