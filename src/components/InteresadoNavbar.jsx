import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/rotaractd4465.png';

export default function InteresadoNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;
    const linkClass = (path) =>
        `block py-2 pl-3 pr-4 rounded md:p-0 ${isActive(path)
            ? 'text-[#B40032] font-bold bg-gray-100 md:bg-transparent'
            : 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#B40032]'}`;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Brand */}
                <Link to="/interesado" className="flex items-center">
                    <img src={logo} className="h-12 mr-3" alt="Rotaract Logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-[#B40032] hidden sm:block">
                        Distrito 4465
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

                {/* Desktop Actions */}
                <div className="hidden md:flex md:order-2">
                    <button
                        onClick={handleLogout}
                        className="text-white bg-[#B40032] hover:bg-[#8a0026] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0"
                    >
                        Cerrar Sesión
                    </button>
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

                        {/* Mobile Logout Button */}
                        <li className="md:hidden mt-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-white bg-[#B40032] hover:bg-[#8a0026] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
