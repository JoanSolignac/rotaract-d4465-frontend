import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Spinner, Alert } from 'flowbite-react';
import { motion } from 'framer-motion';
import { HiEye, HiInformationCircle } from 'react-icons/hi';
import { get } from '../../services/fetchClient';

export default function HistorialAsistenciasPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadHistorial();
    }, []);

    const loadHistorial = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await get('/api/v1/asistencias/historial');
            setData(response);
        } catch (err) {
            console.error('Error loading historial:', err);
            setError(err.message || 'No se pudo cargar el historial de asistencias');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} – ${hours}:${minutes}`;
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'PRESENTE':
                return 'text-green-600 font-semibold';
            case 'FALTA':
                return 'text-red-600 font-semibold';
            case 'NO_REGISTRADO':
                return 'text-gray-600 font-semibold';
            default:
                return 'text-gray-600';
        }
    };

    const getEstadoLabel = (estado) => {
        switch (estado) {
            case 'PRESENTE':
                return 'Presente';
            case 'FALTA':
                return 'Falta';
            case 'NO_REGISTRADO':
                return 'No Registrado';
            default:
                return estado;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Historial de Asistencias
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Revisa tu registro de asistencias en los proyectos del club
                        </p>
                    </div>

                    {error && (
                        <Alert color="failure" icon={HiInformationCircle} className="mb-4">
                            <span className="font-medium">Error:</span> {error}
                        </Alert>
                    )}

                    {!error && data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Aún no registras asistencias en ningún proyecto.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Proyecto</Table.HeadCell>
                                    <Table.HeadCell>Estado</Table.HeadCell>
                                    <Table.HeadCell>Fecha</Table.HeadCell>
                                    <Table.HeadCell>Acción</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {data.map((asistencia) => (
                                        <Table.Row
                                            key={asistencia.asistenciaId}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {asistencia.proyectoTitulo}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className={getEstadoColor(asistencia.estado)}>
                                                    {getEstadoLabel(asistencia.estado)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell className="text-gray-600 dark:text-gray-400">
                                                {formatDate(asistencia.fechaRegistro)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => navigate(`/proyectos/${asistencia.proyectoId}`)}
                                                >
                                                    <HiEye className="mr-2 h-4 w-4" />
                                                    Ver Proyecto
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
