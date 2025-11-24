import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navbar Component
 * Responsive navigation bar with Rotaract D4465 branding
 */
export default function AppNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/clubes', label: 'Clubes' },
        { path: '/convocatorias', label: 'Convocatorias' },
        { path: '/proyectos', label: 'Proyectos' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 top-0 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-neutral-800 transition-colors duration-300">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                        R
                    </div>
                    <span className="self-center text-xl font-bold whitespace-nowrap text-white group-hover:text-primary-400 transition-colors">
                        Rotaract D4465
                    </span>
                </Link>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700 transition-colors"
                    aria-controls="navbar-menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Abrir menú principal</span>
                    {isMenuOpen ? (
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    )}
                </button>

                {/* Desktop Action Buttons (Visible on MD+) */}
                <div className="hidden md:flex md:order-2 gap-3 items-center">
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary-400 transition-colors"
                    >
                        Iniciar Sesión
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 focus:ring-4 focus:ring-primary-900 focus:outline-none transition-all shadow-lg shadow-primary-600/20"
                    >
                        Registrarse
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:block md:w-auto md:order-1" id="navbar-menu">
                    <ul className="flex flex-row space-x-8 font-medium">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`relative py-2 px-1 transition-colors ${isActive(link.path)
                                        ? 'text-primary-400'
                                        : 'text-gray-300 hover:text-primary-400'
                                        }`}
                                >
                                    {link.label}
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 rounded-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full md:hidden overflow-hidden bg-neutral-900 border-t border-neutral-800"
                        >
                            <ul className="flex flex-col p-4 font-medium space-y-4">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className={`block py-2 px-3 rounded-lg ${isActive(link.path)
                                                ? 'bg-primary-900/20 text-primary-400'
                                                : 'text-gray-300 hover:bg-neutral-800'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                <li className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-200 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
