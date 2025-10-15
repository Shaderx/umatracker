/**
 * Utility Functions
 * Provides general utility functions used throughout the application
 */

/**
 * Check if device is mobile or tablet
 * @returns {boolean} True if viewport width is 900px or less
 */
export function isMobileOrTablet() {
    return window.innerWidth <= 900;
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast ('success' or 'error')
 */
export function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Discord contact function - opens Discord invite link
 */
export function contactOnDiscord() {
    window.open('https://discord.gg/d83pCZTwvB', '_blank');
}

/**
 * Get the names/IDs from a list
 * @param {Array} races - Array of race objects
 * @param {Array} nameList - List of race names or IDs
 * @returns {Set} Set of race IDs
 */
export function getIdsForNames(races, nameList) {
    const result = new Set();
    nameList.forEach(n => {
        const r = races.find(race => race.name === n || race.id === n);
        if (r) {
            result.add(String(r.id));
        }
    });
    return result;
}
