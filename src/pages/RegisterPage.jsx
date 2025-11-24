import { useState } from 'react';
import { Card, Button, Label, TextInput, Spinner } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
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
                confirmButtonColor: '#B40032'
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
                confirmButtonColor: '#B40032'
            });

            navigate('/login');

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Ocurrió un error inesperado al registrarse.',
                confirmButtonColor: '#B40032'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AppNavbar />

            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md shadow-lg">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
                        <p className="text-gray-600 mt-1">Únete a Rotaract Distrito 4465</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="nombre" value="Nombre completo" />
                            </div>
                            <TextInput
                                id="nombre"
                                type="text"
                                placeholder="Ej: Juan Pérez"
                                required
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="correo" value="Correo electrónico" />
                            </div>
                            <TextInput
                                id="correo"
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                required
                                value={formData.correo}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="contrasena" value="Contraseña" />
                            </div>
                            <TextInput
                                id="contrasena"
                                type="password"
                                placeholder="********"
                                required
                                minLength={6}
                                value={formData.contrasena}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="ciudad" value="Ciudad" />
                            </div>
                            <TextInput
                                id="ciudad"
                                type="text"
                                placeholder="Ej: Lima"
                                required
                                value={formData.ciudad}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="fechaNacimiento" value="Fecha de Nacimiento" />
                            </div>
                            <TextInput
                                id="fechaNacimiento"
                                type="date"
                                required
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-2 bg-[#B40032] hover:bg-[#8a0026] text-white focus:ring-[#B40032]"
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

                    <div className="text-center mt-4 text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-[#B40032] hover:underline font-medium">
                            Inicia sesión aquí
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
