import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Spinner, TextInput, Select, Button, Table } from 'flowbite-react';
import { HiSearch, HiFilter, HiPlus, HiEye, HiCheckCircle, HiXCircle, HiBan } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { patch } from '../../services/fetchClient';

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

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            setLoading(true);
            setError(null);

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

    const handleDeactivateClick = (club) => {
        let timerInterval;
        let countdown = 10;

        Swal.fire({
            title: '⚠️ Advertencia: Desactivación de Club',
            html: `
                <div style="text-align: left; margin-bottom: 20px;">
                    <p style="font-weight: 600; margin-bottom: 10px;">
                        Estás a punto de desactivar: <span style="color: #dc2626;">${club.nombre}</span>
                    </p>
                    <p style="font-weight: 600; margin-bottom: 8px;">⚠️ Consecuencias irreversibles:</p>
                    <ul style="list-style: disc; padding-left: 20px; margin-bottom: 0;">
                        <li>Se expulsará automáticamente a <strong>todos los miembros</strong> del club</li>
                        <li>Todos los miembros pasarán al rol <strong>INTERESADO</strong></li>
                        <li>Se enviarán <strong>correos electrónicos</strong> a todos los afectados</li>
                        <li>Se enviarán <strong>notificaciones WebSocket</strong> en tiempo real</li>
                        <li>El club quedará <strong>inactivo</strong> y no podrá operar</li>
                    </ul>
                </div>
                <div style="padding: 15px; background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; margin-bottom: 10px;">
                    <p style="font-size: 32px; font-weight: bold; color: #d97706; margin: 0;">
                        <span id="countdown">${countdown}</span>
                    </p>
                    <p style="font-size: 14px; color: #92400e; margin: 5px 0 0 0;">
                        Puedes confirmar en <strong id="countdown-text">${countdown}</strong> segundo${countdown !== 1 ? 's' : ''}
                    </p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar Desactivación',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6B7280',
            background: '#171717',
            color: '#ffffff',
            customClass: {
                popup: 'swal-dark-popup',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            },
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                confirmButton.disabled = true;
                confirmButton.style.opacity = '0.5';
                confirmButton.style.cursor = 'not-allowed';

                timerInterval = setInterval(() => {
                    countdown--;
                    const countdownElement = document.getElementById('countdown');
                    const countdownText = document.getElementById('countdown-text');

                    if (countdownElement) {
                        countdownElement.textContent = countdown;
                    }
                    if (countdownText) {
                        countdownText.textContent = countdown;
                    }

                    if (countdown <= 0) {
                        clearInterval(timerInterval);
                        confirmButton.disabled = false;
                        confirmButton.style.opacity = '1';
                        confirmButton.style.cursor = 'pointer';

                        const htmlContent = Swal.getHtmlContainer();
                        if (htmlContent) {
                            const countdownDiv = htmlContent.querySelector('div[style*="background: #fef3c7"]');
                            if (countdownDiv) {
                                countdownDiv.innerHTML = `
                                    <p style="font-size: 18px; font-weight: 600; color: #16a34a; margin: 0;">
                                        ✓ Ahora puedes confirmar la desactivación
                                    </p>
                                `;
                                countdownDiv.style.background = '#dcfce7';
                                countdownDiv.style.border = '2px solid #16a34a';
                            }
                        }
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: 'Desactivando...',
                        text: 'Por favor espera',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });


                    await patch(`/api/v1/clubs/deactivate/${club.id}`);

                    await Swal.fire({
                        icon: 'success',
                        title: '¡Club desactivado!',
                        html: `
                            <p><strong>${club.nombre}</strong> ha sido desactivado exitosamente.</p>
                            <p style="font-size: 14px; color: #9ca3af; margin-top: 10px;">
                                Todos los miembros han sido expulsados y convertidos a INTERESADOS.
                            </p>
                        `,
                        confirmButtonColor: '#8C1D40',
                        background: '#171717',
                        color: '#ffffff',
                        timer: 5000
                    });

                    fetchClubs();
                } catch (err) {
                    console.error('Error deactivating club:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: err.message || 'No se pudo desactivar el club',
                        confirmButtonColor: '#dc2626',
                        background: '#171717',
                        color: '#ffffff'
                    });
                }
            }
        });
    };

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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                            Gestión de Clubes
                        </h1>
                        <p className="text-gray-400">
                            Administra los clubes del Distrito 4465
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
                                                                    onClick={() => handleDeactivateClick(club)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    <HiBan className="w-4 h-4 mr-1" />
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
