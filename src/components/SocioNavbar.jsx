import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocioNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Get user data from localStorage
        const nombre = localStorage.getItem('nombre');
        const correo = localStorage.getItem('correo');
        const rol = localStorage.getItem('rol');

        setUserName(nombre || 'Socio');
        setUserEmail(correo || '');
        setUserRole(rol || 'SOCIO');
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    // Get initials from name
    const getInitials = (name) => {
        if (!name || name === 'Socio') return 'S';
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    // Get display name (first two names)
    const getDisplayName = (name) => {
        if (!name || name === 'Socio') return 'Socio';
        const names = name.trim().split(' ');
        return names.slice(0, 2).join(' ');
    };

    const navLinks = [
        { path: '/socio', label: 'Inicio' },
        { path: '/socio/proyectos', label: 'Proyectos Disponibles' },
        { path: '/socio/inscripciones', label: 'Mis Inscripciones' },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link to="/socio" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                        R
                    </div>
                    <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        Rotaract D4465
                    </span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-neutral-700 transition-colors"
                    aria-controls="navbar-menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Abrir menú</span>
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

                {/* Desktop Profile Dropdown & Theme Toggle */}
                <div className="hidden md:flex md:order-2 items-center gap-3" ref={dropdownRef}>
                    {/* Theme Toggle */}
                    <button
                        onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-neutral-600 transition-all pr-3"
                        >
                            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                {getInitials(userName)}
                            </div>
                            <span className="hidden lg:block font-medium text-gray-900 dark:text-white">
                                {getDisplayName(userName)}
                            </span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-700 z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50">
                                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">{userName}</span>
                                        <span className="block text-sm text-gray-500 dark:text-gray-400 truncate">{userEmail}</span>
                                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                                            {userRole}
                                        </span>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            to="/perfil/editar"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Editar Perfil
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Menu Links */}
                <div className="hidden md:block md:w-auto md:order-1" id="navbar-menu">
                    <ul className="flex flex-row space-x-8 font-medium">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`relative py-2 px-1 transition-colors ${isActive(link.path)
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                >
                                    {link.label}
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="navbar-indicator-socio"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
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
                            className="w-full md:hidden overflow-hidden bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800"
                        >
                            <ul className="flex flex-col p-4 font-medium space-y-4">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className={`block py-2 px-3 rounded-lg ${isActive(link.path)
                                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}

                                {/* Mobile Profile Section */}
                                <li className="pt-4 border-t border-gray-100 dark:border-neutral-800">
                                    <div className="flex items-center justify-between px-3 mb-4">
                                        <span className="text-gray-600 dark:text-gray-400">Tema</span>
                                        <button
                                            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                        >
                                            {theme === 'dark' ? (
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                    <span>Claro</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                    </svg>
                                                    <span>Oscuro</span>
                                                </div>
                                            )}
                                        </button>
                                    </div>

                                    <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-800 rounded-xl mb-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                                                {getInitials(userName)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">Rol: {userRole}</p>
                                    </div>
                                    <Link
                                        to="/perfil/editar"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900 font-medium rounded-lg text-sm px-4 py-2.5 text-center flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary-600/20 mb-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Editar Perfil
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-900 font-medium rounded-lg text-sm px-4 py-2.5 text-center flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
