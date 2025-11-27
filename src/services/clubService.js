import { get, patch } from './fetchClient';

/**
 * Club Service
 * Handles club operations
 */

/**
 * Get club public data
 * @param {number} id - Club ID
 * @returns {Promise<object>} Club data
 */
export async function getClubPublic(id) {
    return get(`/api/v1/clubs/public/${id}`);
}

/**
 * Update club data
 * @param {number} id - Club ID
 * @param {object} data - Club data to update
 * @param {string} data.nombre - Club name
 * @param {string} data.departamento - Club department
 * @param {string} data.ciudad - Club city
 * @returns {Promise<object>} Updated club data
 */
export async function updateClub(id, data) {
    return patch(`/api/v1/clubs/${id}`, data);
}
