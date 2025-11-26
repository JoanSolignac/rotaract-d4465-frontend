import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MetricsSection() {
    const [metrics, setMetrics] = useState({
        totalUsuarios: 0,
        clubes: 0,
        convocatorias: 0,
        proyectos: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);

                const [usuariosRes, clubesRes, convocatoriasRes, proyectosRes] = await Promise.all([
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/miembros/public/total'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/clubs/public'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/convocatorias/public'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/proyectos/public'),
                ]);

                const usuariosData = await usuariosRes.json();
                const clubesData = await clubesRes.json();
                const convocatoriasData = await convocatoriasRes.json();
                const proyectosData = await proyectosRes.json();

                setMetrics({
                    totalUsuarios: usuariosData.totalUsuarios ?? 0,
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
            title: 'Total de Usuarios',
            value: metrics.totalUsuarios,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: "text-white",
            bg: "bg-primary-600"
        },
        {
            title: 'Clubes Registrados',
            value: metrics.clubes,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: "text-white",
            bg: "bg-primary-600"
        },
        {
            title: 'Convocatorias Activas',
            value: metrics.convocatorias,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            color: "text-white",
            bg: "bg-primary-600"
        },
        {
            title: 'Proyectos Disponibles',
            value: metrics.proyectos,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: "text-white",
            bg: "bg-primary-600"
        }
    ];

    return (
        <section className="py-24 bg-[#050506]">
            <div className="max-w-screen-xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Nuestro Impacto en Números
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Juntos estamos construyendo un futuro mejor a través del servicio y el liderazgo.
                    </p>
                </motion.div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-12">
                        <p className="text-red-400 text-lg">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {metricCards.map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-neutral-900 rounded-2xl p-8 shadow-lg shadow-black/20 hover:shadow-xl transition-all hover:-translate-y-1 border border-neutral-800 flex flex-col items-center text-center"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center mb-6 shadow-lg shadow-primary-600/20`}>
                                    {metric.icon}
                                </div>
                                <h3 className="text-4xl font-extrabold text-white mb-2">
                                    {metric.value}
                                </h3>
                                <p className="text-lg text-gray-400 font-medium">
                                    {metric.title}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
