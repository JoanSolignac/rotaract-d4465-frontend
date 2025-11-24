/**
 * Footer Component
 * Site footer with copyright and links
 */
export default function Footer() {
    return (
        <footer className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 py-12 transition-colors duration-300">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <a
                            href="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                R
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                Rotaract D4465
                            </span>
                        </a>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Servicio a través de la amistad
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <a
                            href="#"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            Sobre Nosotros
                        </a>
                        <a
                            href="#"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            Clubes
                        </a>
                        <a
                            href="#"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            Contacto
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <hr className="my-8 border-gray-200 dark:border-neutral-800" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                        © 2025 Rotaract Distrito 4465
                    </span>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            Política de Privacidad
                        </a>
                        <a
                            href="#"
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            Términos de Uso
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
