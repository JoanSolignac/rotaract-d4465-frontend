import SockJS from 'sockjs-client';
import { Stomp } from 'stompjs';

/**
 * WebSocket Service
 * Manages WebSocket connection using SockJS and STOMP protocol
 * Connects to Spring Boot backend at /ws endpoint
 */
class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.socket = null;
        this.subscriptions = new Map();
        this.reconnectTimeout = null;
        this.isConnecting = false;
        this.isConnected = false;
        this.reconnectDelay = 5000; // 5 seconds
        this.maxReconnectAttempts = Infinity;
        this.reconnectAttempts = 0;
        this.onConnectCallbacks = [];
        this.onDisconnectCallbacks = [];
        this.onErrorCallbacks = [];
    }

    /**
     * Connect to WebSocket server
     * @param {string} url - WebSocket endpoint URL
     * @returns {Promise<void>}
     */
    connect(url = 'https://rotaract4465api.up.railway.app/ws') {
        return new Promise((resolve, reject) => {
            if (this.isConnected || this.isConnecting) {
                console.log('WebSocket already connected or connecting');
                resolve();
                return;
            }

            this.isConnecting = true;
            console.log('Connecting to WebSocket:', url);

            try {
                // Create SockJS connection
                this.socket = new SockJS(url);

                // Create STOMP client
                this.stompClient = Stomp.over(this.socket);

                // Disable debug logging in production
                this.stompClient.debug = (msg) => {
                    if (import.meta.env.DEV) {
                        console.log('[STOMP]', msg);
                    }
                };

                // Connect to STOMP server
                this.stompClient.connect(
                    {}, // headers
                    (frame) => {
                        // Connection successful
                        console.log('WebSocket connected:', frame);
                        this.isConnected = true;
                        this.isConnecting = false;
                        this.reconnectAttempts = 0;

                        // Call onConnect callbacks
                        this.onConnectCallbacks.forEach(callback => {
                            try {
                                callback();
                            } catch (error) {
                                console.error('Error in onConnect callback:', error);
                            }
                        });

                        resolve();
                    },
                    (error) => {
                        // Connection error
                        console.error('WebSocket connection error:', error);
                        this.isConnected = false;
                        this.isConnecting = false;

                        // Call onError callbacks
                        this.onErrorCallbacks.forEach(callback => {
                            try {
                                callback(error);
                            } catch (err) {
                                console.error('Error in onError callback:', err);
                            }
                        });

                        // Attempt to reconnect
                        this.scheduleReconnect(url);

                        reject(error);
                    }
                );

                // Handle socket close
                this.socket.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.isConnected = false;
                    this.isConnecting = false;

                    // Call onDisconnect callbacks
                    this.onDisconnectCallbacks.forEach(callback => {
                        try {
                            callback();
                        } catch (error) {
                            console.error('Error in onDisconnect callback:', error);
                        }
                    });

                    // Attempt to reconnect
                    this.scheduleReconnect(url);
                };

            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
                this.isConnecting = false;
                this.scheduleReconnect(url);
                reject(error);
            }
        });
    }

    /**
     * Schedule reconnection attempt
     * @param {string} url - WebSocket endpoint URL
     */
    scheduleReconnect(url) {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnect attempts reached');
            return;
        }

        this.reconnectAttempts++;
        console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${this.reconnectDelay}ms`);

        this.reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect...');
            this.connect(url).catch(error => {
                console.error('Reconnection failed:', error);
            });
        }, this.reconnectDelay);
    }

    /**
     * Subscribe to a STOMP destination
     * @param {string} destination - STOMP destination (e.g., /topic/notificaciones/usuario/123)
     * @param {Function} callback - Callback function to handle messages
     * @returns {string} - Subscription ID
     */
    subscribe(destination, callback) {
        if (!this.isConnected || !this.stompClient) {
            console.error('Cannot subscribe: WebSocket not connected');
            return null;
        }

        try {
            const subscription = this.stompClient.subscribe(destination, (message) => {
                try {
                    const body = JSON.parse(message.body);
                    callback(body);
                } catch (error) {
                    console.error('Error parsing message:', error);
                    // Call callback with raw message if parsing fails
                    callback(message.body);
                }
            });

            const subscriptionId = subscription.id;
            this.subscriptions.set(subscriptionId, { destination, subscription });

            console.log(`Subscribed to ${destination} with ID ${subscriptionId}`);
            return subscriptionId;
        } catch (error) {
            console.error('Error subscribing to destination:', error);
            return null;
        }
    }

    /**
     * Unsubscribe from a STOMP destination
     * @param {string} subscriptionId - Subscription ID returned from subscribe()
     */
    unsubscribe(subscriptionId) {
        const sub = this.subscriptions.get(subscriptionId);
        if (sub) {
            try {
                sub.subscription.unsubscribe();
                this.subscriptions.delete(subscriptionId);
                console.log(`Unsubscribed from ${sub.destination}`);
            } catch (error) {
                console.error('Error unsubscribing:', error);
            }
        }
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect() {
        // Clear reconnect timeout
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        // Unsubscribe from all subscriptions
        this.subscriptions.forEach((sub, id) => {
            try {
                sub.subscription.unsubscribe();
            } catch (error) {
                console.error('Error unsubscribing:', error);
            }
        });
        this.subscriptions.clear();

        // Disconnect STOMP client
        if (this.stompClient && this.isConnected) {
            try {
                this.stompClient.disconnect(() => {
                    console.log('WebSocket disconnected gracefully');
                });
            } catch (error) {
                console.error('Error disconnecting STOMP client:', error);
            }
        }

        // Close socket
        if (this.socket) {
            try {
                this.socket.close();
            } catch (error) {
                console.error('Error closing socket:', error);
            }
        }

        this.isConnected = false;
        this.isConnecting = false;
        this.stompClient = null;
        this.socket = null;
    }

    /**
     * Register callback for connection event
     * @param {Function} callback
     */
    onConnect(callback) {
        this.onConnectCallbacks.push(callback);
    }

    /**
     * Register callback for disconnection event
     * @param {Function} callback
     */
    onDisconnect(callback) {
        this.onDisconnectCallbacks.push(callback);
    }

    /**
     * Register callback for error event
     * @param {Function} callback
     */
    onError(callback) {
        this.onErrorCallbacks.push(callback);
    }

    /**
     * Get connection status
     * @returns {boolean}
     */
    getConnectionStatus() {
        return this.isConnected;
    }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
