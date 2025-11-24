import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Badge, Button, Table } from 'flowbite-react';
import { motion } from 'framer-motion';
import { formatLocalDate, parseLocalDate } from '../utils/formatDate';
import InteresadoNavbar from '../components/InteresadoNavbar';

/**
 * InteresadoClubPage Component
 * Detailed view of a specific club for authenticated interesado users
 */
export default function InteresadoClubPage() {
    const { id } = useParams();
    const [clubData, setClubData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `https://rotaractd4465api.up.railway.app/api/v1/clubs/public/${id}/detalle?page=${currentPage}&size=${pageSize}`
                );

                if (!response.ok) {
                    throw new Error('Error al cargar los detalles del club');
                }

                const data = await response.json();
                setClubData(data);
            } catch (err) {
                console.error('Error fetching club details:', err);
                setError('No se pudieron cargar los detalles del club. Por favor, intenta nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchClubDetails();
    }, [id, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#050506]">
                <InteresadoNavbar />
                <div className="flex-grow flex flex-col justify-center items-center py-20 mt-16">
                    <Spinner size="xl" color="pink" />
                    <p className="mt-4 text-lg text-gray-400">Cargando detalles del club...</p>
                </div>
            </div>
        );
    }

    if (error || !clubData) {
        return (
            <div className="min-h-screen flex flex-col bg-[#050506]">
                <InteresadoNavbar />
                <div className="flex-grow flex flex-col justify-center items-center py-20 mt-16">
                    <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-400 text-lg font-medium mb-4">{error || 'Club no encontrado'}</p>
                    <Link to="/interesado/clubs">
                        <Button className="bg-neutral-800 hover:bg-neutral-700 text-white border-none">Volver a clubes</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const { club, presidente, metricas, integrantes, convocatorias, proyectos } = clubData;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col bg-[#050506]"
        >
            <InteresadoNavbar />

            <main className="flex-grow pt-20 pb-16">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Breadcrumb Navigation */}
                    <nav className="mb-6 flex items-center text-sm text-gray-400">
                        <Link to="/interesado" className="hover:text-primary-600 transition-colors">Inicio</Link>
                        <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link to="/interesado/clubs" className="hover:text-primary-600 transition-colors">Clubes</Link>
                        <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white font-medium">{club.nombre}</span>
                    </nav>

                    {/* Club Header Section */}
                    <div className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-8 mb-8">
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
                    </div>

                    {/* Presidente Section */}
                    <div className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Presidente
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Nombre</p>
                                <p className="text-lg font-semibold text-white">{presidente.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Correo Institucional</p>
                                <a href={`mailto:${presidente.correo}`} className="text-lg font-medium text-primary-600 hover:text-primary-700 hover:underline">
                                    {presidente.correo}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Métricas del Club</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800">
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-600/20">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-4xl font-extrabold text-white mb-2">{metricas.totalProyectos}</h3>
                                <p className="text-base font-medium text-gray-400">Proyectos</p>
                            </div>

                            <div className="text-center bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800">
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-4xl font-extrabold text-white mb-2">{metricas.totalConvocatorias}</h3>
                                <p className="text-base font-medium text-gray-400">Convocatorias</p>
                            </div>

                            <div className="text-center bg-neutral-900 rounded-2xl p-6 shadow-lg shadow-black/20 border border-neutral-800">
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-600/20">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-4xl font-extrabold text-white mb-2">{metricas.totalIntegrantes}</h3>
                                <p className="text-base font-medium text-gray-400">Integrantes</p>
                            </div>
                        </div>
                    </div>

                    {/* Integrantes Section (Paginated) */}
                    <div className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Integrantes</h2>
                        {integrantes.content && integrantes.content.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <Table hoverable>
                                        <Table.Head>
                                            <Table.HeadCell>Nombre</Table.HeadCell>
                                            <Table.HeadCell>Correo Electrónico</Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                            {integrantes.content.map((integrante) => (
                                                <Table.Row key={integrante.id} className="bg-neutral-800/50 border-neutral-700">
                                                    <Table.Cell className="font-medium text-white">
                                                        {integrante.nombre}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <a href={`mailto:${integrante.correo}`} className="text-primary-600 hover:underline">
                                                            {integrante.correo}
                                                        </a>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>

                                {/* Pagination Controls */}
                                {integrantes.totalPages > 1 && (
                                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <p className="text-sm text-gray-400">
                                            Mostrando página {integrantes.page + 1} de {integrantes.totalPages}
                                            ({integrantes.totalElements} integrantes en total)
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                color="gray"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={integrantes.first}
                                            >
                                                ← Anterior
                                            </Button>
                                            <Button
                                                color="gray"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={integrantes.last}
                                            >
                                                Siguiente →
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No hay integrantes registrados.</p>
                        )}
                    </div>

                    {/* Convocatorias Section */}
                    <div className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Convocatorias</h2>
                        {convocatorias && convocatorias.length > 0 ? (
                            <div className="space-y-4">
                                {convocatorias.map((convocatoria) => (
                                    <div key={convocatoria.id} className="border border-neutral-700 rounded-xl p-4 hover:border-primary-600/50 hover:shadow-lg hover:shadow-black/20 transition-all bg-neutral-800/30">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-bold text-white mb-2">{convocatoria.titulo}</h3>
                                                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>
                                                            Postulación: {formatLocalDate(convocatoria.fechaInicioPostulacion)} - {formatLocalDate(convocatoria.fechaFinPostulacion)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge color={convocatoria.estado === 'ABIERTA' ? 'success' : 'gray'}>
                                                {convocatoria.estado}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No hay convocatorias disponibles.</p>
                        )}
                    </div>

                    {/* Proyectos Section */}
                    <div className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Proyectos</h2>
                        {proyectos && proyectos.length > 0 ? (
                            <div className="space-y-4">
                                {proyectos.map((proyecto) => (
                                    <div key={proyecto.id} className="border border-neutral-700 rounded-xl p-4 hover:border-primary-600/50 hover:shadow-lg hover:shadow-black/20 transition-all bg-neutral-800/30">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-bold text-white mb-2">{proyecto.titulo}</h3>
                                                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>
                                                            Proyecto: {formatLocalDate(proyecto.fechaInicioProyecto)} - {formatLocalDate(proyecto.fechaFinProyecto)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge color={proyecto.estado === 'EN_PROGRESO' ? 'info' : proyecto.estado === 'COMPLETADO' ? 'success' : 'gray'}>
                                                {proyecto.estado}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No hay proyectos disponibles.</p>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="flex justify-center">
                        <Link to="/interesado/clubs">
                            <Button className="bg-neutral-800 hover:bg-neutral-700 text-white border-none" size="lg">
                                ← Volver a Clubes
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </motion.div>
    );
}
