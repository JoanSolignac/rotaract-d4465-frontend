import { motion } from 'framer-motion';

/**
 * How It Works Section Component
 * Displays 3-step process for using the platform
 */
export default function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: 'Regístrate',
            description: 'Crea tu cuenta como voluntario o club para acceder a todas las funciones.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
        },
        {
            number: 2,
            title: 'Participa',
            description: 'Explora las convocatorias activas y postúlate a las que más te interesen.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
        },
        {
            number: 3,
            title: 'Genera Impacto',
            description: 'Colabora en proyectos significativos y contribuye al cambio positivo.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
        },
    ];

    return (
        <section className="py-20 bg-white dark:bg-neutral-900 transition-colors duration-300">
            <div className="max-w-screen-xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        ¿Cómo Funciona?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Únete a nuestra comunidad en tres simples pasos y comienza a marcar la diferencia.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 dark:bg-neutral-800 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="mb-6 relative">
                                <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center border-4 border-primary-50 dark:border-primary-900/30 shadow-lg group-hover:border-primary-100 dark:group-hover:border-primary-900/50 transition-colors z-10">
                                    <div className="text-primary-600 dark:text-primary-400">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                                    {step.number}
                                </div>
                            </div>

                            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
