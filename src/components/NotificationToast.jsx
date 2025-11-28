import { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '../contexts/WebSocketContext';

/**
 * NotificationToast Component
 * Automatically shows toast notifications when new WebSocket notifications arrive
 * Uses react-toastify for beautiful toast notifications in the corner
 */
export default function NotificationToast() {
    const { notifications } = useWebSocket();
    const shownNotificationsRef = useRef(new Set());

    useEffect(() => {
        // Show toast for new notifications
        if (notifications.length > 0) {
            const latestNotification = notifications[0];
            const notificationId = latestNotification.timestamp;

            // Only show if we haven't shown this notification before
            if (!shownNotificationsRef.current.has(notificationId)) {
                shownNotificationsRef.current.add(notificationId);

                // Map notification tipo to toast type
                let toastType = 'info'; // default
                const tipo = latestNotification.tipo?.toUpperCase();

                if (tipo === 'EXITO' || tipo === 'SUCCESS' || tipo === 'INSCRIPCION_ACEPTADA') {
                    toastType = 'success';
                } else if (tipo === 'ERROR' || tipo === 'RECHAZO') {
                    toastType = 'error';
                } else if (tipo === 'ALERTA' || tipo === 'WARNING') {
                    toastType = 'warning';
                } else {
                    toastType = 'info';
                }

                console.log('🎉 Mostrando toast:', { tipo: latestNotification.tipo, toastType, titulo: latestNotification.titulo });

                toast[toastType](
                    <div>
                        <strong>{latestNotification.titulo}</strong>
                        <p className="text-sm mt-1">{latestNotification.mensaje}</p>
                    </div>,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "dark",
                    }
                );
            }
        }
    }, [notifications]);

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            style={{ zIndex: 99999 }} // Force on top of everything
        />
    );
}
