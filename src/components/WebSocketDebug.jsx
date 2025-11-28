import { useWebSocket } from '../contexts/WebSocketContext';

/**
 * WebSocket Debug Component
 * Shows WebSocket connection status and user info
 * Add this temporarily to any page to debug WebSocket issues
 */
export default function WebSocketDebug() {
    const { connected, notifications } = useWebSocket();

    const userId = localStorage.getItem('userId');
    const correo = localStorage.getItem('correo');
    const rol = localStorage.getItem('rol');
    const clubId = localStorage.getItem('clubId');

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#1f2937',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 9999,
            border: '2px solid #3b82f6',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
                🔍 WebSocket Debug
            </h3>

            <div style={{ marginBottom: '10px' }}>
                <strong>Estado:</strong>{' '}
                <span style={{ color: connected ? '#10b981' : '#ef4444' }}>
                    {connected ? '✅ Conectado' : '❌ Desconectado'}
                </span>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>User ID:</strong> {userId || '❌ NULL'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Correo:</strong> {correo || '❌ NULL'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Rol:</strong> {rol || '❌ NULL'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Club ID:</strong> {clubId || 'N/A'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Notificaciones:</strong> {notifications.length}
            </div>

            <div style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid #4b5563',
                fontSize: '11px',
                color: '#9ca3af'
            }}>
                <strong>Canales suscritos:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    <li>/topic/notificaciones/general</li>
                    {userId && <li>/topic/notificaciones/usuario/{userId}</li>}
                    {clubId && <li>/topic/notificaciones/club/{clubId}</li>}
                </ul>
            </div>

            {notifications.length > 0 && (
                <div style={{
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '1px solid #4b5563'
                }}>
                    <strong>Última notificación:</strong>
                    <pre style={{
                        fontSize: '10px',
                        background: '#111827',
                        padding: '5px',
                        borderRadius: '4px',
                        marginTop: '5px',
                        overflow: 'auto',
                        maxHeight: '100px'
                    }}>
                        {JSON.stringify(notifications[0], null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
