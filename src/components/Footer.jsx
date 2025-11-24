/**
 * Footer Component
 * Site footer with copyright and links
 */
export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="w-full text-center">
                    <div className="w-full justify-between sm:flex sm:items-center sm:justify-between mb-4">
                        {/* Brand */}
                        <a
                            href="/"
                            className="text-primary-600 font-bold text-xl hover:text-primary-700 transition-colors inline-block mb-4 sm:mb-0"
                        >
                            Rotaract D4465
                        </a>

                        {/* Links */}
                        <div className="flex justify-center gap-6">
                            <a
                                href="#"
                                className="text-gray-600 hover:text-primary-600 focus:ring-2 focus:ring-primary-300 focus:outline-none rounded px-2 py-1 transition-colors"
                            >
                                Política de Privacidad
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-primary-600 focus:ring-2 focus:ring-primary-300 focus:outline-none rounded px-2 py-1 transition-colors"
                            >
                                Términos de Uso
                            </a>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="my-4 border-gray-200" />

                    {/* Copyright */}
                    <div className="mt-4">
                        <span className="text-sm text-gray-600">
                            © 2025 Rotaract Distrito 4465 – Todos los derechos reservados
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
