import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import EditClubForm from '../../components/EditClubForm';
import { getClubPublic, updateClub } from '../../services/clubService';
import { getProfile } from '../../services/profileService';

export default function EditClubPage() {
    const [clubData, setClubData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clubId, setClubId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadUserProfileAndClub();
    }, []);

    const loadUserProfileAndClub = async () => {
        try {
            setLoading(true);
            // Get user profile to obtain clubId
            const profile = await getProfile();
            console.log('📊 Perfil del usuario:', profile);

            if (!profile.clubId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No tienes un club asignado',
                    confirmButtonColor: '#ef4444'
                }).then(() => {
                    navigate('/presidente');
                });
                return;
            }

            setClubId(profile.clubId);

            // Load club data
            const data = await getClubPublic(profile.clubId);
            console.log('📊 Datos del club recibidos:', data);
            setClubData(data);
        } catch (error) {
            console.error('Error loading data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo cargar los datos',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        try {
            setSaving(true);
            await updateClub(clubId, data);

            await Swal.fire({
                icon: 'success',
                title: '¡Club actualizado!',
                text: 'Los cambios se han guardado exitosamente',
                confirmButtonColor: '#10b981',
                timer: 2000
            });

            navigate('/presidente');
        } catch (error) {
            console.error('Error updating club:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo actualizar el club',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setSaving(false);
        }
    };

    const breadcrumbItems = [
        { label: 'Inicio', href: '/presidente' },
        { label: 'Editar Club' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <div className="max-w-2xl mx-auto">
                <Breadcrumb items={breadcrumbItems} dashboardPath="/presidente" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="shadow-xl">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Editar Club
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Actualiza la información de tu club. Todos los campos son obligatorios.
                            </p>
                        </div>

                        <EditClubForm
                            initialData={clubData}
                            onSubmit={handleSubmit}
                            loading={saving}
                        />
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

