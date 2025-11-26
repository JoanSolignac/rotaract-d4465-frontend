import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NavbarRepresentante Component
 * Simplified navbar for District Representative with only: Inicio, Clubes, Cerrar sesión
 */
export default function NavbarRepresentante() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Get user data from localStorage
        const nombre = localStorage.getItem('nombre');
        const correo = localStorage.getItem('correo');

        setUserName(nombre || 'Representante');
        setUserEmail(correo || '');
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
        if (!name || name === 'Representante') return 'RD';
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    // Get display name (first two names)
    const getDisplayName = (name) => {
        if (!name || name === 'Representante') return 'Representante';
        const names = name.trim().split(' ');
        return names.slice(0, 2).join(' ');
    };

    // Only 2 navigation links: Inicio and Clubes
    const navLinks = [
        { path: '/representante', label: 'Inicio' },
        { path: '/representante/clubes', label: 'Clubes' },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 transition-colors duration-300">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link to="/representante" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-[#8C1D40] rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                        R
                    </div>
                    <span className="self-center text-xl font-bold whitespace-nowrap text-white group-hover:text-[#E51A4C] transition-colors">
                        Rotaract D4465
                    </span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700 transition-colors"
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

                {/* Desktop Profile Dropdown */}
                <div className="hidden md:flex md:order-2 items-center gap-3" ref={dropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 text-sm bg-neutral-800 rounded-full hover:bg-neutral-700 focus:ring-4 focus:ring-neutral-600 transition-all pr-3"
                        >
                            <div className="w-9 h-9 rounded-full bg-[#8C1D40] flex items-center justify-center text-white font-bold text-sm">
                                {getInitials(userName)}
                            </div>
                            <span className="hidden lg:block font-medium text-white">
                                {getDisplayName(userName)}
                            </span>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    className="absolute right-0 mt-2 w-64 bg-neutral-800 rounded-xl shadow-xl border border-neutral-700 z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-neutral-700 bg-neutral-800/50">
                                        <span className="block text-sm font-semibold text-white">{userName}</span>
                                        <span className="block text-sm text-gray-400 truncate">{userEmail}</span>
                                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-[#8C1D40]/30 text-[#E51A4C] rounded-full">
                                            REPRESENTANTE DISTRITAL
                                        </span>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-2 transition-colors"
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
                                            ? 'text-[#E51A4C]'
                                            : 'text-gray-300 hover:text-[#E51A4C]'
                                        }`}
                                >
                                    {link.label}
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="navbar-indicator-representante"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E51A4C] rounded-full"
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
                                                    ? 'bg-[#8C1D40]/20 text-[#E51A4C]'
                                                    : 'text-gray-300 hover:bg-neutral-800'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}

                                {/* Mobile Profile Section */}
                                <li className="pt-4 border-t border-neutral-800">
                                    <div className="px-4 py-3 bg-neutral-800 rounded-xl mb-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-[#8C1D40] flex items-center justify-center text-white font-bold">
                                                {getInitials(userName)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                                                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#E51A4C] font-medium">Rol: REPRESENTANTE DISTRITAL</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-900 font-medium rounded-lg text-sm px-4 py-2.5 text-center flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20"
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
