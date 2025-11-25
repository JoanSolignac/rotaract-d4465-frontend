import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SocioInicio() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#050506] flex flex-col"
        >
            <div className="flex-grow container mx-auto px-4 py-12 pt-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Bienvenido Socio <br />
                        <span className="text-primary-600">Rotaract D4465</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Gestiona tu participación en proyectos y actividades del distrito.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Ver Proyectos Disponibles */}
                    <div className="bg-neutral-900 rounded-2xl p-8 shadow-lg shadow-black/20 border border-neutral-800 hover:border-primary-600/50 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center group">
                        <div className="mb-6 p-4 bg-primary-900/20 rounded-full group-hover:bg-primary-900/30 transition-colors shadow-lg shadow-primary-600/10">
                            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h5 className="text-2xl font-bold tracking-tight text-white mb-3">
                            Proyectos Disponibles
                        </h5>
                        <p className="font-normal text-gray-400 mb-8 flex-grow">
                            Explora los proyectos disponibles en tu club y postúlate para participar.
                        </p>
                        <Link to="/socio/proyectos" className="w-full">
                            <Button className="w-full bg-neutral-800 hover:bg-primary-600 text-white border-none rounded-xl transition-colors duration-300 shadow-none">
                                Ver Proyectos
                            </Button>
                        </Link>
                    </div>

                    {/* Mis Inscripciones */}
                    <div className="bg-neutral-900 rounded-2xl p-8 shadow-lg shadow-black/20 border border-neutral-800 hover:border-primary-600/50 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center group">
                        <div className="mb-6 p-4 bg-primary-900/20 rounded-full group-hover:bg-primary-900/30 transition-colors shadow-lg shadow-primary-600/10">
                            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h5 className="text-2xl font-bold tracking-tight text-white mb-3">
                            Mis Inscripciones
                        </h5>
                        <p className="font-normal text-gray-400 mb-8 flex-grow">
                            Revisa el estado de tus postulaciones y los proyectos en los que participas.
                        </p>
                        <Link to="/socio/inscripciones" className="w-full">
                            <Button className="w-full bg-neutral-800 hover:bg-primary-600 text-white border-none rounded-xl transition-colors duration-300 shadow-none">
                                Consultar Estado
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
