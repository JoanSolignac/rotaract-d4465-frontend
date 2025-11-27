import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import NavbarPresidente from '../components/NavbarPresidente';
import NavbarRepresentante from '../components/NavbarRepresentante';
import SocioNavbar from '../components/SocioNavbar';
import Breadcrumb from '../components/Breadcrumb';
import EditProfileForm from '../components/EditProfileForm';
import { getProfile, updateProfile } from '../services/profileService';

export default function EditProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const rol = localStorage.getItem('rol');
        setUserRole(rol || '');
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            console.log('📊 Datos del perfil recibidos del backend:', data);
            setProfileData(data);
        } catch (error) {
            console.error('Error loading profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo cargar el perfil',
                confirmButtonColor: '#3085d6'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        try {
            setSaving(true);
            const updatedProfile = await updateProfile(data);

            localStorage.setItem('nombre', updatedProfile.nombre || data.nombre);
            localStorage.setItem('correo', updatedProfile.correo || data.correo);
            if (updatedProfile.ciudad || data.ciudad) {
                localStorage.setItem('ciudad', updatedProfile.ciudad || data.ciudad);
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Perfil actualizado!',
                text: 'Tus cambios se han guardado exitosamente',
                confirmButtonColor: '#10b981',
                timer: 2000
            });

            const rol = localStorage.getItem('rol');
            if (rol === 'PRESIDENTE') {
                navigate('/presidente');
            } else if (rol === 'REPRESENTANTE_DISTRITAL') {
                navigate('/representante');
            } else if (rol === 'SOCIO') {
                navigate('/socio');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo actualizar el perfil',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setSaving(false);
        }
    };

    const getNavbar = () => {
        switch (userRole) {
            case 'PRESIDENTE':
                return <NavbarPresidente />;
            case 'REPRESENTANTE_DISTRITAL':
                return <NavbarRepresentante />;
            case 'SOCIO':
                return <SocioNavbar />;
            default:
                return null;
        }
    };

    const getDashboardPath = () => {
        switch (userRole) {
            case 'PRESIDENTE':
                return '/presidente';
            case 'REPRESENTANTE_DISTRITAL':
                return '/representante';
            case 'SOCIO':
                return '/socio';
            default:
                return '/';
        }
    };

    const getBreadcrumbItems = () => {
        const dashboardPath = getDashboardPath();
        return [
            { label: 'Inicio', href: dashboardPath },
            { label: 'Editar Perfil' }
        ];
    };

    if (loading) {
        return (
            <>
                {getNavbar()}
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 pt-20">
                    <Spinner size="xl" />
                </div>
            </>
        );
    }

    return (
        <>
            {getNavbar()}
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pt-20 px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Breadcrumb items={getBreadcrumbItems()} dashboardPath={getDashboardPath()} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="shadow-xl">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Editar Perfil
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Actualiza tu información personal. Los campos marcados con * son obligatorios.
                                </p>
                            </div>

                            <EditProfileForm
                                initialData={profileData}
                                onSubmit={handleSubmit}
                                loading={saving}
                            />
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
