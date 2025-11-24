/**
 * How It Works Section Component
 * Displays 3-step process for using the platform
 */
export default function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: 'Regístrate',
            description: 'Regístrate como club o voluntario.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
        },
        {
            number: 2,
            title: 'Participa',
            description: 'Publica o postúlate a una convocatoria.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
        },
        {
            number: 3,
            title: 'Genera Impacto',
            description: 'Realiza el proyecto y genera impacto.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-screen-xl mx-auto px-4">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-center text-gray-900">
                    ¿Cómo Funciona?
                </h2>
                <p className="mb-12 text-center text-lg text-gray-600 max-w-2xl mx-auto">
                    Únete a nuestra comunidad en tres simples pasos
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">
                            <div className="absolute -top-4 -left-4 md:left-auto md:-top-6 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg z-10">
                                {step.number}
                            </div>
                            <div className="mb-4 w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shadow-md hover:shadow-xl transition-shadow">
                                {step.icon}
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 -right-6 lg:-right-8 text-primary-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
