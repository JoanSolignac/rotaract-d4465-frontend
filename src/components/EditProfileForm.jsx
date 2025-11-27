import { useState, useEffect } from 'react';
import { Label, TextInput, Button, Alert, Badge } from 'flowbite-react';
import { HiInformationCircle, HiUser, HiMail, HiLocationMarker, HiCalendar, HiShieldCheck } from 'react-icons/hi';

export default function EditProfileForm({ initialData, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        confirmarCorreo: '',
        ciudad: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            console.log('🔄 Inicializando formulario con datos:', initialData);
            const newFormData = {
                nombre: initialData.nombre || '',
                correo: initialData.correo || '',
                confirmarCorreo: initialData.correo || '',
                ciudad: initialData.ciudad || ''
            };
            console.log('📝 FormData establecido:', newFormData);
            setFormData(newFormData);
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es obligatorio';
        }

        if (formData.correo !== formData.confirmarCorreo) {
            newErrors.confirmarCorreo = 'Los correos no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const { confirmarCorreo, ...dataToSubmit } = formData;
            onSubmit(dataToSubmit);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleBadgeColor = (rol) => {
        switch (rol) {
            case 'PRESIDENTE': return 'info';
            case 'REPRESENTANTE_DISTRITAL': return 'purple';
            case 'SOCIO': return 'success';
            default: return 'gray';
        }
    };

    const getRoleLabel = (rol) => {
        switch (rol) {
            case 'PRESIDENTE': return 'Presidente';
            case 'REPRESENTANTE_DISTRITAL': return 'Representante Distrital';
            case 'SOCIO': return 'Socio';
            default: return rol;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {Object.keys(errors).length > 0 && (
                <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium">Error de validación:</span>
                    <ul className="mt-1 list-disc list-inside">
                        {Object.values(errors).map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </Alert>
            )}

            {/* Read-only fields section */}
            <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <HiShieldCheck className="w-4 h-4" />
                    Información del Usuario
                </h3>

                {initialData?.rol && (
                    <div>
                        <Label value="Rol" className="mb-1" />
                        <div className="flex items-center gap-2">
                            <Badge color={getRoleBadgeColor(initialData.rol)} size="lg">
                                {getRoleLabel(initialData.rol)}
                            </Badge>
                        </div>
                    </div>
                )}

                {initialData?.fechaNacimiento && (
                    <div>
                        <Label value="Fecha de Nacimiento" />
                        <div className="flex items-center gap-2 mt-1">
                            <HiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(initialData.fechaNacimiento)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Editable fields section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <HiUser className="w-4 h-4" />
                    Información Personal
                </h3>

                <div>
                    <Label htmlFor="nombre" value="Nombre completo *" />
                    <TextInput
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleChange}
                        color={errors.nombre ? 'failure' : 'gray'}
                        helperText={errors.nombre}
                        disabled={loading}
                        icon={HiUser}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="ciudad" value="Ciudad" />
                    <TextInput
                        id="ciudad"
                        name="ciudad"
                        type="text"
                        value={formData.ciudad}
                        onChange={handleChange}
                        disabled={loading}
                        icon={HiLocationMarker}
                        placeholder="Ej: Ciudad de México"
                    />
                </div>
            </div>

            {/* Email section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <HiMail className="w-4 h-4" />
                    Correo Electrónico
                </h3>

                <div>
                    <Label htmlFor="correo" value="Correo electrónico *" />
                    <TextInput
                        id="correo"
                        name="correo"
                        type="email"
                        value={formData.correo}
                        onChange={handleChange}
                        color={errors.correo ? 'failure' : 'gray'}
                        helperText={errors.correo}
                        disabled={loading}
                        icon={HiMail}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="confirmarCorreo" value="Confirmar correo electrónico *" />
                    <TextInput
                        id="confirmarCorreo"
                        name="confirmarCorreo"
                        type="email"
                        value={formData.confirmarCorreo}
                        onChange={handleChange}
                        color={errors.confirmarCorreo ? 'failure' : 'gray'}
                        helperText={errors.confirmarCorreo}
                        disabled={loading}
                        icon={HiMail}
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
                isProcessing={loading}
                size="lg"
            >
                {loading ? 'Guardando cambios...' : 'Guardar cambios'}
            </Button>
        </form>
    );
}
