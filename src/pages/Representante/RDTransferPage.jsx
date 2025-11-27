import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Label, TextInput, Spinner, Table, Badge } from 'flowbite-react';
import { HiArrowLeft, HiSearch, HiExclamationCircle, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { post, get } from '../../services/fetchClient';

/**
 * RDTransferPage Component
 * Page for District Representative to transfer their role to another user
 */
export default function RDTransferPage() {
    const navigate = useNavigate();

    // User list state
    const [users, setUsers] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [transferring, setTransferring] = useState(false);

    // Current user ID to exclude from list
    const [currentUserId, setCurrentUserId] = useState(null);

    const pageSize = 10;

    useEffect(() => {
        // Get current user ID from localStorage
        const userId = localStorage.getItem('userId');
        setCurrentUserId(userId ? parseInt(userId, 10) : null);
    }, []);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            setLoadingUsers(true);
            const data = await get(`/api/v1/miembros/paginado?page=${page}&size=${pageSize}`);
            setUsers(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error('Error fetching users:', err);
            setUsers([]);
            setTotalPages(0);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Filter users: only SOCIO or INTERESADO, active, not current user
    const filteredUsers = users.filter(user => {
        const matchesName = searchName.trim() === '' ||
            user.nombre?.toLowerCase().includes(searchName.toLowerCase());

        const matchesEmail = searchEmail.trim() === '' ||
            user.correo?.toLowerCase().includes(searchEmail.toLowerCase());

        // Only show SOCIO or INTERESADO users who are active
        const isEligible =
            (user.rol === 'SOCIO' || user.rol === 'INTERESADO') &&
            user.activo === true &&
            user.id !== currentUserId;

        return matchesName && matchesEmail && isEligible;
    });

    // Check if user is a president (has club and is president)
    const isPresident = (user) => {
        return user.rol === 'PRESIDENTE' || (user.club && user.esPresidente);
    };

    const handleTransfer = async (selectedUser) => {
        // Validate user ID
        const userId = selectedUser.id;
        const parsedId = Number.parseInt(userId, 10);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID de usuario inválido',
                confirmButtonColor: '#E51A4C',
                background: '#171717',
                color: '#ffffff'
            });
            return;
        }

        // Check if user is a president
        if (isPresident(selectedUser)) {
            Swal.fire({
                icon: 'warning',
                title: 'No disponible',
                text: 'Este usuario debe transferir su presidencia antes de poder ser Representante Distrital.',
                confirmButtonColor: '#8C1D40',
                background: '#171717',
                color: '#ffffff'
            });
            return;
        }

        // Confirmation dialog
        const result = await Swal.fire({
            title: '¿Está seguro?',
            html: `¿Desea transferir la Representación Distrital a <strong>${selectedUser.nombre}</strong>?<br><br>
                   <small class="text-gray-400">Esta acción cerrará su sesión automáticamente.</small>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#8C1D40',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, transferir',
            cancelButtonText: 'Cancelar',
            background: '#171717',
            color: '#ffffff'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setTransferring(true);

            // Call transfer endpoint
            await post(`/api/v1/auth/representacion/transferir/${parsedId}`);

            // Show success message
            await Swal.fire({
                icon: 'success',
                title: 'Transferencia exitosa',
                html: `La representación distrital ha sido transferida a <strong>${selectedUser.nombre}</strong>.<br><br>
                       <small class="text-gray-400">Se cerrará su sesión para aplicar los cambios de rol.</small>`,
                confirmButtonColor: '#8C1D40',
                background: '#171717',
                color: '#ffffff',
                timer: 3000,
                timerProgressBar: true
            });

            // Logout: clear localStorage and redirect to login
            localStorage.clear();
            navigate('/login', { replace: true });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'No se pudo completar la transferencia',
                confirmButtonColor: '#E51A4C',
                background: '#171717',
                color: '#ffffff'
            });
        } finally {
            setTransferring(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050506] pt-24 pb-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex mb-6 text-sm text-gray-400">
                    <Link to="/representante" className="hover:text-[#E51A4C] transition-colors">
                        Inicio
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-white">Transferir Representación</span>
                </nav>

                {/* Back Button */}
                <Button
                    onClick={() => navigate('/representante')}
                    className="mb-6 bg-neutral-800 hover:bg-neutral-700 border-neutral-700"
                >
                    <HiArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Dashboard
                </Button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Transferir Representación Distrital
                    </h1>
                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <HiExclamationCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-200 font-medium mb-2">
                                    Información importante sobre la transferencia
                                </p>
                                <ul className="text-sm text-amber-100/80 space-y-1 list-disc list-inside">
                                    <li>Solo puede transferir a usuarios con rol <strong>SOCIO</strong> o <strong>INTERESADO</strong></li>
                                    <li>El usuario seleccionado recibirá el rol de <strong>REPRESENTANTE DISTRITAL</strong></li>
                                    <li>Su rol cambiará automáticamente a <strong>SOCIO</strong></li>
                                    <li>Su sesión se cerrará automáticamente para aplicar los cambios</li>
                                    <li>Ambos usuarios recibirán notificaciones por correo electrónico</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Search and User List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Seleccionar Usuario</h2>

                    {/* Search Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <Label htmlFor="searchName" value="Buscar por nombre" className="text-gray-300 mb-2" />
                            <TextInput
                                id="searchName"
                                type="text"
                                icon={HiSearch}
                                placeholder="Nombre del usuario..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <Label htmlFor="searchEmail" value="Buscar por correo" className="text-gray-300 mb-2" />
                            <TextInput
                                id="searchEmail"
                                type="text"
                                icon={HiSearch}
                                placeholder="Correo electrónico..."
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    {loadingUsers ? (
                        <div className="flex justify-center py-12">
                            <Spinner size="xl" color="pink" />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto mb-4">
                                <Table>
                                    <Table.Head className="bg-neutral-800">
                                        <Table.HeadCell className="bg-neutral-800 text-gray-300">Nombre</Table.HeadCell>
                                        <Table.HeadCell className="bg-neutral-800 text-gray-300">Correo</Table.HeadCell>
                                        <Table.HeadCell className="bg-neutral-800 text-gray-300">Rol</Table.HeadCell>
                                        <Table.HeadCell className="bg-neutral-800 text-gray-300">Estado</Table.HeadCell>
                                        <Table.HeadCell className="bg-neutral-800 text-gray-300">Acción</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y divide-neutral-800">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <Table.Row key={user.id} className="bg-neutral-900 hover:bg-neutral-800/50">
                                                    <Table.Cell className="text-white font-medium">
                                                        {user.nombre}
                                                    </Table.Cell>
                                                    <Table.Cell className="text-gray-300 text-sm">
                                                        {user.correo}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Badge color={user.rol === 'SOCIO' ? 'purple' : 'blue'}>
                                                            {user.rol}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Badge color={user.activo ? 'success' : 'failure'}>
                                                            {user.activo ? 'Activo' : 'Inactivo'}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleTransfer(user)}
                                                            disabled={transferring || isPresident(user)}
                                                            className="bg-[#8C1D40] hover:bg-[#E51A4C] border-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {transferring ? (
                                                                <>
                                                                    <Spinner size="sm" light className="mr-2" />
                                                                    Transfiriendo...
                                                                </>
                                                            ) : (
                                                                'Transferir Representación'
                                                            )}
                                                        </Button>
                                                        {isPresident(user) && (
                                                            <p className="text-xs text-amber-400 mt-1">
                                                                Debe transferir presidencia primero
                                                            </p>
                                                        )}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        ) : (
                                            <Table.Row>
                                                <Table.Cell colSpan={5} className="text-center text-gray-400 py-8">
                                                    No se encontraron usuarios elegibles
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-400">
                                    Página {currentPage + 1} de {totalPages || 1}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                        className="bg-neutral-800 hover:bg-neutral-700 border-neutral-700"
                                    >
                                        <HiChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPage >= totalPages - 1 || totalPages === 0}
                                        className="bg-neutral-800 hover:bg-neutral-700 border-neutral-700"
                                    >
                                        <HiChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
