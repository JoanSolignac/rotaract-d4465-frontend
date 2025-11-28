import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Spinner, TextInput, Select, Button, Table } from 'flowbite-react';
import { HiSearch, HiFilter, HiPlus, HiEye, HiCheckCircle, HiXCircle, HiBell, HiX } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { patch } from '../../services/fetchClient';
// import DesactivarClubButton from '../../components/DesactivarClubButton';
// import useNotifications from '../../hooks/useNotifications';

/**
 * ClubsPage Component for District Representative
 * Lists all clubs with search, filter, and activate/deactivate functionality
 */
export default function ClubsPage() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // WebSocket notifications - TEMPORARILY DISABLED
    // const { notifications, connected } = useNotifications();
    const notifications = [];
    const connected = false;

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use public endpoint which returns paginated data
            const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/clubs/public');
            const data = await response.json();

            if (data.content && Array.isArray(data.content)) {
                setClubs(data.content);
            } else if (Array.isArray(data)) {
                setClubs(data);
            } else {
                setClubs([]);
            }
        } catch (err) {
            console.error('Error fetching clubs:', err);
            setError('No se pudieron cargar los clubes');
        } finally {
            setLoading(false);
        }
    };

    const departments = useMemo(() => {
        const uniqueDepts = [...new Set(clubs.map(club => club.departamento))];
        return uniqueDepts.sort();
    }, [clubs]);

    const filteredClubs = useMemo(() => {
        return clubs.filter(club => {
            const matchesSearch = searchQuery.trim() === '' ||
                club.nombre.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDepartment = selectedDepartment === '' ||
                club.departamento === selectedDepartment;

            return matchesSearch && matchesDepartment;
        });
    }, [clubs, searchQuery, selectedDepartment]);

    const handleActivateClick = async (club) => {
        const result = await Swal.fire({
            title: `¿Activar ${club.nombre}?`,
            text: 'El club volverá a estar activo.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Activar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#8C1D40',
            cancelButtonColor: '#6B7280',
            background: '#171717',
            color: '#ffffff'
        });

        if (result.isConfirmed) {
            try {
                // Assuming there's an activate endpoint, otherwise use deactivate with different logic
                await patch(`/clubs/activate/${club.id}`, {});

                Swal.fire({
                    icon: 'success',
                    title: 'Club activado',
                    text: `${club.nombre} ha sido activado exitosamente.`,
                    confirmButtonColor: '#8C1D40',
                    background: '#171717',
                    color: '#ffffff'
                });

                fetchClubs();
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'No se pudo activar el club',
                    confirmButtonColor: '#E51A4C',
                    background: '#171717',
                    color: '#ffffff'
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050506] pt-24 pb-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                {/* WebSocket Notifications */}
                <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
                    {notifications.slice(0, 3).map((notification, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
                                <HiBell className="h-5 w-5" />
                            </div>
                            <div className="flex-1 text-sm">
                                <span className="block mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                    {notification.titulo}
                                </span>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {notification.mensaje}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                onClick={() => {
                                    // Remove notification
                                    const newNotifications = [...notifications];
                                    newNotifications.splice(index, 1);
                                }}
                            >
                                <HiX className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                            Gestión de Clubes
                        </h1>
                        <p className="text-gray-400">
                            Administra los clubes del Distrito 4465
                            {connected && (
                                <span className="ml-2 inline-flex items-center text-xs text-green-400">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                                    Conectado
                                </span>
                            )}
                        </p>
                    </div>
                    <Link to="/representante/clubes/crear">
                        <Button className="mt-4 md:mt-0 bg-[#8C1D40] hover:bg-[#E51A4C] border-none">
                            <HiPlus className="w-5 h-5 mr-2" />
                            Crear Nuevo Club
                        </Button>
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-20">
                        <Spinner size="xl" color="pink" />
                        <p className="mt-4 text-lg text-gray-400">Cargando clubes...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-20">
                        <p className="text-red-400 text-lg font-medium">{error}</p>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 bg-neutral-900 p-6 rounded-2xl shadow-lg border border-neutral-800"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                                        Buscar por nombre
                                    </label>
                                    <TextInput
                                        id="search"
                                        type="text"
                                        icon={HiSearch}
                                        placeholder="Ej: Rotaract Iquitos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">
                                        Filtrar por departamento
                                    </label>
                                    <Select
                                        id="department"
                                        icon={HiFilter}
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="[&>div>select]:bg-neutral-800 [&>div>select]:border-neutral-700 [&>div>select]:text-white"
                                    >
                                        <option value="">Todos los departamentos</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </motion.div>

                        {/* Results Count */}
                        <div className="mb-6">
                            <p className="text-gray-400">
                                Mostrando <span className="font-bold text-white">{filteredClubs.length}</span> clubes
                            </p>
                        </div>

                        {/* Clubs Table */}
                        {filteredClubs.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 overflow-hidden"
                            >
                                <div className="overflow-x-auto">
                                    <Table>
                                        <Table.Head className="bg-neutral-800">
                                            <Table.HeadCell className="bg-neutral-800 text-gray-300">Nombre</Table.HeadCell>
                                            <Table.HeadCell className="bg-neutral-800 text-gray-300">Ciudad</Table.HeadCell>
                                            <Table.HeadCell className="bg-neutral-800 text-gray-300">Departamento</Table.HeadCell>
                                            <Table.HeadCell className="bg-neutral-800 text-gray-300">Estado</Table.HeadCell>
                                            <Table.HeadCell className="bg-neutral-800 text-gray-300">Acciones</Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y divide-neutral-800">
                                            {filteredClubs.map((club) => (
                                                <Table.Row key={club.id} className="bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                                                    <Table.Cell className="font-medium text-white">
                                                        {club.nombre}
                                                    </Table.Cell>
                                                    <Table.Cell className="text-gray-300">
                                                        {club.ciudad}
                                                    </Table.Cell>
                                                    <Table.Cell className="text-gray-300">
                                                        {club.departamento}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {club.activo ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                                                                <HiCheckCircle className="w-4 h-4 mr-1" />
                                                                Activo
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">
                                                                <HiXCircle className="w-4 h-4 mr-1" />
                                                                Inactivo
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex gap-2">
                                                            <Link to={`/representante/clubes/${club.id}`}>
                                                                <Button size="xs" className="bg-[#8C1D40] hover:bg-[#E51A4C] border-none">
                                                                    <HiEye className="w-4 h-4 mr-1" />
                                                                    Ver
                                                                </Button>
                                                            </Link>
                                                            {club.activo ? (
                                                                <Button
                                                                    size="xs"
                                                                    color="failure"
                                                                    onClick={() => {
                                                                        Swal.fire({
                                                                            title: `¿Desactivar ${club.nombre}?`,
                                                                            text: 'Esta acción desactivará el club.',
                                                                            icon: 'warning',
                                                                            showCancelButton: true,
                                                                            confirmButtonText: 'Desactivar',
                                                                            confirmButtonColor: '#dc2626'
                                                                        }).then(async (result) => {
                                                                            if (result.isConfirmed) {
                                                                                try {
                                                                                    await patch(`/clubs/deactivate/${club.id}`, {});
                                                                                    Swal.fire('¡Desactivado!', 'El club ha sido desactivado.', 'success');
                                                                                    fetchClubs();
                                                                                } catch (err) {
                                                                                    Swal.fire('Error', err.message, 'error');
                                                                                }
                                                                            }
                                                                        });
                                                                    }}
                                                                >
                                                                    Desactivar
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="xs"
                                                                    color="success"
                                                                    onClick={() => handleActivateClick(club)}
                                                                >
                                                                    Activar
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800">
                                <p className="text-gray-400 text-lg">No se encontraron clubes con los filtros seleccionados.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
