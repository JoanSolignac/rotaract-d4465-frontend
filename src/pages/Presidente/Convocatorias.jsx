import { useState } from 'react';
import { Pagination, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import useFetchConvocatoriasPresidente from '../../hooks/useFetchConvocatoriasPresidente';
import ConvocatoriaCardPresidente from '../../components/ConvocatoriaCardPresidente';
import InscripcionesModal from '../../components/InscripcionesModal';
import EditarConvocatoriaModal from '../../components/EditarConvocatoriaModal';

/**
 * Convocatorias Page - President Module
 * Displays convocatorias created by the president's club
 * Allows editing and viewing inscripciones
 */
export default function Convocatorias() {
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 12;

    const { data, loading, error, refetch } = useFetchConvocatoriasPresidente(currentPage, pageSize);

    // Modal state
    const [isInscripcionesModalOpen, setIsInscripcionesModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleVerInscripciones = (convocatoria) => {
        setSelectedConvocatoria(convocatoria);
        setIsInscripcionesModalOpen(true);
    };

    const handleEditar = (convocatoria) => {
        setSelectedConvocatoria(convocatoria);
        setIsEditModalOpen(true);
    };

    const handleCloseInscripcionesModal = () => {
        setIsInscripcionesModalOpen(false);
        setSelectedConvocatoria(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedConvocatoria(null);
    };

    const handleConvocatoriaUpdated = () => {
        refetch();
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const convocatorias = data?.content || [];
    const totalPages = data?.totalPages || 1;
    const totalElements = data?.totalElements || 0;

    return (
        <div className="pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Gestión de Convocatorias
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 max-w-3xl">
                        Administra las convocatorias de tu club, revisa las inscripciones y gestiona los postulantes.
                    </p>
                </motion.div>

                {/* Results Count */}
                <div className="mb-8 flex items-center justify-between">
                    <p className="text-gray-400">
                        Mostrando <span className="font-bold text-white">{convocatorias.length}</span> de{' '}
                        <span className="font-bold text-white">{totalElements}</span> convocatorias
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-20">
                        <Spinner size="xl" color="pink" />
                        <p className="mt-4 text-lg text-gray-400">Cargando convocatorias...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-20 bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800">
                        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-400 text-lg font-medium mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && convocatorias.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800"
                    >
                        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400 text-lg mb-2">No hay convocatorias creadas</p>
                        <p className="text-gray-500 text-sm">Crea tu primera convocatoria para comenzar</p>
                    </motion.div>
                )}

                {/* Convocatorias Grid */}
                {!loading && !error && convocatorias.length > 0 && (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                        >
                            {convocatorias.map((convocatoria) => (
                                <motion.div key={convocatoria.id} variants={itemVariants}>
                                    <ConvocatoriaCardPresidente
                                        convocatoria={convocatoria}
                                        onVerInscripciones={handleVerInscripciones}
                                        onEditar={handleEditar}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
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
                    </>
                )}
            </div>

            {/* Inscripciones Modal */}
            <InscripcionesModal
                isOpen={isInscripcionesModalOpen}
                onClose={handleCloseInscripcionesModal}
                convocatoria={selectedConvocatoria}
            />

            {/* Editar Convocatoria Modal */}
            <EditarConvocatoriaModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                convocatoria={selectedConvocatoria}
                onUpdated={handleConvocatoriaUpdated}
            />
        </div>
    );
}
