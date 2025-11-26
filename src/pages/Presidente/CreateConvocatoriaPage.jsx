import { useState } from 'react';
import { Button, Label, TextInput, Textarea, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function CreateConvocatoriaPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        cupoMaximo: '',
        fechaInicioPostulacion: '',
        fechaFinPostulacion: '',
        requisitos: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const validateDates = () => {
        const { fechaInicioPostulacion, fechaFinPostulacion } = formData;
        const inicioPost = new Date(fechaInicioPostulacion);
        const finPost = new Date(fechaFinPostulacion);

        if (finPost <= inicioPost) {
            Swal.fire({
                icon: 'error',
                title: 'Error en fechas',
                text: 'La fecha de fin de postulación debe ser posterior a la fecha de inicio.',
                confirmButtonColor: '#8B0036'
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateDates()) return;

        setLoading(true);

        try {
            const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/convocatorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    ...formData,
                    cupoMaximo: parseInt(formData.cupoMaximo)
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear la convocatoria');
            }

            Swal.fire({
                title: '¡Convocatoria Creada!',
                text: 'La convocatoria se ha creado exitosamente.',
                icon: 'success',
                confirmButtonColor: '#8B0036',
                background: '#1f2937',
                color: '#fff'
            }).then(() => {
                navigate('/presidente/convocatorias');
            });

        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: err.message,
                icon: 'error',
                confirmButtonColor: '#8B0036',
                background: '#1f2937',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 pb-16 min-h-screen bg-neutral-950">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button
                        color="gray"
                        size="sm"
                        className="mb-4"
                        onClick={() => navigate('/presidente/convocatorias')}
                    >
                        <HiArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Convocatorias
                    </Button>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Crear Nueva Convocatoria</h1>
                    <p className="text-gray-400">Complete el formulario para registrar una nueva convocatoria.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 md:p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <div className="mb-2 block">
                                    <Label htmlFor="titulo" value="Título de la Convocatoria" className="text-gray-300" />
                                </div>
                                <TextInput
                                    id="titulo"
                                    type="text"
                                    placeholder="Ej: Convocatoria 2024-I"
                                    required
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="mb-2 block">
                                    <Label htmlFor="descripcion" value="Descripción" className="text-gray-300" />
                                </div>
                                <Textarea
                                    id="descripcion"
                                    placeholder="Detalles de la convocatoria..."
                                    required
                                    rows={4}
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    className="bg-neutral-800 border-neutral-700 text-white focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="mb-2 block">
                                    <Label htmlFor="requisitos" value="Requisitos" className="text-gray-300" />
                                </div>
                                <Textarea
                                    id="requisitos"
                                    placeholder="Requisitos para postular..."
                                    required
                                    rows={3}
                                    value={formData.requisitos}
                                    onChange={handleChange}
                                    className="bg-neutral-800 border-neutral-700 text-white focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="cupoMaximo" value="Cupo Máximo" className="text-gray-300" />
                                </div>
                                <TextInput
                                    id="cupoMaximo"
                                    type="number"
                                    placeholder="0"
                                    required
                                    min="1"
                                    value={formData.cupoMaximo}
                                    onChange={handleChange}
                                    className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="fechaInicioPostulacion" value="Inicio Postulación" className="text-gray-300" />
                                </div>
                                <TextInput
                                    id="fechaInicioPostulacion"
                                    type="date"
                                    required
                                    value={formData.fechaInicioPostulacion}
                                    onChange={handleChange}
                                    className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="fechaFinPostulacion" value="Fin Postulación" className="text-gray-300" />
                                </div>
                                <TextInput
                                    id="fechaFinPostulacion"
                                    type="date"
                                    required
                                    value={formData.fechaFinPostulacion}
                                    onChange={handleChange}
                                    className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-neutral-800">
                            <Button
                                color="gray"
                                onClick={() => navigate('/presidente/convocatorias')}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#8B0036] hover:bg-[#6d002b] text-white border-none"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" light={true} className="mr-2" />
                                        Creando...
                                    </>
                                ) : (
                                    'Crear Convocatoria'
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
