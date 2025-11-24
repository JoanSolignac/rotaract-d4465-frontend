import { useState, useEffect, useMemo } from 'react';
import { Spinner, TextInput, Select } from 'flowbite-react';
import Swal from 'sweetalert2';
import InteresadoNavbar from '../components/InteresadoNavbar';
import ConvocatoriaCard from '../components/ConvocatoriaCard';
import ConvocatoriaDetailsModal from '../components/ConvocatoriaDetailsModal';

export default function InteresadoConvocatoriasPage() {
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchConvocatorias = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/convocatorias/disponibles', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar convocatorias');

            const data = await response.json();
            // API returns a Page object, so we access data.content
            setConvocatorias(data.content && Array.isArray(data.content) ? data.content : []);
        } catch (err) {
            console.error('Error fetching convocatorias:', err);
            setError('No se pudieron cargar las convocatorias.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConvocatorias();
    }, []);

    const clubs = useMemo(() => {
        const uniqueClubs = [...new Set(convocatorias.map(c => c.clubNombre))];
        return uniqueClubs.sort();
    }, [convocatorias]);

    const filteredConvocatorias = useMemo(() => {
        return convocatorias.filter(c => {
            const matchesSearch = searchQuery.trim() === '' || c.titulo.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesClub = selectedClub === '' || c.clubNombre === selectedClub;
            return matchesSearch && matchesClub;
        });
    }, [convocatorias, searchQuery, selectedClub]);

    const handleVerDetalles = (convocatoria) => {
        setSelectedConvocatoria(convocatoria);
        setIsModalOpen(true);
    };

    const handlePostularFromCard = async (convocatoria) => {
        try {
            // Show loading spinner
            Swal.fire({
                title: 'Procesando...',
                text: 'Enviando tu postulación',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const token = localStorage.getItem('accessToken');
            const response = await fetch(`https://rotaractd4465api.up.railway.app/api/v1/convocatorias/${convocatoria.id}/inscribirse`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Handle both JSON and text responses
            const contentType = response.headers.get('content-type');
            let errorMessage = 'Error al postular.';

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (!response.ok) {
                    errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : (data.message || errorMessage);
                }
            } else {
                // If response is text
                const text = await response.text();
                if (!response.ok) {
                    errorMessage = text || errorMessage;
                }
            }

            if (!response.ok) {
                throw new Error(errorMessage);
            }

            // Success
            await Swal.fire({
                icon: 'success',
                title: '¡Postulación enviada!',
                text: 'Te has inscrito correctamente a la convocatoria.',
                confirmButtonColor: '#B40032'
            });

            fetchConvocatorias(); // Refresh list

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'No se pudo realizar la postulación.',
                confirmButtonColor: '#B40032'
            });
        }
    };

    const handlePostular = async () => {
        if (!selectedConvocatoria) return;

        // Show confirmation dialog first
        const confirmResult = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas inscribirte a la convocatoria "${selectedConvocatoria.titulo}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#B40032',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, inscribirme',
            cancelButtonText: 'Cancelar'
        });

        // If user cancels, return early
        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            // Show loading spinner
            Swal.fire({
                title: 'Procesando...',
                text: 'Enviando tu postulación',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const token = localStorage.getItem('accessToken');
            const response = await fetch(`https://rotaractd4465api.up.railway.app/api/v1/convocatorias/${selectedConvocatoria.id}/inscribirse`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Handle both JSON and text responses
            const contentType = response.headers.get('content-type');
            let data;
            let errorMessage = 'Error al postular.';

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
                if (!response.ok) {
                    errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : (data.message || errorMessage);
                }
            } else {
                // If response is text
                const text = await response.text();
                if (!response.ok) {
                    errorMessage = text || errorMessage;
                }
            }

            if (!response.ok) {
                throw new Error(errorMessage);
            }

            // Success
            await Swal.fire({
                icon: 'success',
                title: '¡Postulación enviada!',
                text: 'Te has inscrito correctamente a la convocatoria.',
                confirmButtonColor: '#B40032'
            });

            setIsModalOpen(false);
            fetchConvocatorias(); // Refresh list

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'No se pudo realizar la postulación.',
                confirmButtonColor: '#B40032'
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <InteresadoNavbar />

            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 md:py-20 mt-0">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                        Convocatorias del Distrito 4465
                    </h1>
                    <p className="text-base md:text-xl text-primary-100 max-w-2xl mx-auto">
                        Explora todas las convocatorias disponibles y únete a las actividades de nuestro distrito.
                    </p>
                </div>
            </section>

            <main className="flex-grow py-8 bg-gray-50">
                <div className="max-w-screen-xl mx-auto px-4">
                    {loading && <div className="text-center py-20"><Spinner size="xl" /></div>}
                    {!loading && error && <div className="text-center py-20 text-red-600">{error}</div>}

                    {!loading && !error && (
                        <>
                            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextInput
                                        placeholder="Buscar por título..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                    <Select value={selectedClub} onChange={e => setSelectedClub(e.target.value)}>
                                        <option value="">Todos los clubes</option>
                                        {clubs.map(club => <option key={club} value={club}>{club}</option>)}
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredConvocatorias.map(convocatoria => (
                                    <ConvocatoriaCard
                                        key={convocatoria.id}
                                        convocatoria={convocatoria}
                                        onVerDetalles={() => handleVerDetalles(convocatoria)}
                                        onPostular={handlePostularFromCard}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {selectedConvocatoria && (
                <ConvocatoriaDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={selectedConvocatoria}
                    onPostular={handlePostular}
                />
            )}
        </div>
    );
}
