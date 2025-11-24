import { useState } from 'react';
import { Card, Button, Label, TextInput, Alert, Spinner } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import AppNavbar from '../components/Navbar';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: ''
    });
    const [error, setError] = useState(null);
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
        setError(null);
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
                throw new Error(data.message || 'Credenciales incorrectas o error en el servidor.');
            }

            // Save auth data
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('correo', data.correo);
            localStorage.setItem('rol', data.rol);

            // Redirect
            navigate('/convocatorias');

        } catch (err) {
            setError(err.message || 'Ocurrió un error inesperado. Intenta nuevamente.');
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
                        <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
                        <p className="text-gray-600 mt-1">Ingresa a tu cuenta Rotaract</p>
                    </div>

                    {error && (
                        <Alert color="failure" className="mb-4">
                            <span>{error}</span>
                        </Alert>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                                value={formData.contrasena}
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
                                    Iniciando sesión...
                                </>
                            ) : (
                                'Ingresar'
                            )}
                        </Button>
                    </form>

                    <div className="text-center mt-4 text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="text-[#B40032] hover:underline font-medium">
                            Regístrate aquí
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
