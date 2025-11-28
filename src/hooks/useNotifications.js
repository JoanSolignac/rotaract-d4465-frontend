import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for WebSocket notifications
 * Simplified version without STOMP to avoid module errors
 */
export default function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [connected, setConnected] = useState(false);

    const showToast = useCallback((notification) => {
        // Add notification to list
        setNotifications(prev => [notification, ...prev].slice(0, 10));

        // Vibrate on mobile if available
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }

        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.titulo, {
                body: notification.mensaje,
                icon: '/rotaract-icon.png'
            });
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Simulate connection for now
        // TODO: Implement WebSocket when backend is ready
        setConnected(false);

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Cleanup on unmount
        return () => {
            setConnected(false);
        };
    }, []);

    // Manual method to add notifications (for testing)
    const addNotification = useCallback((notification) => {
        showToast(notification);
    }, [showToast]);

    return {
        notifications,
        connected,
        addNotification
    };
}
