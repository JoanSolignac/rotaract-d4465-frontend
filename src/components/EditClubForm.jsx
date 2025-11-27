import { useState, useEffect } from 'react';
import { Label, TextInput, Button, Alert } from 'flowbite-react';
import { HiInformationCircle, HiOfficeBuilding, HiLocationMarker } from 'react-icons/hi';

export default function EditClubForm({ initialData, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        nombre: '',
        departamento: '',
        ciudad: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                departamento: initialData.departamento || '',
                ciudad: initialData.ciudad || ''
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del club es obligatorio';
        }

        if (!formData.departamento.trim()) {
            newErrors.departamento = 'El departamento es obligatorio';
        }

        if (!formData.ciudad.trim()) {
            newErrors.ciudad = 'La ciudad es obligatoria';
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
            onSubmit(formData);
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

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <HiOfficeBuilding className="w-4 h-4" />
                    Información del Club
                </h3>

                <div>
                    <Label htmlFor="nombre" value="Nombre del Club *" />
                    <TextInput
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleChange}
                        color={errors.nombre ? 'failure' : 'gray'}
                        helperText={errors.nombre}
                        disabled={loading}
                        icon={HiOfficeBuilding}
                        placeholder="Ej: Rotaract Club Ciudad"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="departamento" value="Departamento *" />
                    <TextInput
                        id="departamento"
                        name="departamento"
                        type="text"
                        value={formData.departamento}
                        onChange={handleChange}
                        color={errors.departamento ? 'failure' : 'gray'}
                        helperText={errors.departamento}
                        disabled={loading}
                        icon={HiLocationMarker}
                        placeholder="Ej: Guatemala"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="ciudad" value="Ciudad *" />
                    <TextInput
                        id="ciudad"
                        name="ciudad"
                        type="text"
                        value={formData.ciudad}
                        onChange={handleChange}
                        color={errors.ciudad ? 'failure' : 'gray'}
                        helperText={errors.ciudad}
                        disabled={loading}
                        icon={HiLocationMarker}
                        placeholder="Ej: Ciudad de Guatemala"
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
