/**
 * Centralized fetch client for API calls
 * Handles JWT authentication and error responses
 */

const BASE_URL = 'https://rotaractd4465api.up.railway.app';

/**
 * Makes an authenticated fetch request with JSON parsing
 * @param {string} path - API endpoint path (e.g., '/api/v1/clubs/metricas')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<object>} Parsed JSON response
 */
export async function fetchJson(path, options = {}) {
    const token = localStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${path}`, config);

        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }

        // Handle other error responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || errorData.errors?.[0] || `Error: ${response.status}`;
            throw new Error(errorMessage);
        }

        // Parse and return JSON response
        return await response.json();
    } catch (error) {
        // Re-throw error for component-level handling
        throw error;
    }
}

/**
 * GET request helper
 * @param {string} path - API endpoint path
 * @returns {Promise<object>} Parsed JSON response
 */
export async function get(path) {
    return fetchJson(path, { method: 'GET' });
}

/**
 * POST request helper
 * @param {string} path - API endpoint path
 * @param {object} body - Request body
 * @returns {Promise<object>} Parsed JSON response
 */
export async function post(path, body) {
    return fetchJson(path, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * PUT request helper
 * @param {string} path - API endpoint path
 * @param {object} body - Request body
 * @returns {Promise<object>} Parsed JSON response
 */
export async function put(path, body) {
    return fetchJson(path, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/**
 * DELETE request helper
 * @param {string} path - API endpoint path
 * @returns {Promise<object>} Parsed JSON response
 */
export async function del(path) {
    return fetchJson(path, { method: 'DELETE' });
}
