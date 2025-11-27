import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import websocketService from '../services/websocketService';

/**
 * Custom hook for WebSocket notifications
 * Connects to backend WebSocket and listens for user-specific notifications
 * Handles automatic logout on role changes
 * 
 * @param {number|string} userId - The ID of the current user
 * @returns {object} - Notifications state and methods
 */
export default function useWebSocketNotifications(userId) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const subscriptionIdRef = useRef(null);
    const navigate = useNavigate();

    // Force logout and redirect to login
    const forceLogout = useCallback(async (message) => {
        // Show alert to user
        await Swal.fire({
            icon: 'info',
            title: 'Cambio de Rol Detectado',
            html: `${message}<br><br><small class="text-gray-400">Se cerrará tu sesión para aplicar los cambios.</small>`,
            confirmButtonColor: '#8C1D40',
            background: '#171717',
            color: '#ffffff',
            timer: 4000,
            timerProgressBar: true,
            allowOutsideClick: false
        });

        // Clear localStorage and redirect
        localStorage.clear();
        window.location.href = '/login';
    }, []);

    // Show toast notification
    const showToast = useCallback((titulo, mensaje, type = 'info') => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            background: type === 'success' ? '#065f46' : '#1e3a8a',
            color: '#ffffff',
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: type === 'success' ? 'success' : 'info',
            title: titulo,
            text: mensaje
        });
    }, []);

    // Handle incoming notification
    const handleNotification = useCallback((notification) => {
        console.log('Received notification:', notification);

        // Extract message and type
        const titulo = notification.titulo || notification.title || 'Notificación';
        const mensaje = notification.mensaje || notification.message || '';
        const tipo = notification.tipo || notification.type || 'info';
        const requiresLogout = notification.requiresLogout || false;

        // Check if this is a role change notification
        const isRoleChange =
            tipo === 'CAMBIO_ROL' ||
            requiresLogout ||
            mensaje.toLowerCase().includes('cambio de rol') ||
            mensaje.toLowerCase().includes('ahora eres socio') ||
            mensaje.toLowerCase().includes('has sido aceptado') ||
            mensaje.toLowerCase().includes('inscripción aceptada') ||
            titulo.toLowerCase().includes('cambio de rol');

        if (isRoleChange) {
            // Force logout for role changes
            forceLogout(mensaje);
        } else {
            // Create notification object
            const newNotification = {
                id: Date.now() + Math.random(),
                titulo,
                mensaje,
                tipo,
                timestamp: new Date().toISOString(),
                read: false
            };

            // Add to notifications list (keep max 50)
            setNotifications(prev => [newNotification, ...prev].slice(0, 50));
            setUnreadCount(prev => prev + 1);

            // Show toast
            showToast(titulo, mensaje, tipo);
        }
    }, [forceLogout, showToast]);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, read: true }
                    : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    }, []);

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    // Connect and subscribe to notifications
    useEffect(() => {
        if (!userId) {
            return;
        }

        let mounted = true;

        const connectAndSubscribe = async () => {
            try {
                // Connect to WebSocket
                await websocketService.connect();

                if (!mounted) return;

                setIsConnected(true);

                // Subscribe to user-specific notifications
                const destination = `/topic/notificaciones/usuario/${userId}`;
                const subId = websocketService.subscribe(destination, handleNotification);

                subscriptionIdRef.current = subId;
                console.log(`Subscribed to notifications for user ${userId}`);

            } catch (error) {
                console.error('Error connecting to WebSocket:', error);
                if (mounted) {
                    setIsConnected(false);
                }
            }
        };

        // Register connection callbacks
        websocketService.onConnect(() => {
            if (mounted) {
                setIsConnected(true);
                console.log('WebSocket connected');
            }
        });

        websocketService.onDisconnect(() => {
            if (mounted) {
                setIsConnected(false);
                console.log('WebSocket disconnected');
            }
        });

        websocketService.onError((error) => {
            console.error('WebSocket error:', error);
            if (mounted) {
                setIsConnected(false);
            }
        });

        // Connect and subscribe
        connectAndSubscribe();

        // Cleanup
        return () => {
            mounted = false;
            if (subscriptionIdRef.current) {
                websocketService.unsubscribe(subscriptionIdRef.current);
                subscriptionIdRef.current = null;
            }
        };
    }, [userId, handleNotification]);

    return {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearAll
    };
}
