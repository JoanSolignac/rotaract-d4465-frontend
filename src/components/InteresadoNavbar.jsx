import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function InteresadoNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Get user data from localStorage
        const nombre = localStorage.getItem('nombre');
        const correo = localStorage.getItem('correo');
        const rol = localStorage.getItem('rol');

        setUserName(nombre || 'Usuario');
        setUserEmail(correo || '');
        setUserRole(rol || '');
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
    const linkClass = (path) =>
        `block py-2 pl-3 pr-4 rounded md:p-0 ${isActive(path)
            ? 'text-[#B40032] font-bold bg-gray-100 md:bg-transparent'
            : 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#B40032]'}`;

    // Get initials from name
    const getInitials = (name) => {
        if (!name || name === 'Usuario') return 'U';
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    // Get display name (first two names)
    const getDisplayName = (name) => {
        if (!name || name === 'Usuario') return 'Usuario';
        const names = name.trim().split(' ');
        return names.slice(0, 2).join(' ');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link to="/interesado" className="flex items-center">
                    <span className="self-center text-2xl font-bold whitespace-nowrap text-[#B40032]">
                        Rotaract D4465
                    </span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Abrir menú</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>

                {/* Desktop Profile Dropdown */}
                <div className="hidden md:flex md:order-2 items-center gap-3" ref={dropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#B40032] flex items-center justify-center text-white font-bold">
                                {getInitials(userName)}
                            </div>
                            <span className="hidden lg:block font-medium text-gray-900 pr-3">
                                {getDisplayName(userName)}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <span className="block text-sm font-semibold text-gray-900">{userName}</span>
                                    <span className="block text-sm text-gray-500 truncate">{userEmail}</span>
                                    <span className="block text-xs text-gray-400 mt-1">Rol: {userRole}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu Links */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`} id="navbar-menu">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link to="/interesado" className={linkClass('/interesado')} onClick={() => setIsMenuOpen(false)}>
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link to="/interesado/clubs" className={linkClass('/interesado/clubs')} onClick={() => setIsMenuOpen(false)}>
                                Clubs
                            </Link>
                        </li>
                        <li>
                            <Link to="/interesado/convocatorias" className={linkClass('/interesado/convocatorias')} onClick={() => setIsMenuOpen(false)}>
                                Convocatorias
                            </Link>
                        </li>
                        <li>
                            <Link to="/interesado/inscripciones" className={linkClass('/interesado/inscripciones')} onClick={() => setIsMenuOpen(false)}>
                                Mis Inscripciones
                            </Link>
                        </li>

                        {/* Mobile Profile Section */}
                        <li className="md:hidden mt-4 pt-4 border-t border-gray-200">
                            <div className="px-4 py-3 bg-gray-100 rounded-lg mb-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-[#B40032] flex items-center justify-center text-white font-bold">
                                        {getInitials(userName)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Rol: {userRole}</p>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-white bg-[#B40032] hover:bg-[#8a0026] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
