import { useState, useMemo, useEffect } from 'react';
import { Modal, Table, TextInput, Select, Spinner, Pagination, Badge, Button } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import useFetchInscripcionesProyecto from '../hooks/useFetchInscripcionesProyecto';
import { post } from '../services/fetchClient';

/**
 * InscripcionesProyectoModal Component
 * Modal to display and manage inscripciones for a project
 */
export default function InscripcionesProyectoModal({ isOpen, onClose, proyecto }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('TODOS');
    const [processingId, setProcessingId] = useState(null);
    const pageSize = 10;

    const { data, loading, error, refetch } = useFetchInscripcionesProyecto(
        proyecto?.id,
        currentPage,
        pageSize
    );

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setCurrentPage(0);
            setSearchQuery('');
            setEstadoFilter('TODOS');
            setProcessingId(null);
        }
    }, [isOpen]);

    // Filter inscripciones in memory
    const filteredInscripciones = useMemo(() => {
        if (!data?.content) return [];

        return data.content.filter((inscripcion) => {
            const matchesSearch =
                searchQuery.trim() === '' ||
                inscripcion.usuarioNombre.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesEstado =
                estadoFilter === 'TODOS' ||
                inscripcion.estado === estadoFilter;

            return matchesSearch && matchesEstado;
        });
    }, [data?.content, searchQuery, estadoFilter]);

    const getEstadoBadgeColor = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'ACEPTADA':
                return 'success';
            case 'RECHAZADA':
                return 'failure';
            case 'PENDIENTE':
                return 'warning';
            default:
                return 'gray';
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
    };

    const handleAccion = async (inscripcionId, accion) => {
        const isAceptar = accion === 'aceptar';
        const actionVerb = isAceptar ? 'aceptar' : 'rechazar';
        const confirmColor = isAceptar ? '#31C48D' : '#F05252';

        const result = await Swal.fire({
            title: '¿Confirmar acción?',
            text: `¿Estás seguro de ${actionVerb} esta inscripción?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: confirmColor,
            cancelButtonColor: '#6B7280',
            confirmButtonText: isAceptar ? 'Sí, aceptar' : 'Sí, rechazar',
            cancelButtonText: 'Cancelar',
            background: '#171717',
            color: '#ffffff'
        });

        if (result.isConfirmed) {
            try {
                setProcessingId(inscripcionId);
                const path = `/api/v1/proyectos/${proyecto.id}/inscripciones/${inscripcionId}/${actionVerb}`;
                await post(path, {});

                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Inscripción actualizada correctamente',
                    icon: 'success',
                    confirmButtonColor: '#E20F7A',
                    background: '#171717',
                    color: '#ffffff'
                });

                refetch();

            } catch (err) {
                console.error(`Error al ${actionVerb} inscripción:`, err);
                Swal.fire({
                    title: 'Error',
                    text: err.message || `No se pudo ${actionVerb} la inscripción`,
                    icon: 'error',
                    confirmButtonColor: '#E20F7A',
                    background: '#171717',
                    color: '#ffffff'
                });
            } finally {
                setProcessingId(null);
            }
        }
    };

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            size="6xl"
            popup
            className="[&>div>div]:bg-neutral-900 [&>div>div]:border-neutral-800"
        >
            <div className="flex flex-col max-h-[90vh] bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl shadow-black/50">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-neutral-800 rounded-t-2xl bg-neutral-900">
                    <div className="flex flex-col gap-1 w-full pr-8">
                        <h3 className="text-xl font-bold text-white leading-tight">
                            Inscripciones del Proyecto
                        </h3>
                        {proyecto && (
                            <p className="text-sm text-gray-400">{proyecto.titulo}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-neutral-800 hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto bg-neutral-900 rounded-b-2xl">
                    {/* Search and Filter */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="searchInscripciones" className="block text-sm font-medium text-gray-300 mb-2">
                                Buscar por nombre
                            </label>
                            <TextInput
                                id="searchInscripciones"
                                type="text"
                                icon={HiSearch}
                                placeholder="Buscar usuario..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="filterEstado" className="block text-sm font-medium text-gray-300 mb-2">
                                Filtrar por estado
                            </label>
                            <Select
                                id="filterEstado"
                                value={estadoFilter}
                                onChange={(e) => setEstadoFilter(e.target.value)}
                                className="[&>div>select]:bg-neutral-800 [&>div>select]:border-neutral-700 [&>div>select]:text-white"
                            >
                                <option value="TODOS">Todos</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="ACEPTADA">Aceptada</option>
                                <option value="RECHAZADA">Rechazada</option>
                            </Select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">
                            Mostrando <span className="font-bold text-white">{filteredInscripciones.length}</span> de{' '}
                            <span className="font-bold text-white">{data?.totalElements || 0}</span> inscripciones
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col justify-center items-center py-12">
                            <Spinner size="xl" color="pink" />
                            <p className="mt-4 text-gray-400">Cargando inscripciones...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="text-center py-12">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredInscripciones.length === 0 && (
                        <div className="text-center py-12 bg-neutral-800 rounded-xl">
                            <p className="text-gray-400">No se encontraron inscripciones.</p>
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && filteredInscripciones.length > 0 && (
                        <div className="overflow-x-auto">
                            <Table hoverable className="[&>thead]:bg-neutral-800">
                                <Table.Head>
                                    <Table.HeadCell className="bg-neutral-800 text-gray-300">Nombre</Table.HeadCell>
                                    <Table.HeadCell className="bg-neutral-800 text-gray-300">Correo</Table.HeadCell>
                                    <Table.HeadCell className="bg-neutral-800 text-gray-300">Tipo</Table.HeadCell>
                                    <Table.HeadCell className="bg-neutral-800 text-gray-300">Estado</Table.HeadCell>
                                    <Table.HeadCell className="bg-neutral-800 text-gray-300">Fecha Registro</Table.HeadCell>
                                    <Table.HeadCell className="bg-neutral-800 text-gray-300 text-right">Acciones</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y divide-neutral-800">
                                    {filteredInscripciones.map((inscripcion) => (
                                        <Table.Row
                                            key={inscripcion.id}
                                            className="bg-neutral-900 hover:bg-neutral-800/50"
                                        >
                                            <Table.Cell className="font-medium text-white">
                                                {inscripcion.usuarioNombre}
                                            </Table.Cell>
                                            <Table.Cell className="text-gray-400">
                                                {inscripcion.usuarioCorreo}
                                            </Table.Cell>
                                            <Table.Cell className="text-gray-400">
                                                {inscripcion.tipo}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color={getEstadoBadgeColor(inscripcion.estado)}>
                                                    {inscripcion.estado}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell className="text-gray-400 text-sm">
                                                {formatDateTime(inscripcion.fechaRegistro)}
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(inscripcion.estado === 'PENDIENTE' || inscripcion.estado === 'RECHAZADO' || inscripcion.estado === 'RECHAZADA') && (
                                                        <Button
                                                            size="xs"
                                                            color="success"
                                                            className="text-white px-2 py-1"
                                                            onClick={() => handleAccion(inscripcion.id, 'aceptar')}
                                                            disabled={processingId === inscripcion.id}
                                                            isProcessing={processingId === inscripcion.id}
                                                        >
                                                            Aceptar
                                                        </Button>
                                                    )}
                                                    {(inscripcion.estado === 'PENDIENTE' || inscripcion.estado === 'ACEPTADA' || inscripcion.estado === 'APROBADO') && (
                                                        <Button
                                                            size="xs"
                                                            color="failure"
                                                            className="text-white px-2 py-1"
                                                            onClick={() => handleAccion(inscripcion.id, 'rechazar')}
                                                            disabled={processingId === inscripcion.id}
                                                            isProcessing={processingId === inscripcion.id}
                                                        >
                                                            Rechazar
                                                        </Button>
                                                    )}
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    )}


                    {/* Pagination */}
                    {!loading && !error && data && data.totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                currentPage={currentPage + 1}
                                totalPages={data.totalPages}
                                onPageChange={handlePageChange}
                                showIcons
                                className="[&>button]:bg-neutral-800 [&>button]:text-white [&>button:hover]:bg-neutral-700 [&>button]:border-neutral-700"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

InscripcionesProyectoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    proyecto: PropTypes.object,
};
