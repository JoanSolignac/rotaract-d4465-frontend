import { Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import { Badge } from 'flowbite-react';
import useFetchClubMetricas from '../../hooks/useFetchClubMetricas';
import CardMetrica from '../../components/CardMetrica';
import ListaResumida from '../../components/ListaResumida';
import { parseLocalDate } from '../../utils/formatDate';

/**
 * Inicio Page - President Dashboard
 * Displays club metrics, convocatorias, and proyectos
 */
export default function Inicio() {
    const { data, loading, error } = useFetchClubMetricas();

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-20 mt-16">
                <Spinner size="xl" color="pink" />
                <p className="mt-4 text-lg text-gray-400">Cargando métricas del club...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center py-20 mt-16">
                <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-lg font-medium mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const { club, presidente, metricas, convocatorias, proyectos } = data;

    return (
        <div className="pt-20 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Hero Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-grow">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                {club.nombre}
                            </h1>
                            <div className="space-y-2 text-gray-400">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-base font-medium">{club.ciudad}, {club.departamento}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-base">Presidente: {presidente.nombre}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-base">
                                        Fundado: {(() => {
                                            const date = parseLocalDate(club.fechaCreacion);
                                            return date.toLocaleDateString('es-PE', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            });
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Badge color={club.activo ? 'success' : 'gray'} size="lg" className="text-sm">
                                {club.activo ? '✓ Activo' : 'Inactivo'}
                            </Badge>
                        </div>
                    </div>
                </motion.div>

                {/* Metrics Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Métricas del Club</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CardMetrica
                            title="Proyectos"
                            value={metricas.totalProyectos}
                            color="primary"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                        <CardMetrica
                            title="Convocatorias"
                            value={metricas.totalConvocatorias}
                            color="yellow"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                            }
                        />
                        <CardMetrica
                            title="Integrantes"
                            value={metricas.totalIntegrantes}
                            color="primary"
                            icon={
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            }
                        />
                    </div>
                </div>

                {/* Convocatorias Section */}
                <div className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Convocatorias Recientes</h2>
                    <ListaResumida items={convocatorias} type="convocatoria" />
                </div>

                {/* Proyectos Section */}
                <div className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Proyectos Recientes</h2>
                    <ListaResumida items={proyectos} type="proyecto" />
                </div>
            </div>
        </div>
    );
}
