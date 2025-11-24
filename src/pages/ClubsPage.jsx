import { useState, useEffect, useMemo } from 'react';
import { Card, Spinner, TextInput, Select, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiLocationMarker, HiCalendar } from 'react-icons/hi';
import AppNavbar from '../components/Navbar';

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

    const departments = useMemo(() => {
        const uniqueDepts = [...new Set(clubs.map(club => club.departamento))];
        return uniqueDepts.sort();
    }, [clubs]);

    const filteredClubs = useMemo(() => {
        return clubs.filter(club => {
            const matchesSearch = searchQuery.trim() === '' ||
                club.nombre.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDepartment = selectedDepartment === '' ||
                club.departamento === selectedDepartment;

            return matchesSearch && matchesDepartment;
        });
    }, [clubs, searchQuery, selectedDepartment]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedDepartment('');
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
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        Clubes del Distrito 4465
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light"
                    >
                        Explora nuestra red de clubes y encuentra el más cercano a ti.
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow py-12 px-4">
                <div className="max-w-screen-xl mx-auto">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col justify-center items-center py-20">
                            <Spinner size="xl" color="pink" />
                            <p className="mt-4 text-lg text-gray-400">Cargando clubes...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="text-center py-20">
                            <p className="text-red-400 text-lg font-medium">{error}</p>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && !error && (
                        <>
                            {/* Filters */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-10 bg-neutral-900 p-6 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                                            Buscar por nombre
                                        </label>
                                        <TextInput
                                            id="search"
                                            type="text"
                                            icon={HiSearch}
                                            placeholder="Ej: Rotaract Iquitos..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">
                                            Filtrar por departamento
                                        </label>
                                        <Select
                                            id="department"
                                            icon={HiFilter}
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                            className="[&>div>select]:bg-neutral-800 [&>div>select]:border-neutral-700 [&>div>select]:text-white"
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

                                {(searchQuery || selectedDepartment) && (
                                    <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-800">
                                        <span className="text-sm text-gray-400">Filtros activos:</span>
                                        {searchQuery && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-900/20 text-primary-400 border border-primary-900/30">
                                                Búsqueda: "{searchQuery}"
                                            </span>
                                        )}
                                        {selectedDepartment && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-900/20 text-yellow-400 border border-yellow-900/30">
                                                Departamento: {selectedDepartment}
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

                            {/* Results Count */}
                            <div className="mb-8 flex items-center justify-between">
                                <p className="text-gray-400">
                                    Mostrando <span className="font-bold text-white">{filteredClubs.length}</span> clubes
                                </p>
                            </div>

                            {/* Grid */}
                            {filteredClubs.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {filteredClubs.map((club) => (
                                        <motion.div key={club.id} variants={itemVariants}>
                                            <div className="h-full bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800 hover:border-primary-600/50 transition-all duration-300 group flex flex-col">
                                                <div className="flex items-center justify-center w-20 h-20 mb-6 bg-neutral-800 rounded-full mx-auto group-hover:scale-110 transition-transform duration-300 shadow-inner shadow-black/50">
                                                    <span className="text-3xl">🤝</span>
                                                </div>

                                                <h3 className="text-xl font-bold text-white mb-4 text-center group-hover:text-primary-400 transition-colors">
                                                    {club.nombre}
                                                </h3>

                                                <div className="space-y-3 mb-6 flex-grow">
                                                    <div className="flex items-center justify-center text-gray-300">
                                                        <HiLocationMarker className="w-5 h-5 mr-2 text-primary-500" />
                                                        <span className="text-sm">{club.ciudad}, {club.departamento}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center text-gray-400">
                                                        <HiCalendar className="w-5 h-5 mr-2 text-yellow-500" />
                                                        <span className="text-sm">
                                                            Fundado: {new Date(club.fechaCreacion).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-6 border-t border-neutral-800">
                                                    <Link to={`/club/${club.id}`}>
                                                        <Button
                                                            className="w-full bg-neutral-800 hover:bg-primary-600 text-white border-none rounded-xl transition-colors duration-300"
                                                        >
                                                            Ver detalles
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-20 bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800">
                                    <p className="text-gray-400 text-lg">No se encontraron clubes con los filtros seleccionados.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
