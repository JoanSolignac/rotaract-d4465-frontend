import { Modal, Button, Badge } from 'flowbite-react';
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
        <Modal show={isOpen} onClose={onClose} size="4xl" popup>
            <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 bg-gray-50">
                    <div className="flex flex-col gap-1 w-full pr-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {data.titulo}
                        </h3>
                        <div>
                            <Badge color={getEstadoBadgeColor(data.estado)} className="inline-block px-2 py-0.5 text-xs">
                                {data.estado}
                            </Badge>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto">
                    <div className="flex flex-col gap-5">
                        {/* Club Organizador - Full Width Top */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Organizado por</span>
                                <span className="font-bold text-gray-900 text-lg leading-tight">{data.clubNombre}</span>
                            </div>
                            <Button color="light" size="sm" onClick={handleVerClub} className="whitespace-nowrap shrink-0">
                                Ver Club
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Main Content (2 cols) */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Descripción */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-1">Descripción</h4>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm text-justify">
                                        {data.descripcion}
                                    </p>
                                </div>

                                {/* Requisitos */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-1">Requisitos</h4>
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 text-sm">
                                        {data.requisitos}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar (1 col) */}
                            <div className="space-y-3">
                                {/* Fechas - Compact List */}
                                <div className="bg-white border rounded-lg p-3 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-900 mb-2 border-b pb-1">Cronograma</h4>
                                    <div className="space-y-1.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Publicación:</span>
                                            <span className="font-medium">{new Date(data.fechaPublicacion).toLocaleDateString('es-PE')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Cierre:</span>
                                            <span className="font-medium">{new Date(data.fechaCierre).toLocaleDateString('es-PE')}</span>
                                        </div>
                                        <div className="flex justify-between text-green-700 bg-green-50 p-1 rounded">
                                            <span>Inicio Postulación:</span>
                                            <span className="font-bold">{new Date(data.fechaInicioPostulacion).toLocaleDateString('es-PE')}</span>
                                        </div>
                                        <div className="flex justify-between text-red-700 bg-red-50 p-1 rounded">
                                            <span>Fin Postulación:</span>
                                            <span className="font-bold">{new Date(data.fechaFinPostulacion).toLocaleDateString('es-PE')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cupos - Compact */}
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-xs font-bold text-gray-900">Cupos</h4>
                                        <span className="text-[10px] font-medium text-gray-600">
                                            {data.inscritos} / {data.cupoMaximo}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                        <div
                                            className={`h-1.5 rounded-full ${porcentajeCupos >= 100 ? 'bg-red-600' : 'bg-primary-600'}`}
                                            style={{ width: `${porcentajeCupos}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 text-right">
                                        {cuposCompletos ? 'Agotado' : 'Disponible'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-3 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 bg-gray-50">
                    <Button color="gray" size="xs" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button
                        color="failure"
                        size="xs"
                        className="bg-[#B40032] hover:bg-[#8a0026] text-white focus:ring-[#B40032]"
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
