import { useState, useEffect } from 'react';
import { Card, Spinner } from 'flowbite-react';

export default function MetricsSection() {
    const [metrics, setMetrics] = useState({ clubes: 0, convocatorias: 0, proyectos: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);

                const [clubesRes, convocatoriasRes, proyectosRes] = await Promise.all([
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/clubs/public'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/convocatorias/public'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/proyectos/public'),
                ]);

                const clubesData = await clubesRes.json();
                const convocatoriasData = await convocatoriasRes.json();
                const proyectosData = await proyectosRes.json();

                // Todos tus endpoints tienen este formato:
                // {
                //   content: [],
                //   totalElements: number,
                //   totalPages: number,
                //   ...
                // }

                setMetrics({
                    clubes: clubesData.totalElements ?? 0,
                    convocatorias: convocatoriasData.totalElements ?? 0,
                    proyectos: proyectosData.totalElements ?? 0,
                });

                setError(null);
            } catch (err) {
                console.error("Error fetching metrics:", err);
                setError("No se pudieron cargar las métricas");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const metricCards = [
        {
            title: 'Clubes Registrados',
            value: metrics.clubes,
            icon: (
                <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            bgColor: "bg-primary-50"
        },
        {
            title: 'Convocatorias Activas',
            value: metrics.convocatorias,
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            bgColor: "bg-blue-50"
        },
        {
            title: 'Proyectos Disponibles',
            value: metrics.proyectos,
            icon: (
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            bgColor: "bg-green-50"
        }
    ];

    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-screen-xl mx-auto px-4">
                <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-900">
                    Nuestro Impacto en Números
                </h2>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Spinner size="xl" color="failure" />
                        <span className="ml-3 text-lg text-gray-600">Cargando métricas...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-12">
                        <p className="text-red-600 text-lg">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {metricCards.map((metric, index) => (
                            <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                                <div className={`mx-auto mb-4 w-20 h-20 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                                    {metric.icon}
                                </div>
                                <h3 className="text-4xl font-extrabold">{metric.value}</h3>
                                <p className="text-lg text-gray-600">{metric.title}</p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
