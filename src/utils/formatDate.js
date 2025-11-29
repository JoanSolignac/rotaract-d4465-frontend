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
    if (!dateString) return new Date(); // Return current date as fallback if null/undefined

    try {
        // Handle array format [yyyy, MM, dd, HH, mm, ss] (Spring Boot default)
        if (Array.isArray(dateString)) {
            const [year, month, day] = dateString;
            // Ensure components are valid numbers
            if (typeof year === 'number' && typeof month === 'number' && typeof day === 'number') {
                const date = new Date(year, month - 1, day);
                if (!isNaN(date.getTime())) return date;
            }
        }

        // Handle ISO string or standard string
        if (typeof dateString === 'string') {
            // Try standard parsing first
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date;
            }

            // Fallback for "yyyy-MM-dd" if standard parsing fails
            const parts = dateString.split("-");
            if (parts.length === 3) {
                const [year, month, day] = parts.map(Number);
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    const date = new Date(year, month - 1, day);
                    if (!isNaN(date.getTime())) return date;
                }
            }
        }
    } catch (error) {
        console.warn("Error parsing date:", dateString, error);
    }

    return new Date(); // Fallback to current date
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
