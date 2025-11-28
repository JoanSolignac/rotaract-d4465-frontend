import { useState } from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiExclamationTriangle } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { patch } from '../services/fetchClient';

/**
 * DesactivarClubButton Component
 * Button with confirmation modal and countdown to deactivate a club
 */
export default function DesactivarClubButton({ club, onDeactivated }) {
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
        setCountdown(null);
    };

    const handleCloseModal = () => {
        if (!loading) {
            setShowModal(false);
            setCountdown(null);
        }
    };

    const handleConfirm = () => {
        // Start countdown from 10
        setCountdown(10);
        setLoading(true);

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    executeDeactivation();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const executeDeactivation = async () => {
        try {
            await patch(`/api/v1/clubs/deactivate/${club.id}`);

            setShowModal(false);
            setCountdown(null);

            // Success notification
            await Swal.fire({
                icon: 'success',
                title: 'Club desactivado',
                html: `
                    <p><strong>${club.nombre}</strong> ha sido desactivado correctamente.</p>
                    <p class="text-sm text-gray-600 mt-2">Todos los miembros han sido liberados y son INTERESADOS.</p>
                `,
                confirmButtonColor: '#d91b5c',
                timer: 5000
            });

            // Callback to refresh list
            if (onDeactivated) {
                onDeactivated();
            }
        } catch (error) {
            console.error('Error deactivating club:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo desactivar el club',
                confirmButtonColor: '#d91b5c'
            });
        } finally {
            setLoading(false);
        }
    };

    // Don't show button if club is already inactive
    if (!club.activo) {
        return null;
    }

    return (
        <>
            <Button
                color="failure"
                size="sm"
                onClick={handleOpenModal}
                title="Desactivar este club"
                className="bg-red-600 hover:bg-red-700"
            >
                <HiExclamationTriangle className="mr-2 h-4 w-4" />
                Desactivar
            </Button>

            <AnimatePresence>
                {showModal && (
                    <Modal
                        show={showModal}
                        onClose={handleCloseModal}
                        size="md"
                        popup
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center"
                            >
                                <HiExclamationTriangle className="mx-auto mb-4 h-14 w-14 text-red-600" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Confirmar desactivación del club
                                </h3>
                                <p className="mb-5 text-sm text-gray-600 dark:text-gray-300">
                                    Esta acción desactivará el club <strong>{club.nombre}</strong> y convertirá a todos sus miembros en <strong>INTERESADOS</strong>.
                                </p>
                                <p className="mb-5 text-sm font-semibold text-red-600">
                                    ¿Está seguro de continuar?
                                </p>

                                {countdown !== null && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mb-5 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                                    >
                                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                                            {countdown > 0 ? countdown : '✓'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {countdown > 0
                                                ? 'Notificando al distrito... No cierre la ventana.'
                                                : 'Desactivando club...'}
                                        </p>
                                    </motion.div>
                                )}

                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="gray"
                                        onClick={handleCloseModal}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="failure"
                                        onClick={handleConfirm}
                                        disabled={loading || countdown !== null}
                                        isProcessing={loading}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {countdown !== null ? 'Procesando...' : 'Sí, desactivar'}
                                    </Button>
                                </div>
                            </motion.div>
                        </Modal.Body>
                    </Modal>
                )}
            </AnimatePresence>
        </>
    );
}

DesactivarClubButton.propTypes = {
    club: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        activo: PropTypes.bool.isRequired
    }).isRequired,
    onDeactivated: PropTypes.func
};
