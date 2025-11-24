import { useState, useEffect, useMemo } from 'react';
import { Pagination, TextInput, Spinner, Select } from 'flowbite-react';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter } from 'react-icons/hi';
import AppNavbar from '../components/Navbar';
import ConvocatoriaCard from '../components/ConvocatoriaCard';
import ConvocatoriaDetailsModal from '../components/ConvocatoriaDetailsModal';

export default function ConvocatoriasPage() {
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);

    // Auth state
    const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

    useEffect(() => {
        fetchConvocatorias(currentPage - 1);
    }, [currentPage]);

    const fetchConvocatorias = async (page) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `https://rotaractd4465api.up.railway.app/api/v1/convocatorias/public?page=${page}&size=${pageSize}`
            );

            if (!response.ok) {
                throw new Error('Error al cargar las convocatorias');
            }

            const data = await response.json();

            if (data.content && Array.isArray(data.content)) {
                setConvocatorias(data.content);
                setTotalPages(data.totalPages || 1);
            } else {
                setConvocatorias([]);
            }
        } catch (err) {
            console.error('Error fetching convocatorias:', err);
            setError('No se pudieron cargar las convocatorias. Por favor, intenta nuevamente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleVerDetalles = (convocatoria) => {
        setSelectedConvocatoria(convocatoria);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedConvocatoria(null);
    };

    const clubOptions = useMemo(() => {
        const uniqueClubs = [...new Set(convocatorias.map(conv => conv.clubNombre))];
        return uniqueClubs.sort();
    }, [convocatorias]);

    const filteredConvocatorias = useMemo(() => {
        return convocatorias.filter((conv) => {
            const matchesTitle =
                searchQuery.trim() === '' ||
                conv.titulo.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClub =
                selectedClub === '' ||
                conv.clubNombre === selectedClub;

            return matchesTitle && matchesClub;
        });
    }, [convocatorias, searchQuery, selectedClub]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedClub('');
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

    return (
        <div className="min-h-screen flex flex-col bg-[#050506]">
            <AppNavbar />

            {/* Hero Section */}
            <section className="relative bg-neutral-900 pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#050506]" />

                <div className="relative max-w-screen-xl mx-auto px-4 text-center z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight"
                    >
                        Convocatorias del Distrito 4465
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto font-light"
                    >
                        Explora todas las convocatorias disponibles y únete a las actividades de nuestro distrito.
                    </motion.p>
                </div>
            </section>

            <main className="flex-grow pb-16 px-4">
                <div className="max-w-7xl mx-auto py-12">

                    {/* Search and Filter Section */}
                    {!loading && !error && convocatorias.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-10 bg-neutral-900 p-6 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <label htmlFor="searchTitle" className="block text-sm font-medium text-gray-300 mb-2">
                                        Buscar por título
                                    </label>
                                    <TextInput
                                        id="searchTitle"
                                        type="text"
                                        icon={HiSearch}
                                        placeholder="Ej: Voluntariado..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="filterClub" className="block text-sm font-medium text-gray-300 mb-2">
                                        Filtrar por club
                                    </label>
                                    <Select
                                        id="filterClub"
                                        icon={HiFilter}
                                        value={selectedClub}
                                        onChange={(e) => setSelectedClub(e.target.value)}
                                        className="[&>div>select]:bg-neutral-800 [&>div>select]:border-neutral-700 [&>div>select]:text-white"
                                    >
                                        <option value="">Todos los clubes</option>
                                        {clubOptions.map((club) => (
                                            <option key={club} value={club}>
                                                {club}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            {(searchQuery || selectedClub) && (
                                <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-800">
                                    <span className="text-sm text-gray-400">Filtros activos:</span>
                                    {searchQuery && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-900/20 text-primary-400 border border-primary-900/30">
                                            Título: "{searchQuery}"
                                        </span>
                                    )}
                                    {selectedClub && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-900/20 text-yellow-400 border border-yellow-900/30">
                                            Club: {selectedClub}
                                        </span>
                                    )}
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-gray-400 hover:text-white transition-colors underline"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Results Count */}
                    <div className="mb-8 flex items-center justify-between">
                        <p className="text-gray-400">
                            Mostrando <span className="font-bold text-white">{filteredConvocatorias.length}</span> convocatorias
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
                        <div className="text-center py-20">
                            <p className="text-red-400 text-lg font-medium">{error}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredConvocatorias.length === 0 && (
                        <div className="text-center py-20 bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800">
                            <p className="text-gray-400 text-lg">No se encontraron convocatorias.</p>
                        </div>
                    )}

                    {/* Convocatorias Grid */}
                    {!loading && !error && filteredConvocatorias.length > 0 && (
                        <>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                            >
                                {filteredConvocatorias.map((convocatoria) => (
                                    <motion.div key={convocatoria.id} variants={itemVariants}>
                                        <ConvocatoriaCard
                                            convocatoria={convocatoria}
                                            onVerDetalles={handleVerDetalles}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        showIcons
                                        className="text-white [&>button]:bg-neutral-800 [&>button]:text-white [&>button:hover]:bg-neutral-700"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Details Modal */}
            <ConvocatoriaDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={selectedConvocatoria}
                isAuthenticated={isAuthenticated}
            />
        </div>
    );
}
