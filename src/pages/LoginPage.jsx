import { useState } from 'react';
import { Button, Label, TextInput, Spinner } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import AppNavbar from '../components/Navbar';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

        try {
            const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : (data.message || 'Credenciales incorrectas.');
                throw new Error(errorMessage);
            }

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('correo', data.correo);
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('nombre', data.nombre);

            // Redirect based on user role
            if (data.rol === 'INTERESADO') {
                navigate('/interesado');
            } else if (data.rol === 'PRESIDENTE') {
                navigate('/presidente');
            } else if (data.rol === 'SOCIO') {
                navigate('/socio');
            } else {
                navigate('/convocatorias');
            }


        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Ocurrió un error inesperado.',
                confirmButtonColor: '#E20F7A',
                background: '#171717',
                color: '#ffffff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#050506]">
            <AppNavbar />

            <div className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="bg-neutral-900 rounded-2xl shadow-2xl shadow-black/50 border border-neutral-800 p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-white mb-2">Bienvenido</h2>
                            <p className="text-gray-400">Ingresa a tu cuenta Rotaract</p>
                        </div>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="correo" value="Correo electrónico" className="text-gray-300" />
                                </div>
                                <TextInput
                                    id="correo"
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    required
                                    value={formData.correo}
                                    onChange={handleChange}
                                    className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600"
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="contrasena" value="Contraseña" className="text-gray-300" />
                                </div>
                                <div className="relative">
                                    <TextInput
                                        id="contrasena"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        required
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600 [&>div>input]:pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="text-right mt-1">
                                    <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-400 hover:underline transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-2 bg-primary-600 hover:bg-primary-700 text-white border-none focus:ring-4 focus:ring-primary-500 shadow-lg shadow-primary-600/20 transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" light={true} className="mr-2" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Ingresar'
                                )}
                            </Button>
                        </form>

                        <div className="text-center mt-6 text-sm text-gray-400">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/register" className="text-primary-500 hover:text-primary-400 hover:underline font-semibold transition-colors">
                                Regístrate aquí
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
