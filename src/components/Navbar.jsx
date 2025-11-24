import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Navbar Component
 * Responsive navigation bar with Rotaract D4465 branding
 */
export default function AppNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 top-0 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <span className="self-center text-2xl font-bold whitespace-nowrap text-primary-600">
                        Rotaract D4465
                    </span>
                </Link>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Abrir menú principal</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>

                {/* Desktop Action Buttons (Visible on MD+) */}
                <div className="hidden md:flex md:order-2 gap-2">
                    <Link
                        to="/register"
                        className="px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 focus:ring-4 focus:ring-primary-300 focus:outline-none transition-all"
                    >
                        Registrarse
                    </Link>
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 focus:outline-none transition-all"
                    >
                        Iniciar Sesión
                    </Link>
                </div>

                {/* Navigation Links & Mobile Actions */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`} id="navbar-menu">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link
                                to="/"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-600 md:p-0"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/clubes"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-600 md:p-0"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Clubes
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/convocatorias"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-600 md:p-0"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Convocatorias
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/proyectos"
                                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-600 md:p-0"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Proyectos
                            </Link>
                        </li>

                        {/* Mobile Action Buttons (Visible only on small screens inside menu) */}
                        <li className="md:hidden mt-4 border-t pt-4 flex flex-col gap-2">
                            <Link
                                to="/register"
                                className="block w-full text-center px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Registrarse
                            </Link>
                            <Link
                                to="/login"
                                className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
