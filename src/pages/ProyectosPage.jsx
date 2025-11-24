import { useState, useEffect, useMemo } from 'react';
import { Pagination, TextInput, Spinner, Select } from 'flowbite-react';
import AppNavbar from '../components/Navbar';
import ProyectoCard from '../components/ProyectoCard';
import ProyectoDetailsModal from '../components/ProyectoDetailsModal';

/**
 * ProyectosPage Component
 * Display all available proyectos with search and pagination
 */
export default function ProyectosPage() {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProyecto, setSelectedProyecto] = useState(null);

    // Auth state
    const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

    useEffect(() => {
        fetchProyectos(currentPage - 1);
    }, [currentPage]);

    const fetchProyectos = async (page) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `https://rotaractd4465api.up.railway.app/api/v1/proyectos/public?page=${page}&size=${pageSize}`
            );

            if (!response.ok) {
                throw new Error('Error al cargar los proyectos');
            }

            const data = await response.json();

            if (data.content && Array.isArray(data.content)) {
                setProyectos(data.content);
                setTotalPages(data.totalPages || 1);
            } else {
                setProyectos([]);
            }
        } catch (err) {
            console.error('Error fetching proyectos:', err);
            setError('No se pudieron cargar los proyectos. Por favor, intenta nuevamente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleVerDetalles = (proyecto) => {
        setSelectedProyecto(proyecto);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProyecto(null);
    };

    // Get unique clubs for filter dropdown
    const clubOptions = useMemo(() => {
        const uniqueClubs = [...new Set(proyectos.map(proy => proy.clubNombre))];
        return uniqueClubs.sort();
    }, [proyectos]);

    // Filter proyectos using useMemo
    const filteredProyectos = useMemo(() => {
        return proyectos.filter((proy) => {
            const matchesTitle =
                searchQuery.trim() === '' ||
                proy.titulo.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesClub =
                selectedClub === '' ||
                proy.clubNombre === selectedClub;

            return matchesTitle && matchesClub;
        });
    }, [proyectos, searchQuery, selectedClub]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedClub('');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AppNavbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 mt-16">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Proyectos del Distrito 4465
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
                        Descubre todos los proyectos de impacto social y voluntariado de nuestro distrito.
                    </p>
                </div>
            </section>

            <main className="flex-grow pb-16">
                <div className="max-w-7xl mx-auto px-4 py-10">

                    {/* Search and Filter Section */}
                    {!loading && !error && proyectos.length > 0 && (
                        <>
                            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Search by Title */}
                                    <div className="lg:col-span-2">
                                        <label htmlFor="searchTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                            Buscar por título
                                        </label>
                                        <TextInput
                                            id="searchTitle"
                                            type="text"
                                            icon={() => (
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            )}
                                            placeholder="Ej: Reforestación..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Filter by Club */}
                                    <div>
                                        <label htmlFor="filterClub" className="block text-sm font-medium text-gray-700 mb-2">
                                            Filtrar por club
                                        </label>
                                        <Select
                                            id="filterClub"
                                            value={selectedClub}
                                            onChange={(e) => setSelectedClub(e.target.value)}
                                            className="w-full"
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

                                {/* Active Filters and Clear Button */}
                                {(searchQuery || selectedClub) && (
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <span className="text-sm text-gray-600 font-medium">Filtros activos:</span>
                                        {searchQuery && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                                                Título: "{searchQuery}"
                                            </span>
                                        )}
                                        {selectedClub && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                                Club: {selectedClub}
                                            </span>
                                        )}
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-red-600 hover:text-red-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-red-300 rounded px-2 py-1"
                                        >
                                            Limpiar filtros
                                        </button>
                                    </div>
                                )}

                            </div>

                            {/* Results Count */}
                            <div className="mb-6">
                                <p className="text-gray-600 text-sm md:text-base">
                                    Mostrando <span className="font-semibold text-gray-900">{filteredProyectos.length}</span> de {proyectos.length} {proyectos.length === 1 ? 'proyecto' : 'proyectos'}
                                </p>
                            </div>

                            {/* No Results Message */}
                            {filteredProyectos.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-600 text-lg mb-2">No se encontraron proyectos</p>
                                    <p className="text-gray-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col justify-center items-center py-20">
                            <Spinner size="xl" color="info" />
                            <p className="mt-4 text-lg text-gray-600">Cargando proyectos...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-600 text-lg font-medium">{error}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && proyectos.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-gray-600 text-lg mb-2">No se encontraron proyectos</p>
                            <p className="text-gray-500 text-sm">
                                {searchQuery ? 'Intenta ajustar tu búsqueda' : 'No hay proyectos disponibles en este momento'}
                            </p>
                        </div>
                    )}

                    {/* Proyectos Grid */}
                    {!loading && !error && filteredProyectos.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {filteredProyectos.map((proyecto) => (
                                    <ProyectoCard
                                        key={proyecto.id}
                                        proyecto={proyecto}
                                        onVerDetalles={handleVerDetalles}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        showIcons
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Details Modal */}
            <ProyectoDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={selectedProyecto}
                isAuthenticated={isAuthenticated}
            />
        </div>
    );
}
