import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * NotificacionesBell Component
 * Displays a notification bell with badge and dropdown menu
 * Shows recent notifications with mark-as-read functionality
 */
export default function NotificacionesBell({ notifications, unreadCount, onMarkAsRead, onClearAll }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;

        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short'
        });
    };

    // Get recent notifications (max 10)
    const recentNotifications = notifications.slice(0, 10);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-700"
                aria-label="Notificaciones"
            >
                {/* Bell Icon */}
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {/* Badge */}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-primary-600 rounded-full border-2 border-neutral-900"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-neutral-700 bg-neutral-800/50 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">
                                Notificaciones
                                {unreadCount > 0 && (
                                    <span className="ml-2 text-xs text-primary-400">
                                        ({unreadCount} nueva{unreadCount !== 1 ? 's' : ''})
                                    </span>
                                )}
                            </h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={onClearAll}
                                    className="text-xs text-gray-400 hover:text-white transition-colors"
                                >
                                    Limpiar todo
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {recentNotifications.length === 0 ? (
                                // Empty State
                                <div className="px-4 py-8 text-center">
                                    <svg
                                        className="w-12 h-12 mx-auto text-gray-600 mb-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                        />
                                    </svg>
                                    <p className="text-sm text-gray-400">No hay notificaciones</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Te notificaremos cuando haya algo nuevo
                                    </p>
                                </div>
                            ) : (
                                // Notifications
                                <div className="divide-y divide-neutral-700">
                                    {recentNotifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`px-4 py-3 hover:bg-neutral-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary-900/10' : ''
                                                }`}
                                            onClick={() => onMarkAsRead(notification.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notification.tipo === 'success'
                                                        ? 'bg-green-900/30 text-green-400'
                                                        : 'bg-blue-900/30 text-blue-400'
                                                    }`}>
                                                    {notification.tipo === 'success' ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-medium text-white">
                                                            {notification.titulo}
                                                        </p>
                                                        {!notification.read && (
                                                            <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-1.5"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
                                                        {notification.mensaje}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatTimestamp(notification.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - Show if there are more than 10 notifications */}
                        {notifications.length > 10 && (
                            <div className="px-4 py-2 border-t border-neutral-700 bg-neutral-800/50 text-center">
                                <p className="text-xs text-gray-400">
                                    Mostrando {recentNotifications.length} de {notifications.length} notificaciones
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

NotificacionesBell.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            titulo: PropTypes.string.isRequired,
            mensaje: PropTypes.string.isRequired,
            tipo: PropTypes.string,
            timestamp: PropTypes.string.isRequired,
            read: PropTypes.bool.isRequired
        })
    ).isRequired,
    unreadCount: PropTypes.number.isRequired,
    onMarkAsRead: PropTypes.func.isRequired,
    onClearAll: PropTypes.func.isRequired
};
