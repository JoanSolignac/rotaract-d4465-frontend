import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Label, TextInput, Spinner, Table } from 'flowbite-react';
import { HiArrowLeft, HiSearch, HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { post, get } from '../../services/fetchClient';

/**
 * CreateClubPage Component
 * Form to create a new club with president selection from paginated member list
 */
export default function CreateClubPage() {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        departamento: '',
        ciudad: '',
        presidenteId: null
    });

    // President selector state
    const [members, setMembers] = useState([]);
    const [selectedPresident, setSelectedPresident] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const pageSize = 10;

    useEffect(() => {
        fetchMembers(currentPage);
    }, [currentPage]);

    const fetchMembers = async (page) => {
        try {
            setLoadingMembers(true);

            // Use authenticated get request with access token
            // fetchClient already includes BASE_URL, so we only need the path
            const data = await get(`/api/v1/miembros/paginado?page=${page}&size=${pageSize}`);

            setMembers(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error('Error fetching members:', err);
            setMembers([]);
            setTotalPages(0);
        } finally {
            setLoadingMembers(false);
        }
    };

    // Filter members: only INTERESADO, active, and without club
    const filteredMembers = members.filter(member => {
        const matchesSearch = searchQuery.trim() === '' ||
            member.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.correo.toLowerCase().includes(searchQuery.toLowerCase());

        // Only show INTERESADO users who are active and don't belong to any club
        const isEligible =
            member.rol === 'INTERESADO' &&
            member.activo === true &&
            (member.club === null || member.club === undefined);

        return matchesSearch && isEligible;
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectPresident = (member) => {
        setSelectedPresident(member);
        setFormData(prev => ({
            ...prev,
            presidenteId: member.id
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.nombre || !formData.departamento || !formData.ciudad) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos del formulario.',
                confirmButtonColor: '#E51A4C',
                background: '#171717',
                color: '#ffffff'
            });
            return;
        }

        if (!formData.presidenteId) {
            Swal.fire({
                icon: 'error',
                title: 'Presidente no seleccionado',
                text: 'Por favor selecciona un presidente para el club.',
                confirmButtonColor: '#E51A4C',
                background: '#171717',
                color: '#ffffff'
            });
            return;
        }

        try {
            setSubmitting(true);

            console.log('Sending formData:', formData);
            await post('/api/v1/clubs/con-presidente', formData);


            Swal.fire({
                icon: 'success',
                title: '¡Club creado!',
                text: `${formData.nombre} ha sido creado exitosamente.`,
                confirmButtonColor: '#8C1D40',
                background: '#171717',
                color: '#ffffff'
            }).then(() => {
                navigate('/representante/clubes');
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'No se pudo crear el club',
                confirmButtonColor: '#E51A4C',
                background: '#171717',
                color: '#ffffff'
            });
        } finally {
            setSubmitting(false);
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
                    <Link to="/representante/clubes" className="hover:text-[#E51A4C] transition-colors">
                        Clubes
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-white">Crear club</span>
                </nav>

                {/* Back Button */}
                <Button
                    onClick={() => navigate('/representante/clubes')}
                    className="mb-6 bg-neutral-800 hover:bg-neutral-700 border-neutral-700"
                >
                    <HiArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Clubes
                </Button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                        Crear Nuevo Club
                    </h1>
                    <p className="text-gray-400">
                        Completa el formulario y selecciona un presidente para el nuevo club
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Información del Club</h2>

                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="nombre" value="Nombre del Club" className="text-gray-300 mb-2" />
                                    <TextInput
                                        id="nombre"
                                        type="text"
                                        placeholder="Ej: Rotaract Iquitos"
                                        required
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="departamento" value="Departamento" className="text-gray-300 mb-2" />
                                    <TextInput
                                        id="departamento"
                                        type="text"
                                        placeholder="Ej: Loreto"
                                        required
                                        value={formData.departamento}
                                        onChange={handleInputChange}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="ciudad" value="Ciudad" className="text-gray-300 mb-2" />
                                    <TextInput
                                        id="ciudad"
                                        type="text"
                                        placeholder="Ej: Iquitos"
                                        required
                                        value={formData.ciudad}
                                        onChange={handleInputChange}
                                        className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                                    />
                                </div>

                                {/* Selected President Display */}
                                {selectedPresident && (
                                    <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <HiCheck className="w-5 h-5 text-green-400" />
                                            <span className="text-sm font-medium text-green-400">Presidente Seleccionado</span>
                                        </div>
                                        <p className="text-white font-semibold">{selectedPresident.nombre}</p>
                                        <p className="text-sm text-gray-400">{selectedPresident.correo}</p>
                                        <p className="text-xs text-gray-500 mt-1">Rol: {selectedPresident.rol}</p>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-8 bg-[#8C1D40] hover:bg-[#E51A4C] border-none"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Spinner size="sm" light className="mr-2" />
                                        Creando club...
                                    </>
                                ) : (
                                    'Crear Club'
                                )}
                            </Button>
                        </motion.div>

                        {/* President Selector Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Seleccionar Presidente</h2>

                            {/* Search */}
                            <div className="mb-6">
                                <TextInput
                                    type="text"
                                    icon={HiSearch}
                                    placeholder="Buscar por nombre o correo..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="[&>div>input]:bg-neutral-800 [&>div>input]:border-neutral-700 [&>div>input]:text-white [&>div>input]:placeholder-gray-500"
                                />
                            </div>

                            {/* Members Table */}
                            {loadingMembers ? (
                                <div className="flex justify-center py-8">
                                    <Spinner size="lg" color="pink" />
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto mb-4">
                                        <Table>
                                            <Table.Head className="bg-neutral-800">
                                                <Table.HeadCell className="bg-neutral-800 text-gray-300">Nombre</Table.HeadCell>
                                                <Table.HeadCell className="bg-neutral-800 text-gray-300">Correo</Table.HeadCell>
                                                <Table.HeadCell className="bg-neutral-800 text-gray-300">Acción</Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className="divide-y divide-neutral-800">
                                                {filteredMembers.length > 0 ? (
                                                    filteredMembers.map((member) => (
                                                        <Table.Row key={member.id} className="bg-neutral-900 hover:bg-neutral-800/50">
                                                            <Table.Cell className="text-white font-medium">
                                                                {member.nombre}
                                                            </Table.Cell>
                                                            <Table.Cell className="text-gray-300 text-sm">
                                                                {member.correo}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <Button
                                                                    size="xs"
                                                                    onClick={() => handleSelectPresident(member)}
                                                                    className={`${selectedPresident?.id === member.id
                                                                        ? 'bg-green-600 hover:bg-green-700'
                                                                        : 'bg-[#8C1D40] hover:bg-[#E51A4C]'
                                                                        } border-none`}
                                                                >
                                                                    {selectedPresident?.id === member.id ? (
                                                                        <>
                                                                            <HiCheck className="w-4 h-4 mr-1" />
                                                                            Seleccionado
                                                                        </>
                                                                    ) : (
                                                                        'Seleccionar'
                                                                    )}
                                                                </Button>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))
                                                ) : (
                                                    <Table.Row>
                                                        <Table.Cell colSpan={3} className="text-center text-gray-400 py-8">
                                                            No se encontraron miembros elegibles
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )}
                                            </Table.Body>
                                        </Table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-400">
                                            Página {currentPage + 1} de {totalPages}
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
                                                disabled={currentPage >= totalPages - 1}
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
                </form>
            </div>
        </div>
    );
}
