import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from 'flowbite-react';
import { HiUsers, HiOfficeBuilding, HiClipboardList, HiBriefcase } from 'react-icons/hi';

/**
 * Dashboard Component for District Representative
 * Shows personalized greeting and district metrics
 */
export default function Dashboard() {
    const [representative, setRepresentative] = useState(null);
    const [metrics, setMetrics] = useState({
        totalUsuarios: 0,
        totalClubes: 0,
        totalProyectos: 0,
        totalConvocatorias: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [repRes, usersRes, clubsRes, projectsRes, convocatoriasRes] = await Promise.all([
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/miembros/public/representante'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/miembros/public/total'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/clubs/public'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/proyectos/public'),
                    fetch('https://rotaractd4465api.up.railway.app/api/v1/convocatorias/public'),
                ]);

                const repData = await repRes.json();
                const usersData = await usersRes.json();
                const clubsData = await clubsRes.json();
                const projectsData = await projectsRes.json();
                const convocatoriasData = await convocatoriasRes.json();

                setRepresentative(repData);
                setMetrics({
                    totalUsuarios: usersData.totalUsuarios ?? 0,
                    totalClubes: clubsData.totalElements ?? 0,
                    totalProyectos: projectsData.totalElements ?? 0,
                    totalConvocatorias: convocatoriasData.totalElements ?? 0,
                });

                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('No se pudieron cargar los datos del dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const metricCards = [
        {
            title: 'Total de Usuarios',
            value: metrics.totalUsuarios,
            icon: HiUsers,
            color: 'text-[#8C1D40]',
            bg: 'bg-[#8C1D40]/10'
        },
        {
            title: 'Clubes Registrados',
            value: metrics.totalClubes,
            icon: HiOfficeBuilding,
            color: 'text-[#E51A4C]',
            bg: 'bg-[#E51A4C]/10'
        },
        {
            title: 'Proyectos Disponibles',
            value: metrics.totalProyectos,
            icon: HiBriefcase,
            color: 'text-[#8C1D40]',
            bg: 'bg-[#8C1D40]/10'
        },
        {
            title: 'Convocatorias Activas',
            value: metrics.totalConvocatorias,
            icon: HiClipboardList,
            color: 'text-[#E51A4C]',
            bg: 'bg-[#E51A4C]/10'
        }
    ];

    return (
        <div className="min-h-screen bg-[#050506] pt-24 pb-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-20">
                        <Spinner size="xl" color="pink" />
                        <p className="mt-4 text-lg text-gray-400">Cargando dashboard...</p>
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
                        {/* Welcome Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-12"
                        >
                            <div className="bg-gradient-to-r from-[#8C1D40] to-[#E51A4C] rounded-2xl p-8 shadow-2xl shadow-black/50">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                                    Bienvenido, Representante Distrital
                                </h1>
                                <p className="text-xl text-white/90 font-medium">
                                    {representative?.nombre || 'Cargando...'}
                                </p>
                                {representative?.correo && (
                                    <p className="text-white/70 mt-2">{representative.correo}</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Metrics Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-12"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                Métricas Distritales
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {metricCards.map((metric, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center mb-4`}>
                                            <metric.icon className={`w-6 h-6 ${metric.color}`} />
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
                                            {metric.value}
                                        </h3>
                                        <p className="text-sm text-gray-600 font-medium">
                                            {metric.title}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                Acciones Rápidas
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <a
                                    href="/representante/clubes"
                                    className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-[#8C1D40] transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-[#8C1D40]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <HiOfficeBuilding className="w-7 h-7 text-[#8C1D40]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#E51A4C] transition-colors">
                                                Gestionar Clubes
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Ver, crear y administrar clubes del distrito
                                            </p>
                                        </div>
                                    </div>
                                </a>

                                <a
                                    href="/representante/clubes/crear"
                                    className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-[#E51A4C] transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-[#E51A4C]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-7 h-7 text-[#E51A4C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#E51A4C] transition-colors">
                                                Crear Nuevo Club
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Registrar un nuevo club en el distrito
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
