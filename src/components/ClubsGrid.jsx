import { useEffect, useState } from 'react';
import { Card, Spinner } from 'flowbite-react';

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
                    setClubs(data.content);
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
        <section className="py-16 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-4">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-center text-gray-900">
                    Nuestros Clubes
                </h2>
                <p className="mb-12 text-center text-lg text-gray-600 max-w-2xl mx-auto">
                    Conoce los clubes que forman parte del Distrito Rotaract 4465
                </p>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Spinner size="lg" color="info" />
                        <span className="ml-3 text-gray-600">Cargando clubes...</span>
                    </div>
                )}

                {error && !loading && (
                    <p className="text-center text-red-600 text-lg py-4">{error}</p>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs.map((club) => (
                            <Card key={club.id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-primary-100 rounded-full">
                                    <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {club.nombre}
                                </h3>

                                <div className="flex items-center text-gray-600 mb-3">
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

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Fundado el: {club.fechaCreacion}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
