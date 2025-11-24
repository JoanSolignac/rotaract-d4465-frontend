import { Card, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import InteresadoNavbar from '../components/InteresadoNavbar';

export default function InteresadoDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <InteresadoNavbar />

            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Bienvenido a la Plataforma Distrital Rotaract D4465
                    </h1>
                    <p className="text-xl text-gray-600">
                        Gracias por querer formar parte de la familia Rotaract.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Ver Clubs */}
                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#B40032]">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="mb-4 p-3 bg-red-50 rounded-full">
                                <svg className="w-12 h-12 text-[#B40032]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                                Ver Clubs
                            </h5>
                            <p className="font-normal text-gray-700 mb-6">
                                Explora los diferentes clubs del distrito y conoce sus actividades.
                            </p>
                            <Link to="/interesado/clubs" className="w-full">
                                <Button className="w-full bg-[#B40032] hover:bg-[#8a0026]">
                                    Explorar Clubs
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Ver Convocatorias */}
                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#B40032]">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="mb-4 p-3 bg-red-50 rounded-full">
                                <svg className="w-12 h-12 text-[#B40032]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                                Convocatorias
                            </h5>
                            <p className="font-normal text-gray-700 mb-6">
                                Encuentra oportunidades para unirte a proyectos y actividades.
                            </p>
                            <Link to="/interesado/convocatorias" className="w-full">
                                <Button className="w-full bg-[#B40032] hover:bg-[#8a0026]">
                                    Ver Disponibles
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Mis Inscripciones */}
                    <Card className="hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#B40032]">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="mb-4 p-3 bg-red-50 rounded-full">
                                <svg className="w-12 h-12 text-[#B40032]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                                Mis Inscripciones
                            </h5>
                            <p className="font-normal text-gray-700 mb-6">
                                Revisa el estado de tus postulaciones y actividades inscritas.
                            </p>
                            <Link to="/interesado/inscripciones" className="w-full">
                                <Button className="w-full bg-[#B40032] hover:bg-[#8a0026]">
                                    Consultar Estado
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
