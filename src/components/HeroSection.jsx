import { Button } from 'flowbite-react';
import heroImage from '../assets/images/rotaractd4465.png';

/**
 * Hero Section Component
 * Institutional layout with enlarged banner image + hover effect
 */
export default function HeroSection() {
    return (
        <section className="pt-24 pb-12 lg:pt-28 lg:pb-20 bg-white">
            <div className="max-w-screen-xl mx-auto px-4">

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Banner Image (larger + hover effect) */}
                    <div className="flex justify-center">
                        <img
                            src={heroImage}
                            alt="Rotaract D4465 Banner 2025-2026"
                            className="
                                w-full
                                lg:w-[130%]
                                xl:w-[150%]
                                max-h-[420px]
                                object-cover
                                rounded-2xl
                                shadow-xl
                                border border-gray-200

                                transition-all 
                                duration-500 
                                ease-out 
                                hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]
                                hover:-translate-y-1
                            "
                        />
                    </div>

                    {/* Text Section */}
                    <div className="text-left lg:pl-6">
                        <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl text-gray-900">
                            Plataforma Distrital de Voluntariado Rotaract D4465
                        </h1>

                        <p className="mb-8 text-lg text-gray-700 leading-relaxed max-w-lg">
                            Conecta con los clubes, participa en convocatorias y contribuye 
                            al desarrollo de proyectos de impacto en el Distrito 4465.
                        </p>

                        <Button
                            size="lg"
                            className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 px-8 py-3 font-semibold"
                        >
                            Únete ahora
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
}
