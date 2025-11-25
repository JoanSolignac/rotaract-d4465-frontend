import { motion } from 'framer-motion';

/**
 * Miembros Page - Placeholder
 * Future implementation for managing club members
 */
export default function Miembros() {
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
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-white mb-4">Gestión de Miembros</h1>
                    <p className="text-gray-400 text-lg mb-6">
                        Esta sección está en desarrollo. Aquí podrás gestionar los miembros de tu club.
                    </p>
                    <div className="inline-block px-4 py-2 bg-neutral-800 text-gray-300 rounded-lg">
                        Próximamente disponible
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
