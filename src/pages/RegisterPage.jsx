import { useState } from 'react';
import { Card, Button, Label, TextInput, Spinner } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import AppNavbar from '../components/Navbar';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        ciudad: '',
        fechaNacimiento: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic Validation
        if (!formData.nombre || !formData.correo || !formData.contrasena || !formData.ciudad || !formData.fechaNacimiento) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
                confirmButtonColor: '#D91B5C',
                background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
            });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : (data.message || 'Error al registrarse.');
                throw new Error(errorMessage);
            }

            // Success - Show alert and redirect
            await Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
                confirmButtonColor: '#D91B5C',
                background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
            });

            navigate('/login');

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Ocurrió un error inesperado al registrarse.',
                confirmButtonColor: '#D91B5C',
                background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <AppNavbar />

            <div className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-1/4 -right-20 w-96 h-96 bg-rotaract-magenta/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-rotaract-gold/10 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md z-10"
                >
                    <Card className="shadow-xl border-none dark:bg-gray-800">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Crear Cuenta</h2>
                            <p className="text-gray-600 dark:text-gray-400">Únete a Rotaract Distrito 4465</p>
                        </div>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="nombre" value="Nombre completo" className="dark:text-gray-300" />
                                </div>
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    placeholder="Ej: Juan Pérez"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="correo" value="Correo electrónico" className="dark:text-gray-300" />
                                </div>
                                <TextInput
                                    id="correo"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    required
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className="dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="contrasena" value="Contraseña" className="dark:text-gray-300" />
                                </div>
                                <TextInput
                                    id="contrasena"
                                    type="password"
                                    placeholder="********"
                                    required
                                    minLength={6}
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    className="dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="ciudad" value="Ciudad" className="dark:text-gray-300" />
                                </div>
                                <TextInput
                                    id="ciudad"
                                    type="text"
                                    placeholder="Ej: Lima"
                                    required
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    className="dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="fechaNacimiento" value="Fecha de Nacimiento" className="dark:text-gray-300" />
                                </div>
                                <TextInput
                                    id="fechaNacimiento"
                                    type="date"
                                    required
                                    value={formData.fechaNacimiento}
                                    onChange={handleChange}
                                    className="dark:bg-gray-700"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-2 bg-rotaract-magenta hover:bg-rotaract-magenta/90 text-white focus:ring-4 focus:ring-rotaract-magenta/50 transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" light={true} className="mr-2" />
                                        Registrando...
                                    </>
                                ) : (
                                    'Registrarse'
                                )}
                            </Button>
                        </form>

                        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="text-rotaract-magenta hover:text-rotaract-magenta/80 hover:underline font-semibold transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
