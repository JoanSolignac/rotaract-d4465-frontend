import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, TextInput, Button, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import { HiSearch, HiPlus } from 'react-icons/hi';
import useFetchProyectosPresidente from '../../hooks/useFetchProyectosPresidente';
import ProyectoDetailsModal from '../../components/ProyectoDetailsModal';
import InscripcionesProyectoModal from '../../components/InscripcionesProyectoModal';
import EditarProyectoModal from '../../components/EditarProyectoModal';
import ProyectoCardPresidente from '../../components/ProyectoCardPresidente';

/**
 * Proyectos Page - President Module
 * Manage projects: list, view details, edit, manage inscripciones, attendance
 */
export default function Proyectos() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 10;

    const { data, loading, error, refetch } = useFetchProyectosPresidente(currentPage, pageSize, searchQuery);

    // Modal states
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [inscripcionesModalOpen, setInscripcionesModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProyecto, setSelectedProyecto] = useState(null);

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    const openModal = (modalSetter, proyecto) => {
        setSelectedProyecto(proyecto);
        modalSetter(true);
    };

    const closeModal = (modalSetter) => {
        modalSetter(false);
        setSelectedProyecto(null);
    };

    const handleProyectoUpdated = () => {
        refetch();
    };

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

    const proyectos = data?.content || [];
    const totalPages = data?.totalPages || 1;
    const totalElements = data?.totalElements || 0;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Gestión de Proyectos
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 max-w-3xl">
                        Administra los proyectos de tu club, gestiona inscripciones y asistencia.
                    </p>
                </motion.div>

                {/* Search and Stats */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="w-full md:w-96 flex gap-2">
                        <TextInput
                            id="search"
                            type="text"
                            icon={HiSearch}
                            placeholder="Buscar proyecto..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="flex-1 [&>div>input]:bg-neutral-900 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600"
                        />
                        <Button
                            className="bg-[#8B0036] hover:bg-[#6d002b] text-white border-none whitespace-nowrap"
                            onClick={() => navigate('/presidente/proyectos/crear')}
                        >
                            <HiPlus className="mr-2 h-5 w-5" />
                            Agregar
                        </Button>
                    </div>
                    <div className="text-gray-400 text-sm">
                        Mostrando <span className="font-bold text-white">{proyectos.length}</span> de{' '}
                        <span className="font-bold text-white">{totalElements}</span> proyectos
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-20">
                        <Spinner size="xl" color="pink" />
                        <p className="mt-4 text-lg text-gray-400">Cargando proyectos...</p>
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
                {!loading && !error && proyectos.length === 0 && (
                    <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800">
                        <p className="text-gray-400 text-lg">No se encontraron proyectos.</p>
                    </div>
                )}

                {/* Proyectos Grid */}
                {!loading && !error && proyectos.length > 0 && (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                        >
                            {proyectos.map((proyecto) => (
                                <motion.div key={proyecto.id} variants={itemVariants}>
                                    <ProyectoCardPresidente
                                        proyecto={proyecto}
                                        onVerInscripciones={() => openModal(setInscripcionesModalOpen, proyecto)}
                                        onEditar={() => openModal(setEditModalOpen, proyecto)}
                                        onAsistencia={() => navigate(`/presidente/proyectos/${proyecto.id}/asistencia`)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <Pagination
                            currentPage={currentPage + 1}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            showIcons
                            className="[&>button]:bg-neutral-800 [&>button]:text-white [&>button:hover]:bg-neutral-700 [&>button]:border-neutral-700"
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            <ProyectoDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => closeModal(setDetailsModalOpen)}
                proyecto={selectedProyecto}
            />

            <InscripcionesProyectoModal
                isOpen={inscripcionesModalOpen}
                onClose={() => closeModal(setInscripcionesModalOpen)}
                proyecto={selectedProyecto}
            />

            <EditarProyectoModal
                isOpen={editModalOpen}
                onClose={() => closeModal(setEditModalOpen)}
                proyecto={selectedProyecto}
                onUpdated={handleProyectoUpdated}
            />

        </div>
    );
}
