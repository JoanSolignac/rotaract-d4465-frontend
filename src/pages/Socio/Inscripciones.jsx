import { useState, useMemo } from 'react';
import { Badge, Button, Spinner, TextInput, Select } from 'flowbite-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { parseLocalDate } from '../../utils/formatDate';
import useFetchMisInscripciones from '../../hooks/useFetchMisInscripciones';
import { del } from '../../services/fetchClient';

export default function SocioInscripciones() {
    const { data: inscripciones, loading, error, refetch } = useFetchMisInscripciones();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const filteredInscripciones = useMemo(() => {
        return inscripciones.filter(inscripcion => {
            const matchesSearch = searchQuery.trim() === '' ||
                inscripcion.referenciaTitulo.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = selectedStatus === '' ||
                inscripcion.estado === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [inscripciones, searchQuery, selectedStatus]);

    const handleCancelar = async (referenciaId, tipo) => {
        const result = await Swal.fire({
            title: '¿Cancelar tu inscripción?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B40032',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
            background: '#171717',
            color: '#ffffff'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Procesando...',
                    text: 'Cancelando tu inscripción',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    background: '#171717',
                    color: '#ffffff'
                });

                // Build endpoint based on type
                const endpoint = tipo === 'CONVOCATORIA'
                    ? `/api/v1/convocatorias/${referenciaId}/cancelar-inscripcion`
                    : `/api/v1/proyectos/${referenciaId}/cancelar-inscripcion`;

                await del(endpoint);

                await Swal.fire({
                    icon: 'success',
                    title: 'Cancelado',
                    text: 'Tu inscripción ha sido cancelada exitosamente.',
                    confirmButtonColor: '#B40032',
                    background: '#171717',
                    color: '#ffffff'
                });

                refetch();

            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'No se pudo cancelar la inscripción.',
                    confirmButtonColor: '#B40032',
                    background: '#171717',
                    color: '#ffffff'
                });
            }
        }
    };

    const getBadgeColor = (estado) => {
        switch (estado) {
            case 'PENDIENTE': return 'warning';
            case 'ACEPTADO': return 'success';
            case 'RECHAZADO': return 'failure';
            case 'CANCELADO': return 'gray';
            default: return 'info';
        }
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-[#050506]">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Mis Inscripciones
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 max-w-3xl">
                        Gestiona tus postulaciones a proyectos y actividades.
                    </p>
                </motion.div>

                {/* Filters */}
                {!loading && !error && (
                    <div className="mb-8 bg-neutral-900 p-6 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                                    Buscar por actividad
                                </label>
                                <TextInput
                                    id="search"
                                    placeholder="Ej: Proyecto..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                                    Filtrar por estado
                                </label>
                                <Select
                                    id="status"
                                    value={selectedStatus}
                                    onChange={e => setSelectedStatus(e.target.value)}
                                    className="[&>div>select]:bg-neutral-800 [&>div>select]:border-neutral-700 [&>div>select]:text-white"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="ACEPTADO">Aceptado</option>
                                    <option value="RECHAZADO">Rechazado</option>
                                    <option value="CANCELADO">Cancelado</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-20">
                        <Spinner size="xl" color="pink" />
                        <p className="mt-4 text-lg text-gray-400">Cargando inscripciones...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800">
                        <p className="text-red-400 text-lg font-medium mb-4">{error}</p>
                        <Button color="gray" onClick={refetch}>Reintentar</Button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredInscripciones.length === 0 && (
                    <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800">
                        <p className="text-gray-400 text-lg">
                            {inscripciones.length === 0 ? "No tienes inscripciones registradas." : "No se encontraron inscripciones con los filtros seleccionados."}
                        </p>
                    </div>
                )}

                {/* Grid of Cards */}
                {!loading && !error && filteredInscripciones.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInscripciones.map((inscripcion, index) => (
                            <motion.div
                                key={inscripcion.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800 hover:border-primary-600/50 transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Badge color={getBadgeColor(inscripcion.estado)} className="rounded-md">{inscripcion.estado}</Badge>
                                    <span className="text-xs text-gray-500">
                                        {(() => {
                                            const date = parseLocalDate(inscripcion.fechaRegistro);
                                            return date.toLocaleDateString('es-PE', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            });
                                        })()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{inscripcion.referenciaTitulo}</h3>
                                <p className="text-sm text-gray-400 mb-4">Tipo: {inscripcion.tipo}</p>

                                {inscripcion.estado === 'PENDIENTE' && (
                                    <Button
                                        color="failure"
                                        size="sm"
                                        onClick={() => handleCancelar(inscripcion.referenciaId, inscripcion.tipo)}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white border-none focus:ring-primary-500 shadow-lg shadow-primary-600/20"
                                    >
                                        Cancelar Inscripción
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
