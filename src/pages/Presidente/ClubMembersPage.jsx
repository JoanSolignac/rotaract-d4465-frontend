import { useState, useEffect } from 'react';
import { Card, Button, Spinner, Table, Badge, Alert, TextInput } from 'flowbite-react';
import { HiTrash, HiUserAdd, HiUserGroup, HiExclamation, HiSearch } from 'react-icons/hi';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
        <p className="text-gray-400 text-lg mb-6">No tienes permisos para ver esta página. Solo el Presidente puede gestionar los miembros.</p>
        <Button color="gray" href="/presidente">Volver al Inicio</Button>
    </div>
);

/**
 * Bulletproof ID validation - only accepts positive integers
 */
const isValidId = (id) => {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
};

export default function ClubMembersPage() {
    const navigate = useNavigate();
    const [miembros, setMiembros] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [clubId, setClubId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('rol'));

    useEffect(() => {
        if (currentUserRole !== 'PRESIDENTE') return;
        fetchClubData();
    }, [currentUserRole]);

    const fetchClubData = async () => {
        setLoading(true);
        try {
            const metricasResponse = await fetch('https://rotaractd4465api.up.railway.app/api/v1/clubs/metricas', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (metricasResponse.status === 401) {
                localStorage.clear();
                navigate('/login');
                return;
            }

            if (!metricasResponse.ok) throw new Error('Error al obtener información del club');

            const metricasData = await metricasResponse.json();
            const id = metricasData.club?.id;

            if (!isValidId(id)) {
                throw new Error('ID de club inválido');
            }

            setClubId(id);

            // Construir lista de miembros: PRESIDENTE + SOCIOS
            const miembrosAdaptados = [];

            // 1. Agregar PRESIDENTE como primer miembro
            const presidente = metricasData.presidente;
            if (presidente && isValidId(presidente.id)) {
                miembrosAdaptados.push({
                    id: Number(presidente.id),
                    nombreCompleto: presidente.nombre || 'Sin nombre',
                    correo: presidente.correo || 'Sin correo',
                    rol: 'PRESIDENTE'
                });
            }

            // 2. Agregar SOCIOS (excluyendo al presidente si aparece en integrantes)
            const integrantes = metricasData.integrantes?.content || [];
            const presidenteId = Number(presidente?.id);

            integrantes.forEach(u => {
                // Solo agregar si tiene ID válido, no es el presidente, y tiene datos básicos
                if (isValidId(u.id) && Number(u.id) !== presidenteId && u.nombre && u.correo) {
                    miembrosAdaptados.push({
                        id: Number(u.id),
                        nombreCompleto: u.nombre,
                        correo: u.correo,
                        rol: 'SOCIO'
                    });
                }
            });

            console.log('Miembros cargados:', miembrosAdaptados);
            setMiembros(miembrosAdaptados);

        } catch (err) {
            console.error('Error al cargar datos del club:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (socioId) => {
        // Validación estricta del ID antes de proceder
        if (!isValidId(socioId)) {
            console.error('ID inválido para eliminar:', socioId);
            Swal.fire({
                title: 'Error',
                text: 'ID de socio inválido',
                icon: 'error',
                confirmButtonColor: '#8B0036',
                background: '#1f2937',
                color: '#fff'
            });
            return;
        }

        let intervalId;
        Swal.fire({
            title: '¿Estás seguro?',
            html: `
                <p>¡No podrás revertir esto! El socio será eliminado del club.</p>
                <p id="countdown" style="margin-top:8px;font-size:14px;opacity:0.8;">
                    Podrás confirmar en <strong>10</strong> segundos...
                </p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1f2937',
            color: '#fff',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                const confirmBtn = Swal.getConfirmButton();
                confirmBtn.disabled = true;

                let seconds = 10;
                const countdownEl = document.getElementById('countdown');

                intervalId = setInterval(() => {
                    seconds--;
                    countdownEl.innerHTML = `Podrás confirmar en <strong>${seconds}</strong> segundos...`;

                    if (seconds <= 0) {
                        clearInterval(intervalId);
                        confirmBtn.disabled = false;
                        countdownEl.innerHTML = 'Ya puedes confirmar la operación.';
                    }
                }, 1000);
            },
            willClose: () => {
                if (intervalId) clearInterval(intervalId);
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://rotaractd4465api.up.railway.app/api/v1/clubs/${clubId}/socios/${socioId}`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });

                    if (!response.ok) throw new Error('Error al eliminar el socio');

                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El socio ha sido eliminado.',
                        icon: 'success',
                        confirmButtonColor: '#8B0036',
                        background: '#1f2937',
                        color: '#fff'
                    });
                    fetchClubData();
                } catch (err) {
                    Swal.fire({
                        title: 'Error',
                        text: err.message,
                        icon: 'error',
                        confirmButtonColor: '#8B0036',
                        background: '#1f2937',
                        color: '#fff'
                    });
                }
            }
        });
    };

    const handleTransferPresidency = (nuevoPresidenteId) => {
        // ========================================
        // VALIDACIÓN CRÍTICA NIVEL 1: Tipo y valor
        // ========================================
        console.log('╔════════════════════════════════════════╗');
        console.log('║  INICIO TRANSFERENCIA DE PRESIDENCIA  ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('📥 ID recibido:', nuevoPresidenteId);
        console.log('📊 Tipo:', typeof nuevoPresidenteId);
        console.log('📊 Valor raw:', JSON.stringify(nuevoPresidenteId));

        // Validación preliminar
        if (nuevoPresidenteId === null || nuevoPresidenteId === undefined) {
            console.error('❌ BLOQUEADO: ID es null o undefined');
            Swal.fire({
                title: 'Error',
                text: 'ID de miembro inválido (null/undefined).',
                icon: 'error',
                confirmButtonColor: '#8B0036',
                background: '#1f2937',
                color: '#fff'
            });
            return;
        }

        // ========================================
        // CONVERSIÓN A NÚMERO ENTERO CON parseInt
        // ========================================
        const idNumber = Number.parseInt(nuevoPresidenteId, 10);

        console.log('🔄 Conversión con parseInt(id, 10):', idNumber);
        console.log('🔍 Es entero?', Number.isInteger(idNumber));
        console.log('🔍 Es mayor a 0?', idNumber > 0);

        // ========================================
        // VALIDACIÓN CRÍTICA NIVEL 2: Número válido
        // ========================================
        if (!Number.isInteger(idNumber) || idNumber <= 0) {
            console.error('❌ BLOQUEADO: ID no es un entero positivo');
            console.error('Detalles de validación:', {
                original: nuevoPresidenteId,
                convertido: idNumber,
                esEntero: Number.isInteger(idNumber),
                esMayorCero: idNumber > 0,
                esNaN: isNaN(idNumber)
            });

            Swal.fire({
                title: 'Error',
                text: 'ID de miembro inválido. Debe ser un número entero positivo.',
                icon: 'error',
                confirmButtonColor: '#8B0036',
                background: '#1f2937',
                color: '#fff'
            });
            return; // SALIR - NO MOSTRAR CONFIRMACIÓN
        }

        console.log('✅ VALIDACIÓN EXITOSA - ID es válido:', idNumber);
        console.log('📋 Mostrando diálogo de confirmación...');

        // ========================================
        // CONFIRMACIÓN CON SWEETALERT (solo si ID válido)
        // ========================================
        let intervalId;
        Swal.fire({
            title: '¿Transferir Presidencia?',
            html: `
                <p>¿Estás seguro de transferir tu cargo? Perderás tus privilegios de administrador.</p>
                <p id="countdown" style="margin-top:8px;font-size:14px;opacity:0.8;">
                    Podrás confirmar en <strong>10</strong> segundos...
                </p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8B0036',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, transferir',
            cancelButtonText: 'Cancelar',
            background: '#1f2937',
            color: '#fff',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                const confirmBtn = Swal.getConfirmButton();
                confirmBtn.disabled = true;

                let seconds = 10;
                const countdownEl = document.getElementById('countdown');

                intervalId = setInterval(() => {
                    seconds--;
                    countdownEl.innerHTML = `Podrás confirmar en <strong>${seconds}</strong> segundos...`;

                    if (seconds <= 0) {
                        clearInterval(intervalId);
                        confirmBtn.disabled = false;
                        countdownEl.innerHTML = 'Ya puedes confirmar la operación.';
                    }
                }, 1000);
            },
            willClose: () => {
                if (intervalId) clearInterval(intervalId);
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // ========================================
                    // CONSTRUCCIÓN DEL ENDPOINT CON PATHVARIABLE
                    // ========================================
                    const endpoint = `https://rotaractd4465api.up.railway.app/api/v1/clubs/${clubId}/transferir-presidencia/${idNumber}`;

                    console.log('╔════════════════════════════════════════╗');
                    console.log('║     ENVIANDO REQUEST AL BACKEND        ║');
                    console.log('╚════════════════════════════════════════╝');
                    console.log('🏢 Club ID:', clubId);
                    console.log('� Nuevo Presidente ID:', idNumber);
                    console.log('📦 Método: POST con PathVariables (sin body JSON)');
                    console.log('🌐 Endpoint completo:', endpoint);

                    // Verificación final antes de enviar
                    if (!Number.isInteger(idNumber) || idNumber <= 0) {
                        throw new Error('CRÍTICO: ID inválido detectado antes de enviar');
                    }

                    console.log('✅ ID validado - Ejecutando fetch...');

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });

                    console.log('📥 Response status:', response.status);
                    console.log('📥 Response ok:', response.ok);

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error('❌ ERROR DEL SERVIDOR:', errorData);
                        const errorMessage = errorData.message || errorData.error || `Error ${response.status}`;
                        throw new Error(errorMessage);
                    }

                    const responseData = await response.json().catch(() => ({}));
                    console.log('✅ TRANSFERENCIA EXITOSA');
                    console.log('📥 Response data:', responseData);

                    // ========================================
                    // ÉXITO: Cerrar sesión automáticamente
                    // ========================================
                    await Swal.fire({
                        title: '¡Transferido!',
                        text: 'La presidencia ha sido transferida exitosamente. Cerrando sesión...',
                        icon: 'success',
                        confirmButtonColor: '#8B0036',
                        background: '#1f2937',
                        color: '#fff',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });

                    console.log('🔒 Limpiando localStorage y redirigiendo...');
                    localStorage.clear();
                    navigate('/login');

                } catch (err) {
                    console.error('╔════════════════════════════════════════╗');
                    console.error('║           ERROR EN TRANSFERENCIA       ║');
                    console.error('╚════════════════════════════════════════╝');
                    console.error('❌ Error:', err);
                    console.error('❌ Mensaje:', err.message);
                    console.error('❌ Stack:', err.stack);

                    Swal.fire({
                        title: 'Error',
                        text: err.message,
                        icon: 'error',
                        confirmButtonColor: '#8B0036',
                        background: '#1f2937',
                        color: '#fff'
                    });
                }
            } else {
                console.log('ℹ️ Usuario canceló la transferencia');
            }
        });
    };

    if (currentUserRole !== 'PRESIDENTE') {
        return <AccessDenied />;
    }

    return (
        <div className="pt-20 pb-16 min-h-screen bg-neutral-950">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Miembros del Club
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 max-w-3xl">
                        Gestiona los socios y el rol de presidencia.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <div className="mb-6 max-w-md">
                    <TextInput
                        id="search"
                        type="text"
                        icon={HiSearch}
                        placeholder="Buscar miembro por nombre o correo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="[&>div>input]:bg-neutral-900 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500 [&>div>input:focus]:border-primary-600 [&>div>input:focus]:ring-primary-600"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="xl" color="pink" />
                    </div>
                ) : error ? (
                    <Alert color="failure" className="mb-6">
                        <span className="font-medium">Error:</span> {error}
                    </Alert>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <Table hoverable className="bg-transparent">
                                <Table.Head className="bg-neutral-800 text-gray-400">
                                    <Table.HeadCell className="bg-neutral-800">Nombre</Table.HeadCell>
                                    <Table.HeadCell className="bg-neutral-800">Correo</Table.HeadCell>
                                    <Table.HeadCell className="bg-neutral-800">Rol</Table.HeadCell>
                                    <Table.HeadCell className="bg-neutral-800">Acciones</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y divide-neutral-800">
                                    {miembros.length === 0 ? (
                                        <Table.Row className="bg-neutral-900">
                                            <Table.Cell colSpan={4} className="text-center py-8 text-gray-500">
                                                No hay miembros registrados.
                                            </Table.Cell>
                                        </Table.Row>
                                    ) : (
                                        miembros
                                            .filter(m => {
                                                // Búsqueda segura con validación de campos
                                                if (!searchQuery) return true;
                                                const query = searchQuery.toLowerCase();
                                                const nombre = (m.nombreCompleto || '').toLowerCase();
                                                const correo = (m.correo || '').toLowerCase();
                                                return nombre.includes(query) || correo.includes(query);
                                            })
                                            .map((miembro) => (
                                                <Table.Row key={miembro.id} className="bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800">
                                                    <Table.Cell className="whitespace-nowrap font-medium">
                                                        {miembro.nombreCompleto}
                                                    </Table.Cell>
                                                    <Table.Cell>{miembro.correo}</Table.Cell>
                                                    <Table.Cell>
                                                        <Badge color={miembro.rol === 'PRESIDENTE' ? 'warning' : 'info'} className="w-fit">
                                                            {miembro.rol}
                                                        </Badge>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex gap-2">
                                                            {miembro.rol !== 'PRESIDENTE' && (
                                                                <>
                                                                    <Button
                                                                        size="xs"
                                                                        color="failure"
                                                                        onClick={() => handleDelete(miembro.id)}
                                                                        title="Eliminar socio"
                                                                        disabled={!isValidId(miembro.id)}
                                                                    >
                                                                        <HiTrash className="h-4 w-4" />
                                                                    </Button>
                                                                    {/* Solo mostrar botón si ID es válido */}
                                                                    {isValidId(miembro.id) && (
                                                                        <Button
                                                                            size="xs"
                                                                            color="warning"
                                                                            onClick={() => handleTransferPresidency(miembro.id)}
                                                                            title="Transferir Presidencia"
                                                                        >
                                                                            <HiUserAdd className="h-4 w-4 mr-1" />
                                                                            Transferir
                                                                        </Button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
