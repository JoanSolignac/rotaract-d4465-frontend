/**
 * Utility functions for handling date formatting
 * Fixes the UTC offset issue when parsing dates from backend
 */

/**
 * Parses a date string in "yyyy-MM-dd" format to a local Date object
 * @param {string} dateString - Date in "yyyy-MM-dd" format
 * @returns {Date} Local date object
 */
export function parseLocalDate(dateString) {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Formats a date string from backend to localized Spanish format
 * @param {string} dateString - Date in "yyyy-MM-dd" format
 * @returns {string} Formatted date string
 */
export function formatLocalDate(dateString) {
    const date = parseLocalDate(dateString);
    return date.toLocaleDateString("es-PE");
}
