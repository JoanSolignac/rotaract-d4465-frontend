import { useState, useEffect } from 'react';
import { Button, Label, TextInput, Spinner } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { HiEye, HiEyeOff, HiLockClosed } from 'react-icons/hi';
import AppNavbar from '../components/Navbar';

/**
 * ResetPasswordPage Component
 * Allows users to reset their password using a token from email
 */
export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        nuevaContrasena: '',
        confirmarContrasena: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Extract token from URL on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('token');

        if (!tokenParam) {
            Swal.fire({
                icon: 'error',
                title: 'Token inválido',
                text: 'No se encontró un token válido. Por favor, solicita un nuevo enlace de recuperación.',
                confirmButtonColor: '#E51A4C',
                background: '#171717',
                color: '#ffffff'
            }).then(() => {
                navigate('/forgot-password');
            });
        } else {
            setToken(tokenParam);
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
        // Clear error for this field when user types
        if (errors[id]) {
            setErrors({
                ...errors,
                [id]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate password length (minimum 6 characters)
        if (formData.nuevaContrasena.length < 6) {
            newErrors.nuevaContrasena = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validate passwords match
        if (formData.nuevaContrasena !== formData.confirmarContrasena) {
            newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    nuevaContrasena: formData.nuevaContrasena
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMessage = data.message || data.errors?.[0] || 'No se pudo restablecer la contraseña.';
                throw new Error(errorMessage);
            }

            // Success - show message and redirect to login
            Swal.fire({
                icon: 'success',
                title: '¡Contraseña restablecida!',
                text: 'Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio de sesión.',
                confirmButtonColor: '#8C1D40',
                background: '#171717',
                color: '#ffffff',
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                navigate('/login');
            });

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Ocurrió un error inesperado.',
                confirmButtonColor: '#E51A4C',
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
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#8C1D40]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#E51A4C]/10 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="bg-neutral-900 rounded-2xl shadow-2xl shadow-black/50 border border-neutral-800 p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8C1D40]/10 rounded-full mb-4">
                                <HiLockClosed className="w-8 h-8 text-[#8C1D40]" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Restablecer contraseña</h2>
                            <p className="text-gray-400">Ingresa tu nueva contraseña</p>
                        </div>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            {/* New Password Field */}
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="nuevaContrasena" value="Nueva contraseña" className="text-gray-300" />
                                </div>
                                <div className="relative">
                                    <TextInput
                                        id="nuevaContrasena"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        value={formData.nuevaContrasena}
                                        onChange={handleChange}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-[#8C1D40] [&>div>input:focus]:ring-[#8C1D40] [&>div>input]:pr-10"
                                        color={errors.nuevaContrasena ? 'failure' : 'gray'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.nuevaContrasena && (
                                    <p className="mt-1 text-sm text-red-500">{errors.nuevaContrasena}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="confirmarContrasena" value="Confirmar contraseña" className="text-gray-300" />
                                </div>
                                <div className="relative">
                                    <TextInput
                                        id="confirmarContrasena"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Repite tu contraseña"
                                        required
                                        value={formData.confirmarContrasena}
                                        onChange={handleChange}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-[#8C1D40] [&>div>input:focus]:ring-[#8C1D40] [&>div>input]:pr-10"
                                        color={errors.confirmarContrasena ? 'failure' : 'gray'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmarContrasena && (
                                    <p className="mt-1 text-sm text-red-500">{errors.confirmarContrasena}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-2 bg-[#8C1D40] hover:bg-[#E51A4C] text-white border-none focus:ring-4 focus:ring-[#8C1D40]/50 shadow-lg shadow-[#8C1D40]/20 transition-all"
                                disabled={loading || !token}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" light={true} className="mr-2" />
                                        Cambiando contraseña...
                                    </>
                                ) : (
                                    'Cambiar contraseña'
                                )}
                            </Button>
                        </form>

                        {/* Back to Login Link */}
                        <div className="text-center mt-6 text-sm text-gray-400">
                            ¿Recordaste tu contraseña?{' '}
                            <Link to="/login" className="text-[#8C1D40] hover:text-[#E51A4C] hover:underline font-semibold transition-colors">
                                Inicia sesión
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
