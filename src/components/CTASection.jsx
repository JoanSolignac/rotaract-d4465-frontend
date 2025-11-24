import { Button } from 'flowbite-react';

/**
 * CTA Section Component
 * Final call-to-action with high contrast background
 */
export default function CTASection() {
    return (
        <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-16 lg:py-24">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>

                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
                    Sé parte del cambio
                </h2>

                <p className="mb-8 text-lg font-light text-white text-opacity-90 md:text-xl lg:text-2xl max-w-3xl mx-auto">
                    Únete a Rotaract Distrito 4465 hoy
                </p>

                <Button
                    size="xl"
                    className="bg-white hover:bg-gray-100 text-primary-600 font-bold focus:ring-4 focus:ring-white shadow-lg"
                    aria-label="Registrarse en la plataforma"
                >
                    <span className="text-lg">Registrarse</span>
                </Button>
            </div>
        </section>
    );
}
