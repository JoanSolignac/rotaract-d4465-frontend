import { get, put } from './fetchClient';

/**
 * Profile Service
 * Handles user profile operations
 */

/**
 * Get current user profile
 * @returns {Promise<object>} User profile data
 */
export async function getProfile() {
    return get('/api/v1/usuarios/perfil');
}

/**
 * Update current user profile
 * @param {object} data - Profile data to update
 * @param {string} data.nombre - User name
 * @param {string} data.correo - User email
 * @param {string} data.ciudad - User city
 * @returns {Promise<object>} Updated profile data
 */
export async function updateProfile(data) {
    return put('/api/v1/usuarios/perfil', data);
}
