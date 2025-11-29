import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import PropTypes from 'prop-types';

const WebSocketContext = createContext(null);

// Hook
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error('useWebSocket must be used within WebSocketProvider');
    return context;
};

// Parseo seguro
const parseNotification = (body) => {
    try {
        return JSON.parse(body);
    } catch {
        return {
            titulo: 'Notificación',
            mensaje: body,
            tipo: 'info'
        };
    }
};

// Provider
export function WebSocketProvider({ children, user }) {
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const clientRef = useRef(null);
    const subscriptionsRef = useRef([]);
    const reconnectAttemptsRef = useRef(0);

    const maxReconnectAttempts = 10;

    // Force logout when role changes - SECURITY PROTOCOL
    const forceLogout = useCallback(async (titulo, mensaje) => {
        const Swal = (await import('sweetalert2')).default;

        let timerInterval;
        let countdown = 10;

        await Swal.fire({
            icon: 'info',
            title: titulo || 'Actualización de Rol',
            html: `
                <div style="text-align: left; margin-bottom: 20px;">
                    <p style="font-size: 1.1em; margin-bottom: 15px; color: #e5e7eb;">
                        ${mensaje}
                    </p>
                    <p style="margin-bottom: 15px; color: #9ca3af;">
                        Para aplicar los cambios correctamente, es necesario reiniciar tu sesión.
                    </p>
                    <div style="background: #262626; padding: 10px; border-radius: 8px; border: 1px solid #404040;">
                        <p style="margin: 0; font-size: 0.9em; color: #d1d5db;">
                            Cerrando sesión en <strong id="countdown" style="color: #E2007A;">${countdown}</strong> segundos...
                        </p>
                    </div>
                </div>
            `,
            confirmButtonText: 'Entendido, cerrar ahora',
            confirmButtonColor: '#E2007A',
            background: '#171717',
            color: '#ffffff',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCancelButton: false,
            didOpen: () => {
                timerInterval = setInterval(() => {
                    countdown--;
                    const countdownElement = Swal.getHtmlContainer().querySelector('#countdown');
                    if (countdownElement) {
                        countdownElement.textContent = countdown;
                    }

                    if (countdown <= 0) {
                        clearInterval(timerInterval);
                        Swal.close();
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        });

        // Clear localStorage and redirect - FORCED LOGOUT
        console.log('🔒 Ejecutando cierre de sesión forzado por cambio de rol');
        localStorage.clear();
        window.location.href = '/login';
    }, []);

    const addNotification = useCallback((notification) => {
        // console.log('📩 Notificación recibida:', notification); // Reduced noise

        // STRICT DETECTION: Check if tipo is exactly "CAMBIO_ROL"
        // Also check if the message itself is just "CAMBIO_ROL" (plain string case)
        const isRoleChange =
            notification.tipo === 'CAMBIO_ROL' ||
            notification.mensaje === 'CAMBIO_ROL' ||
            (typeof notification === 'string' && notification.includes('CAMBIO_ROL'));

        if (isRoleChange) {
            console.log('🔒 CAMBIO_ROL detectado - Iniciando protocolo de seguridad');
            forceLogout(
                notification.titulo || '¡Cambio de Rol!',
                notification.mensaje === 'CAMBIO_ROL' ? 'Tu rol ha sido actualizado.' : (notification.mensaje || 'Tu rol ha sido actualizado')
            );
            return; // Don't add to notifications list
        }

        // FALLBACK: Ensure INSCRIPCION_ACEPTADA is seen even if toasts fail
        if (notification.tipo === 'INSCRIPCION_ACEPTADA' || notification.tipo === 'EXITO') {
            import('sweetalert2').then((Swal) => {
                Swal.default.fire({
                    icon: 'success',
                    title: notification.titulo || '¡Éxito!',
                    text: notification.mensaje,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    background: '#171717',
                    color: '#ffffff'
                });
            });
        }

        // Add to notifications list for display
        setNotifications(prev => [notification, ...prev].slice(0, 50));
    }, [forceLogout]);

    const clearNotifications = useCallback(() => setNotifications([]), []);

    const sendMessage = useCallback((destination, body) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish({
                destination,
                body: JSON.stringify(body)
            });
            console.log(`📤 Mensaje enviado a ${destination}:`, body);
        } else {
            console.warn('⚠️ WebSocket no conectado');
        }
    }, []);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        console.log('🔌 Conectando WebSocket para:', user.correo);

        const client = new Client({
            webSocketFactory: () =>
                new SockJS('https://rotaractd4465api.up.railway.app/api/v1/ws'),

            connectHeaders: {}, // ❗ Importante: sin login/passcode

            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            reconnectDelay: 5000,

            debug: (str) => console.log('🔍 STOMP:', str),

            onConnect: () => {
                console.log('✅ WebSocket conectado');
                setConnected(true);
                reconnectAttemptsRef.current = 0;

                // Suscripción general
                const subGeneral = client.subscribe('/topic/notificaciones/general', (msg) => {
                    addNotification({
                        ...parseNotification(msg.body),
                        channel: 'general',
                        timestamp: new Date().toISOString()
                    });
                });
                subscriptionsRef.current.push(subGeneral);

                // Usuario específico
                if (user.id) {
                    const subUser = client.subscribe(`/topic/notificaciones/usuario/${user.id}`, (msg) => {
                        addNotification({
                            ...parseNotification(msg.body),
                            channel: 'user',
                            timestamp: new Date().toISOString()
                        });
                    });
                    subscriptionsRef.current.push(subUser);
                }

                // Notificaciones del club
                if (user.clubId) {
                    const subClub = client.subscribe(`/topic/notificaciones/club/${user.clubId}`, (msg) => {
                        addNotification({
                            ...parseNotification(msg.body),
                            channel: 'club',
                            timestamp: new Date().toISOString()
                        });
                    });
                    subscriptionsRef.current.push(subClub);
                }

                console.log('📡 Suscripciones activas:', subscriptionsRef.current.length);
            },

            onDisconnect: () => {
                console.log('🔌 WebSocket desconectado');
                setConnected(false);
                subscriptionsRef.current = [];
            },

            onStompError: (frame) => {
                console.error('❌ STOMP error:', frame.headers['message']);
                console.error('Detalles:', frame.body);
            },

            onWebSocketError: (event) => {
                console.error('❌ Error WebSocket:', event);
                reconnectAttemptsRef.current++;
                if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    console.error('⛔ Máximos intentos de reconexión alcanzados');
                    client.deactivate();
                }
            }
        });

        // Activar
        client.activate();
        clientRef.current = client;

        return () => {
            console.log('🧹 Limpiando WebSocket');

            subscriptionsRef.current.forEach(s => {
                try { s.unsubscribe(); } catch { }
            });
            subscriptionsRef.current = [];

            clientRef.current?.deactivate();
            clientRef.current = null;

            setConnected(false);
        };
    }, [user, addNotification]);

    return (
        <WebSocketContext.Provider value={{
            connected,
            notifications,
            sendMessage,
            clearNotifications,
            forceLogout
        }}>
            {children}
        </WebSocketContext.Provider>
    );
}

WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        clubId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        correo: PropTypes.string,
        rol: PropTypes.string
    })
};
