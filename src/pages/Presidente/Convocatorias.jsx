import { motion } from 'framer-motion';

/**
 * Convocatorias Page - Placeholder
 * Future implementation for managing convocatorias
 */
export default function Convocatorias() {
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
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-3xl font-bold text-white mb-4">Gestión de Convocatorias</h1>
                    <p className="text-gray-400 text-lg mb-6">
                        Esta sección está en desarrollo. Aquí podrás crear, editar y gestionar las convocatorias de tu club.
                    </p>
                    <div className="inline-block px-4 py-2 bg-neutral-800 text-gray-300 rounded-lg">
                        Próximamente disponible
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
