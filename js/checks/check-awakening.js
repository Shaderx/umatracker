/**
 * Awakening Check Modules
 * Checks for directional and seasonal awakening hidden factors
 */

import { state } from '../core/state.js';

/**
 * Check directional awakening (right or left)
 * Requires 6+ wins on tracks with specified direction
 * @param {string} direction - 'right' or 'left'
 * @returns {Object} Check result with completion status
 */
export function checkDirectionalAwakening(direction) {
    const names = Array.from(state.wonRaces)
        .map(id => state.raceById.get(String(id)))
        .filter(r => r && r.direction === direction)
        .map(r => r.name);
    
    return {
        completed: names.length >= 6,
        current: names.length,
        required: 6,
        progress: (names.length / 6) * 100,
        details: `${direction}-handed wins: ${names.join(', ')}`
    };
}

/**
 * Check seasonal awakening (spring, summer, autumn, winter)
 * Requires 6+ wins in races during specified season
 * @param {string} season - 'spring', 'summer', 'autumn', or 'winter'
 * @returns {Object} Check result with completion status
 */
export function checkSeasonalAwakening(season) {
    const names = Array.from(state.wonRaces)
        .map(id => state.raceById.get(String(id)))
        .filter(r => r && r.season === season)
        .map(r => r.name);
    
    return {
        completed: names.length >= 6,
        current: names.length,
        required: 6,
        progress: (names.length / 6) * 100,
        details: `${season} wins: ${names.join(', ')}`
    };
}
