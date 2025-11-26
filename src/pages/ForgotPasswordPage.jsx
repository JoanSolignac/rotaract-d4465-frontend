import { useState } from 'react';
import { Button, Label, TextInput, Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import AppNavbar from '../components/Navbar';

/**
 * ForgotPasswordPage Component
 * Allows users to request a password recovery email
 */
export default function ForgotPasswordPage() {
    const [correo, setCorreo] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo })
            });

            // Always show success message for security (don't reveal if email exists)
            if (response.ok || response.status === 404) {
                setEmailSent(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Correo enviado',
                    text: 'Si el correo está registrado, te enviamos un enlace de recuperación. Revisa tu bandeja de entrada.',
                    confirmButtonColor: '#8C1D40',
                    background: '#171717',
                    color: '#ffffff'
                });
            } else {
                // Handle unexpected errors
                const data = await response.json().catch(() => ({}));
                const errorMessage = data.message || data.errors?.[0] || 'Ocurrió un error. Intenta nuevamente.';
                throw new Error(errorMessage);
            }
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
                                <HiMail className="w-8 h-8 text-[#8C1D40]" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">¿Olvidaste tu contraseña?</h2>
                            <p className="text-gray-400">
                                {emailSent
                                    ? 'Revisa tu correo electrónico'
                                    : 'Ingresa tu correo y te enviaremos un enlace de recuperación'
                                }
                            </p>
                        </div>

                        {!emailSent ? (
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
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-[#8C1D40] [&>div>input:focus]:ring-[#8C1D40]"
                                        disabled={loading}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-2 bg-[#8C1D40] hover:bg-[#E51A4C] text-white border-none focus:ring-4 focus:ring-[#8C1D40]/50 shadow-lg shadow-[#8C1D40]/20 transition-all"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" light={true} className="mr-2" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar enlace de recuperación'
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-4">
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                                    <p className="text-green-400 text-sm">
                                        Si el correo está registrado, recibirás un enlace de recuperación en los próximos minutos.
                                        El enlace será válido por 10 minutos.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setEmailSent(false)}
                                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
                                >
                                    Enviar otro correo
                                </Button>
                            </div>
                        )}

                        {/* Back to Login Link */}
                        <div className="text-center mt-6">
                            <Link
                                to="/login"
                                className="inline-flex items-center text-sm text-gray-400 hover:text-[#8C1D40] transition-colors"
                            >
                                <HiArrowLeft className="w-4 h-4 mr-1" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
