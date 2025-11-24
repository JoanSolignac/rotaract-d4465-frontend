import { useState, useEffect, useMemo } from 'react';
import { Card, Spinner, TextInput, Select, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/Navbar';

/**
 * ClubsPage Component
 * Complete page displaying all clubs from District 4465
 */
export default function ClubsPage() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/clubs/public');

                if (!response.ok) {
                    throw new Error('Error al cargar los clubes');
                }

                const data = await response.json();

                // API returns: { content: [...], totalElements, totalPages }
                if (data.content && Array.isArray(data.content)) {
                    setClubs(data.content);
                } else {
                    setClubs([]);
                }
            } catch (err) {
                console.error('Error fetching clubs:', err);
                setError('No se pudieron cargar los clubes. Por favor, intenta nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    // Get unique departments for filter dropdown
    const departments = useMemo(() => {
        const uniqueDepts = [...new Set(clubs.map(club => club.departamento))];
        return uniqueDepts.sort();
    }, [clubs]);

    // Filter clubs based on search query and selected department
    const filteredClubs = useMemo(() => {
        return clubs.filter(club => {
            // Filter by search query (name)
            const matchesSearch = searchQuery.trim() === '' ||
                club.nombre.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter by department
            const matchesDepartment = selectedDepartment === '' ||
                club.departamento === selectedDepartment;

            return matchesSearch && matchesDepartment;
        });
    }, [clubs, searchQuery, selectedDepartment]);

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedDepartment('');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Navigation */}
            <AppNavbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 mt-16">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Clubes del Distrito 4465
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
                        Explora todos los clubes activos de nuestro distrito.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow py-16 bg-gray-50">
                <div className="max-w-screen-xl mx-auto px-4">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col justify-center items-center py-20">
                            <Spinner size="xl" color="info" />
                            <p className="mt-4 text-lg text-gray-600">Cargando clubes...</p>
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
                    {!loading && !error && clubs.length === 0 && (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-600 text-lg">No hay clubes disponibles en este momento.</p>
                        </div>
                    )}

                    {/* Search and Filter Section */}
                    {!loading && !error && clubs.length > 0 && (
                        <>
                            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Search by Name */}
                                    <div className="lg:col-span-2">
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                            Buscar por nombre
                                        </label>
                                        <TextInput
                                            id="search"
                                            type="text"
                                            icon={() => (
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            )}
                                            placeholder="Ej: Rotaract Iquitos..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Filter by Department */}
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                            Filtrar por departamento
                                        </label>
                                        <Select
                                            id="department"
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                            className="w-full"
                                        >
                                            <option value="">Todos los departamentos</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                {/* Active Filters and Clear Button */}
                                {(searchQuery || selectedDepartment) && (
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <span className="text-sm text-gray-600 font-medium">Filtros activos:</span>
                                        {searchQuery && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                                                Búsqueda: "{searchQuery}"
                                            </span>
                                        )}
                                        {selectedDepartment && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                                Departamento: {selectedDepartment}
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
                                    Mostrando <span className="font-semibold text-gray-900">{filteredClubs.length}</span> de {clubs.length} {clubs.length === 1 ? 'club' : 'clubes'}
                                </p>
                            </div>

                            {/* No Results Message */}
                            {filteredClubs.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-600 text-lg mb-2">No se encontraron clubes</p>
                                    <p className="text-gray-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            )}

                            {/* Clubs Grid */}
                            {filteredClubs.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredClubs.map((club) => (
                                        <Card
                                            key={club.id}
                                            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                        >
                                            {/* Icon */}
                                            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-primary-100 rounded-full mx-auto">
                                                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                </svg>
                                            </div>

                                            {/* Club Name */}
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                                                {club.nombre}
                                            </h3>

                                            {/* Location */}
                                            <div className="flex items-center justify-center text-gray-600 mb-3">
                                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm font-medium">
                                                    {club.ciudad}, {club.departamento}
                                                </span>
                                            </div>

                                            {/* Creation Date */}
                                            <div className="flex items-center justify-center text-gray-500 pt-3 border-t border-gray-100">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs">
                                                    Fundado: {new Date(club.fechaCreacion).toLocaleDateString('es-PE', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Active Status Badge */}
                                            {club.activo !== undefined && (
                                                <div className="mt-3 flex justify-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${club.activo
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        <span className={`w-2 h-2 mr-1.5 rounded-full ${club.activo ? 'bg-green-500' : 'bg-gray-500'
                                                            }`}></span>
                                                        {club.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Ver Detalles Button */}
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <Link to={`/club/${club.id}`} className="w-full">
                                                    <Button
                                                        color="light"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        Ver detalles →
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Card>
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
