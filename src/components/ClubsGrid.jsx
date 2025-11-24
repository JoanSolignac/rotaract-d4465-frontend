import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Clubs Grid – Fetches clubs from backend and displays them
 */
export default function ClubsGrid() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                setLoading(true);

                const res = await fetch('https://rotaractd4465api.up.railway.app/api/v1/clubs/public');
                const data = await res.json();

                // Esperamos: { content: [...] }
                if (Array.isArray(data.content)) {
                    setClubs(data.content.slice(0, 6)); // Show only first 6 clubs on landing
                } else {
                    setClubs([]);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching clubs:', err);
                setError('No se pudieron cargar los clubes.');
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    return (
        <section className="py-20 bg-gray-50 dark:bg-neutral-800/50 transition-colors duration-300">
            <div className="max-w-screen-xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Nuestros Clubes
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Conoce los clubes que forman parte del Distrito Rotaract 4465 y encuentra el más cercano a ti.
                    </p>
                </motion.div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando clubes...</span>
                    </div>
                )}

                {error && !loading && (
                    <p className="text-center text-red-600 dark:text-red-400 text-lg py-4">{error}</p>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {clubs.map((club, index) => (
                            <motion.div
                                key={club.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 dark:border-neutral-700"
                            >
                                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl mx-auto">
                                    <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                                    {club.nombre}
                                </h3>

                                <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-4">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>

                                    <span className="text-sm font-medium">
                                        {club.ciudad}, {club.departamento}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 dark:border-neutral-700 pt-4 text-center">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Fundado el: <span className="font-medium text-gray-900 dark:text-white">{club.fechaCreacion}</span>
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
