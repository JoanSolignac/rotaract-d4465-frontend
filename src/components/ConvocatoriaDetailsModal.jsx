import { Modal, Button, Badge } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { formatLocalDate } from '../utils/formatDate';
import { useNavigate } from 'react-router-dom';

export default function ConvocatoriaDetailsModal({ isOpen, onClose, data, isAuthenticated, onPostular }) {
    const navigate = useNavigate();

    if (!data) return null;

    const cuposCompletos = data.inscritos >= data.cupoMaximo;
    const porcentajeCupos = Math.min((data.inscritos / data.cupoMaximo) * 100, 100);

    const getEstadoBadgeColor = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'ABIERTA':
                return 'success';
            case 'CERRADA':
                return 'failure';
            case 'EN_REVISION':
                return 'warning';
            default:
                return 'gray';
        }
    };

    const handlePostularClick = () => {
        if (onPostular) {
            onPostular();
            return;
        }

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // Logic for authenticated user (if not passed via prop)
        console.log("Postular click from Modal - Authenticated");
    };

    const handleVerClub = () => {
        navigate(`/club/${data.clubId}`);
        onClose();
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="4xl" popup className="[&>div>div]:bg-neutral-900 [&>div>div]:border-neutral-800">
            <div className="flex flex-col max-h-[90vh] bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl shadow-black/50">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-neutral-800 rounded-t-2xl bg-neutral-900">
                    <div className="flex flex-col gap-2 w-full pr-8">
                        <h3 className="text-2xl font-bold text-white leading-tight">
                            {data.titulo}
                        </h3>
                        <div>
                            <Badge color={getEstadoBadgeColor(data.estado)} className="inline-block px-2 py-0.5 text-xs rounded-md">
                                {data.estado}
                            </Badge>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-neutral-800 hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        {/* Club Organizador - Full Width Top */}
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Organizado por</span>
                                <span className="font-bold text-white text-lg leading-tight">{data.clubNombre}</span>
                            </div>
                            <Button color="light" size="sm" onClick={handleVerClub} className="whitespace-nowrap shrink-0 bg-neutral-700 hover:bg-neutral-600 text-white border-none">
                                Ver Club
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content (2 cols) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Descripción */}
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">Descripción</h4>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm text-justify">
                                        {data.descripcion}
                                    </p>
                                </div>

                                {/* Requisitos */}
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">Requisitos</h4>
                                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-primary-900/10 p-4 rounded-xl border-l-4 border-primary-600 text-sm">
                                        {data.requisitos}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar (1 col) */}
                            <div className="space-y-4">
                                {/* Fechas - Compact List */}
                                <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl p-4 shadow-sm">
                                    <h4 className="text-xs font-bold text-white mb-3 border-b border-neutral-700 pb-2">Cronograma</h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Publicación:</span>
                                            <span className="font-medium text-gray-200">{formatLocalDate(data.fechaPublicacion)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Cierre:</span>
                                            <span className="font-medium text-gray-200">{formatLocalDate(data.fechaCierre)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-400 bg-green-900/20 p-1.5 rounded-lg border border-green-900/30">
                                            <span>Inicio Postulación:</span>
                                            <span className="font-bold">{formatLocalDate(data.fechaInicioPostulacion)}</span>
                                        </div>
                                        <div className="flex justify-between text-red-400 bg-red-900/20 p-1.5 rounded-lg border border-red-900/30">
                                            <span>Fin Postulación:</span>
                                            <span className="font-bold">{formatLocalDate(data.fechaFinPostulacion)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cupos - Compact */}
                                <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xs font-bold text-white">Cupos</h4>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {data.inscritos} / {data.cupoMaximo}
                                        </span>
                                    </div>
                                    <div className="w-full bg-neutral-700 rounded-full h-1.5 mb-2">
                                        <div
                                            className={`h-1.5 rounded-full ${porcentajeCupos >= 100 ? 'bg-red-500' : 'bg-primary-600 shadow-[0_0_8px_rgba(226,15,122,0.6)]'}`}
                                            style={{ width: `${porcentajeCupos}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-right">
                                        {cuposCompletos ? 'Agotado' : 'Disponible'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-4 space-x-3 border-t border-neutral-800 rounded-b-2xl bg-neutral-900">
                    <Button color="gray" size="sm" onClick={onClose} className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700">
                        Cerrar
                    </Button>
                    <Button
                        size="sm"
                        className="bg-primary-600 hover:bg-primary-700 text-white border-none focus:ring-primary-500 shadow-lg shadow-primary-600/20"
                        disabled={cuposCompletos}
                        onClick={handlePostularClick}
                    >
                        {cuposCompletos ? "Cupos completos" : "Postular ahora"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
