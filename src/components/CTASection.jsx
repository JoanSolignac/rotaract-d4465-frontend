import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * CTA Section Component
 * Final call-to-action with high contrast background
 */
export default function CTASection() {
    return (
        <section className="relative py-20 lg:py-28 overflow-hidden">
            {/* Background with Gradient and Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-primary-950 z-0" />
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0" />

            <div className="max-w-screen-xl mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                        Sé parte del cambio
                    </h2>

                    <p className="mb-10 text-xl font-light text-white/90 md:text-2xl max-w-3xl mx-auto leading-relaxed">
                        Únete a Rotaract Distrito 4465 hoy y comienza a transformar tu comunidad junto a líderes apasionados.
                    </p>

                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-primary-700 bg-white rounded-full hover:bg-gray-50 focus:ring-4 focus:ring-white/50 shadow-2xl transition-all hover:-translate-y-1 hover:shadow-white/20"
                    >
                        Registrarse Ahora
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
