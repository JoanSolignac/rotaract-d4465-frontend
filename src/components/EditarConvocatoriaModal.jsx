import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Textarea, Spinner } from 'flowbite-react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { put, patch } from '../services/fetchClient';

/**
 * EditarConvocatoriaModal Component
 * Modal to edit an existing convocatoria
 */
export default function EditarConvocatoriaModal({ isOpen, onClose, convocatoria, onUpdated }) {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        requisitos: '',
        cupoMaximo: 0,
        fechaInicioPostulacion: '',
        fechaFinPostulacion: '',
        fechaPublicacion: '',
        fechaCierre: ''
    });
    const [loading, setLoading] = useState(false);

    // Load data when modal opens or convocatoria changes
    useEffect(() => {
        if (convocatoria && isOpen) {
            setFormData({
                titulo: convocatoria.titulo || '',
                descripcion: convocatoria.descripcion || '',
                requisitos: convocatoria.requisitos || '',
                cupoMaximo: convocatoria.cupoMaximo || 0,
                fechaInicioPostulacion: convocatoria.fechaInicioPostulacion || '',
                fechaFinPostulacion: convocatoria.fechaFinPostulacion || '',
                fechaPublicacion: convocatoria.fechaPublicacion || '',
                fechaCierre: convocatoria.fechaCierre || ''
            });
        }
    }, [convocatoria, isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirmation dialog
        const result = await Swal.fire({
            title: '¿Guardar cambios?',
            text: 'Estás a punto de editar la convocatoria.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#E20F7A',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'Cancelar',
            background: '#171717',
            color: '#ffffff'
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await patch(`/api/v1/convocatorias/${convocatoria.id}`, formData);

                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Convocatoria actualizada correctamente',
                    icon: 'success',
                    confirmButtonColor: '#E20F7A',
                    background: '#171717',
                    color: '#ffffff'
                });

                onUpdated();
                onClose();
            } catch (error) {
                console.error('Error updating convocatoria:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudo actualizar la convocatoria',
                    icon: 'error',
                    confirmButtonColor: '#E20F7A',
                    background: '#171717',
                    color: '#ffffff'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    if (!convocatoria) return null;

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            size="4xl"
            popup
            className="[&>div>div]:bg-neutral-900 [&>div>div]:border-neutral-800"
        >
            <Modal.Header className="bg-neutral-900 border-b border-neutral-800 !p-6">
                <span className="text-xl font-bold text-white">Editar Convocatoria</span>
            </Modal.Header>
            <Modal.Body className="bg-neutral-900 p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Título */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="titulo" value="Título" className="text-gray-300" />
                        </div>
                        <TextInput
                            id="titulo"
                            type="text"
                            placeholder="Título de la convocatoria"
                            required
                            value={formData.titulo}
                            onChange={handleChange}
                            className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="descripcion" value="Descripción" className="text-gray-300" />
                        </div>
                        <Textarea
                            id="descripcion"
                            placeholder="Descripción detallada..."
                            required
                            rows={4}
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="bg-neutral-800 border-neutral-700 text-white placeholder-gray-500 focus:border-primary-600 focus:ring-primary-600"
                        />
                    </div>

                    {/* Requisitos */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="requisitos" value="Requisitos" className="text-gray-300" />
                        </div>
                        <Textarea
                            id="requisitos"
                            placeholder="Lista de requisitos..."
                            required
                            rows={4}
                            value={formData.requisitos}
                            onChange={handleChange}
                            className="bg-neutral-800 border-neutral-700 text-white placeholder-gray-500 focus:border-primary-600 focus:ring-primary-600"
                        />
                    </div>

                    {/* Cupo Máximo */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="cupoMaximo" value="Cupo Máximo" className="text-gray-300" />
                        </div>
                        <TextInput
                            id="cupoMaximo"
                            type="number"
                            min="1"
                            required
                            value={formData.cupoMaximo}
                            onChange={handleChange}
                            className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600"
                        />
                    </div>

                    {/* Fechas Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fechaInicioPostulacion" value="Inicio de Postulación" className="text-gray-300" />
                            </div>
                            <TextInput
                                id="fechaInicioPostulacion"
                                type="date"
                                required
                                value={formData.fechaInicioPostulacion}
                                onChange={handleChange}
                                className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600 [&>div>input]:w-full"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fechaFinPostulacion" value="Fin de Postulación" className="text-gray-300" />
                            </div>
                            <TextInput
                                id="fechaFinPostulacion"
                                type="date"
                                required
                                value={formData.fechaFinPostulacion}
                                onChange={handleChange}
                                className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600 [&>div>input]:w-full"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fechaPublicacion" value="Fecha de Publicación" className="text-gray-300" />
                            </div>
                            <TextInput
                                id="fechaPublicacion"
                                type="date"
                                required
                                value={formData.fechaPublicacion}
                                onChange={handleChange}
                                className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600 [&>div>input]:w-full"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fechaCierre" value="Fecha de Cierre" className="text-gray-300" />
                            </div>
                            <TextInput
                                id="fechaCierre"
                                type="date"
                                required
                                value={formData.fechaCierre}
                                onChange={handleChange}
                                className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600 [&>div>input]:w-full"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="gray"
                            onClick={onClose}
                            disabled={loading}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-600 hover:bg-primary-700 text-white border-none focus:ring-primary-500 shadow-lg shadow-primary-600/20"
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" light={true} className="mr-2" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar cambios'
                            )}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

EditarConvocatoriaModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    convocatoria: PropTypes.object,
    onUpdated: PropTypes.func.isRequired
};
