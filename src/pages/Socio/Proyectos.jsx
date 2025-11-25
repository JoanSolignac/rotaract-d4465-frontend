import { useState } from 'react';
import { Pagination, TextInput, Button, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';
import useFetchProyectosDisponibles from '../../hooks/useFetchProyectosDisponibles';
import ProyectoDisponibleModal from '../../components/ProyectoDisponibleModal';
import ProyectoCard from '../../components/ProyectoCard';

export default function SocioProyectos() {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 12; // Adjusted for grid

    const { data, loading, error, refetch } = useFetchProyectosDisponibles(currentPage, pageSize, searchQuery);

    const [selectedProyecto, setSelectedProyecto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    const handleVerProyecto = (proyecto) => {
        setSelectedProyecto(proyecto);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProyecto(null);
    };

    const handlePostulacionSuccess = () => {
        refetch();
    };

    const proyectos = data?.content || [];
    const totalPages = data?.totalPages || 1;
    const totalElements = data?.totalElements || 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
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
                        Proyectos Disponibles
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 max-w-3xl">
                        Encuentra proyectos en tu club y participa activamente.
                    </p>
                </motion.div>

                {/* Search and Stats */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="w-full md:w-96">
                        <TextInput
                            id="search"
                            type="text"
                            icon={HiSearch}
                            placeholder="Buscar por título..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="[&>div>input]:bg-neutral-900 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600"
                        />
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
                        <p className="text-gray-400 text-lg">No se encontraron proyectos disponibles.</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && proyectos.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {proyectos.map((proyecto) => (
                            <ProyectoCard
                                key={proyecto.id}
                                proyecto={proyecto}
                                onVerDetalles={handleVerProyecto}
                                onPostular={handleVerProyecto} // Opens the same modal for now
                            />
                        ))}
                    </motion.div>
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

            {/* Modal */}
            <ProyectoDisponibleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                proyecto={selectedProyecto}
                onPostulacionSuccess={handlePostulacionSuccess}
            />
        </div>
    );
}
