import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Textarea, Spinner } from 'flowbite-react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { patch } from '../services/fetchClient';

/**
 * EditarProyectoModal Component
 * Modal to edit an existing project
 */
export default function EditarProyectoModal({ isOpen, onClose, proyecto, onUpdated }) {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        objetivo: '',
        requisitos: '',
        lugar: '',
        cupoMaximo: 0,
        fechaInicioPostulacion: '',
        fechaFinPostulacion: '',
        fechaInicioProyecto: '',
        fechaFinProyecto: ''
    });
    const [loading, setLoading] = useState(false);

    // Load data when modal opens or proyecto changes
    useEffect(() => {
        if (proyecto && isOpen) {
            setFormData({
                titulo: proyecto.titulo || '',
                descripcion: proyecto.descripcion || '',
                objetivo: proyecto.objetivo || '',
                requisitos: proyecto.requisitos || '',
                lugar: proyecto.lugar || '',
                cupoMaximo: proyecto.cupoMaximo || 0,
                fechaInicioPostulacion: proyecto.fechaInicioPostulacion || '',
                fechaFinPostulacion: proyecto.fechaFinPostulacion || '',
                fechaInicioProyecto: proyecto.fechaInicioProyecto || '',
                fechaFinProyecto: proyecto.fechaFinProyecto || ''
            });
        }
    }, [proyecto, isOpen]);

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
            text: 'Estás a punto de editar este proyecto.',
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
                await patch(`/api/v1/proyectos/${proyecto.id}`, formData);

                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Proyecto actualizado correctamente',
                    icon: 'success',
                    confirmButtonColor: '#E20F7A',
                    background: '#171717',
                    color: '#ffffff'
                });

                onUpdated();
                onClose();
            } catch (error) {
                console.error('Error updating proyecto:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudo actualizar el proyecto',
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

    if (!proyecto) return null;

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            size="4xl"
            popup
            className="[&>div>div]:bg-neutral-900 [&>div>div]:border-neutral-800"
        >
            <Modal.Header className="bg-neutral-900 border-b border-neutral-800 !p-6">
                <span className="text-xl font-bold text-white">Editar Proyecto</span>
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
                            placeholder="Título del proyecto"
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
                            rows={3}
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="bg-neutral-800 border-neutral-700 text-white placeholder-gray-500 focus:border-primary-600 focus:ring-primary-600"
                        />
                    </div>

                    {/* Objetivo */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="objetivo" value="Objetivo" className="text-gray-300" />
                        </div>
                        <Textarea
                            id="objetivo"
                            placeholder="Objetivo del proyecto..."
                            required
                            rows={3}
                            value={formData.objetivo}
                            onChange={handleChange}
                            className="bg-neutral-800 border-neutral-700 text-white placeholder-gray-500 focus:border-primary-600 focus:ring-primary-600"
                        />
                    </div>

                    {/* Requisitos y Lugar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="requisitos" value="Requisitos" className="text-gray-300" />
                            </div>
                            <Textarea
                                id="requisitos"
                                placeholder="Lista de requisitos..."
                                required
                                rows={3}
                                value={formData.requisitos}
                                onChange={handleChange}
                                className="bg-neutral-800 border-neutral-700 text-white placeholder-gray-500 focus:border-primary-600 focus:ring-primary-600"
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="lugar" value="Lugar" className="text-gray-300" />
                                </div>
                                <TextInput
                                    id="lugar"
                                    type="text"
                                    placeholder="Ubicación del proyecto"
                                    required
                                    value={formData.lugar}
                                    onChange={handleChange}
                                    className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600"
                                />
                            </div>
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
                        </div>
                    </div>

                    {/* Fechas Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-neutral-800 pt-4">
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
                                <Label htmlFor="fechaInicioProyecto" value="Inicio del Proyecto" className="text-gray-300" />
                            </div>
                            <TextInput
                                id="fechaInicioProyecto"
                                type="date"
                                required
                                value={formData.fechaInicioProyecto}
                                onChange={handleChange}
                                className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600 [&>div>input]:w-full"
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fechaFinProyecto" value="Fin del Proyecto" className="text-gray-300" />
                            </div>
                            <TextInput
                                id="fechaFinProyecto"
                                type="date"
                                required
                                value={formData.fechaFinProyecto}
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

EditarProyectoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    proyecto: PropTypes.object,
    onUpdated: PropTypes.func.isRequired
};
