import { motion } from 'framer-motion';
import { Badge } from 'flowbite-react';
import PropTypes from 'prop-types';
import { formatLocalDate } from '../utils/formatDate';

/**
 * ListaResumida Component
 * Reusable list for convocatorias or proyectos with stagger animation
 */
export default function ListaResumida({ items, type }) {
    if (!items || items.length === 0) {
        return (
            <p className="text-gray-400 text-center py-8">
                No hay {type === 'convocatoria' ? 'convocatorias' : 'proyectos'} disponibles.
            </p>
        );
    }

    const getBadgeColor = (estado) => {
        if (type === 'convocatoria') {
            return estado === 'ACTIVO' ? 'success' : 'gray';
        }
        // For proyectos
        if (estado === 'EN_PROGRESO') return 'info';
        if (estado === 'COMPLETADO') return 'success';
        return 'gray';
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
        >
            {items.map((elemento) => (
                <motion.div
                    key={elemento.id}
                    variants={item}
                    className="border border-neutral-700 rounded-xl p-4 hover:border-primary-600/50 hover:shadow-lg hover:shadow-black/20 transition-all bg-neutral-800/30"
                >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-grow">
                            <h3 className="text-lg font-bold text-white mb-2">{elemento.titulo}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>
                                        {type === 'convocatoria' ? (
                                            <>
                                                Postulación: {formatLocalDate(elemento.fechaInicioPostulacion)} - {formatLocalDate(elemento.fechaFinPostulacion)}
                                            </>
                                        ) : (
                                            <>
                                                Proyecto: {formatLocalDate(elemento.fechaInicioProyecto)} - {formatLocalDate(elemento.fechaFinProyecto)}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Badge color={getBadgeColor(elemento.estado)}>
                            {elemento.estado}
                        </Badge>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

ListaResumida.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    type: PropTypes.oneOf(['convocatoria', 'proyecto']).isRequired,
};
