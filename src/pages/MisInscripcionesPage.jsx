import { useState, useEffect, useMemo } from 'react';
import { Badge, Button, Spinner, TextInput, Select } from 'flowbite-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import InteresadoNavbar from '../components/InteresadoNavbar';

export default function MisInscripcionesPage() {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const fetchInscripciones = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/inscripciones/mis', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar inscripciones');

            const data = await response.json();
            // API returns a Page object, so we access data.content
            setInscripciones(data.content && Array.isArray(data.content) ? data.content : []);
        } catch (err) {
            console.error('Error fetching inscripciones:', err);
            setError('No se pudieron cargar tus inscripciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInscripciones();
    }, []);

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
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B40032',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, cancelar inscripción',
            cancelButtonText: 'No, mantener'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Procesando...',
                    text: 'Cancelando tu inscripción',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const token = localStorage.getItem('accessToken');

                // Build the correct endpoint based on tipo
                const endpoint = tipo === 'CONVOCATORIA'
                    ? `https://rotaractd4465api.up.railway.app/api/v1/convocatorias/${referenciaId}/cancelar-inscripcion`
                    : `https://rotaractd4465api.up.railway.app/api/v1/proyectos/${referenciaId}/cancelar-inscripcion`;

                const response = await fetch(endpoint, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Handle both JSON and text responses
                const contentType = response.headers.get('content-type');
                let errorMessage = 'Error al cancelar la inscripción.';

                if (!response.ok) {
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        // Use DTO error format: { timestamp, status, errors[], message }
                        errorMessage = errorData.errors && errorData.errors.length > 0
                            ? errorData.errors[0]
                            : (errorData.message || errorMessage);
                    } else {
                        const text = await response.text();
                        errorMessage = text || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'Cancelado',
                    text: 'Tu inscripción ha sido cancelada exitosamente.',
                    confirmButtonColor: '#B40032'
                });

                fetchInscripciones(); // Refresh the list

            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'No se pudo cancelar la inscripción.',
                    confirmButtonColor: '#B40032'
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
        <div className="min-h-screen flex flex-col bg-[#050506]">
            <InteresadoNavbar />

            <section className="relative bg-neutral-900 pt-24 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#050506]" />

                <div className="relative max-w-screen-xl mx-auto px-4 text-center z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Mis Inscripciones</h1>
                    <p className="text-lg text-gray-400">Gestiona tus postulaciones a actividades.</p>
                </div>
            </section>

            <main className="flex-grow py-8">
                <div className="max-w-screen-xl mx-auto px-4">
                    {loading && <div className="text-center py-20"><Spinner size="xl" color="pink" /><p className="mt-4 text-gray-400">Cargando...</p></div>}
                    {!loading && error && <div className="text-center py-20 text-red-400">{error}</div>}

                    {!loading && !error && (
                        <>
                            <div className="mb-8 bg-neutral-900 p-6 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                                            Buscar por actividad
                                        </label>
                                        <TextInput
                                            id="search"
                                            placeholder="Ej: Voluntariado..."
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

                            {filteredInscripciones.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    {inscripciones.length === 0 ? "No tienes inscripciones registradas." : "No se encontraron inscripciones con los filtros seleccionados."}
                                </div>
                            ) : (
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
                                                    {new Date(inscripcion.fechaRegistro).toLocaleDateString('es-PE', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{inscripcion.referenciaTitulo}</h3>
                                            <p className="text-sm text-gray-400 mb-4">Tipo: {inscripcion.tipo}</p>

                                            <Button
                                                color="failure"
                                                size="sm"
                                                onClick={() => handleCancelar(inscripcion.referenciaId, inscripcion.tipo)}
                                                disabled={inscripcion.estado === 'ACEPTADO' || inscripcion.estado === 'RECHAZADO' || inscripcion.estado === 'CANCELADO'}
                                                className={`w-full text-white ${inscripcion.estado === 'PENDIENTE' ? 'bg-primary-600 hover:bg-primary-700 border-none focus:ring-primary-500 shadow-lg shadow-primary-600/20' : 'bg-neutral-800 border-neutral-700'}`}
                                            >
                                                {inscripcion.estado === 'PENDIENTE' ? 'Cancelar Inscripción' : 'No se puede cancelar'}
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

