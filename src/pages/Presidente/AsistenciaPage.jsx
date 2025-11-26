import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Checkbox, Spinner, Alert } from 'flowbite-react';
import { HiArrowLeft, HiSave, HiUserGroup } from 'react-icons/hi';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
        <p className="text-gray-400 text-lg mb-6">
            No tienes permisos para ver esta página. Solo el Presidente puede gestionar la asistencia.
        </p>
        <Button color="gray" href="/dashboard/presidente/proyectos">Volver a Proyectos</Button>
    </div>
);

export default function AsistenciaPage() {
    const { proyectoId } = useParams();
    const navigate = useNavigate();
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Simulación de rol
    const userRole = "PRESIDENTE";

    useEffect(() => {
        if (userRole === "PRESIDENTE") {
            fetchAsistencias();
        }
    }, [proyectoId]);

    const fetchAsistencias = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://rotaractd4465api.up.railway.app/api/v1/proyectos/${proyectoId}/asistencia/lista`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }
            );

            if (!response.ok) throw new Error('Error al cargar la lista de asistencia');

            const data = await response.json();
            setAsistencias(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePresente = (usuarioId) => {
        setAsistencias(prev =>
            prev.map(a =>
                a.usuarioId === usuarioId ? { ...a, presente: !a.presente } : a
            )
        );
    };

    const guardarAsistencia = async () => {
        setSaving(true);
        setSuccessMsg(null);
        setError(null);

        const usuariosPresentesIds = asistencias
            .filter(a => a.presente)
            .map(a => a.usuarioId);

        const payload = { usuariosPresentesIds };

        try {
            const response = await fetch(
                `https://rotaractd4465api.up.railway.app/api/v1/proyectos/${proyectoId}/asistencia/guardar`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) throw new Error('Error al guardar la asistencia');

            setSuccessMsg('Asistencia guardada correctamente');

            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'La asistencia se ha registrado con éxito.',
                confirmButtonColor: '#8B0036'
            });
        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
                confirmButtonColor: '#8B0036'
            });
        } finally {
            setSaving(false);
        }
    };

    if (userRole !== "PRESIDENTE") {
        return <AccessDenied />;
    }

    return (
        <div className="pt-20 pb-16 min-h-screen bg-neutral-950">
            <div className="max-w-4xl mx-auto px-4">

                {/* Back Button */}
                <div className="mb-6 flex items-center justify-between">
                    <Button
                        color="gray"
                        size="sm"
                        onClick={() => navigate('/presidente/proyectos')}
                        className="flex items-center gap-2"
                    >
                        <HiArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Proyectos
                    </Button>
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center md:text-left"
                >
                    <h1 className="text-3xl font-extrabold text-white mb-2">
                        Registro de Asistencia
                    </h1>
                    <p className="text-gray-400">
                        Gestiona la asistencia de los socios inscritos en este proyecto.
                    </p>
                </motion.div>

                {/* Error / Success */}
                {error && (
                    <Alert color="failure" className="mb-6" onDismiss={() => setError(null)}>
                        <span className="font-medium">Error:</span> {error}
                    </Alert>
                )}
                {successMsg && (
                    <Alert color="success" className="mb-6" onDismiss={() => setSuccessMsg(null)}>
                        <span className="font-medium">Éxito:</span> {successMsg}
                    </Alert>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="xl" color="pink" />
                    </div>
                ) : asistencias.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
                        <HiUserGroup className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                        <p className="text-gray-400 text-lg">No hay socios inscritos en este proyecto.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="grid gap-4">
                            {asistencias.map((socio) => (
                                <Card
                                    key={socio.usuarioId}
                                    className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <h5 className="text-lg font-bold tracking-tight text-white">
                                                {socio.usuarioNombreCompleto}
                                            </h5>
                                            <p className="font-normal text-gray-400 text-sm">
                                                {socio.usuarioCorreo}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label
                                                htmlFor={`attendance-${socio.usuarioId}`}
                                                className={`text-sm font-medium ${socio.presente ? 'text-green-400' : 'text-gray-500'}`}
                                            >
                                                {socio.presente ? 'Presente' : 'Ausente'}
                                            </label>

                                            <Checkbox
                                                id={`attendance-${socio.usuarioId}`}
                                                checked={socio.presente}
                                                onChange={() => togglePresente(socio.usuarioId)}
                                                className="w-6 h-6 text-primary-600 bg-neutral-800 border-neutral-600 focus:ring-primary-600 focus:ring-2"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="sticky bottom-6 bg-neutral-950/80 backdrop-blur-sm p-4 rounded-xl border border-neutral-800 flex justify-end gap-4 shadow-lg">
                            <Button
                                color="gray"
                                onClick={() => navigate('/presidente/proyectos')}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>

                            <Button
                                onClick={guardarAsistencia}
                                isProcessing={saving}
                                disabled={saving}
                                className="bg-[#8B0036] hover:bg-[#6d002a] text-white"
                            >
                                <HiSave className="mr-2 h-5 w-5" />
                                Guardar Asistencia
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
