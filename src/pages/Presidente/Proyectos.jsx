import { motion } from 'framer-motion';

/**
 * Proyectos Page - Placeholder
 * Future implementation for managing proyectos
 */
export default function Proyectos() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-20 pb-16"
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-neutral-900 rounded-2xl shadow-lg shadow-black/20 border border-neutral-800 p-8 text-center">
                    <svg className="w-16 h-16 text-primary-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-3xl font-bold text-white mb-4">Gestión de Proyectos</h1>
                    <p className="text-gray-400 text-lg mb-6">
                        Esta sección está en desarrollo. Aquí podrás crear, editar y gestionar los proyectos de tu club.
                    </p>
                    <div className="inline-block px-4 py-2 bg-neutral-800 text-gray-300 rounded-lg">
                        Próximamente disponible
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
