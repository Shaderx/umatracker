/**
 * Hidden Factor Tracking
 * Manages tracking of specific hidden factors and their associated races
 */

import { state as globalState } from '../core/state.js';
import { loadHiddenFactors } from '../data/hidden-factors.js';

/**
 * Set the currently tracked hidden factor
 * @param {string|null} factorId - The ID of the factor to track, or null to clear
 * @param {Object} state - Application state object
 * @param {Function} updateProgress - Function to update progress display
 * @param {Function} renderRaces - Function to re-render race grid
 * @param {Function} renderPlannerGrid - Function to re-render planner grid
 */
export function setTrackedFactor(factorId, state, updateProgress, renderRaces, renderPlannerGrid) {
    // If clicking the same factor, toggle it off
    if (state.trackedFactorId === factorId) {
        state.trackedFactorId = null;
    } else {
        state.trackedFactorId = factorId;
    }
    updateProgress();
    renderRaces();
    renderPlannerGrid();
}

/**
 * Clear the currently tracked factor
 * @param {Object} state - Application state object
 * @param {Function} updateProgress - Function to update progress display
 * @param {Function} renderRaces - Function to re-render race grid
 * @param {Function} renderPlannerGrid - Function to re-render planner grid
 */
export function clearTrackedFactor(state, updateProgress, renderRaces, renderPlannerGrid) {
    state.trackedFactorId = null;
    updateProgress();
    renderRaces();
    renderPlannerGrid();
}

/**
 * Get the set of race IDs that satisfy the currently tracked factor
 * @param {Object} state - Application state object
 * @param {Array} hiddenFactors - Array of hidden factor objects
 * @returns {Set<string>} Set of race IDs, or empty Set if no factor tracked
 */
export function getTrackedFactorRaceIds(state, hiddenFactors) {
    if (!state.trackedFactorId) return new Set();
    const factors = hiddenFactors || loadHiddenFactors();
    const factor = factors.find(f => f.id === state.trackedFactorId);
    if (!factor || !factor.getRaces) return new Set();
    return factor.getRaces();
}

/**
 * Check if a race satisfies the currently tracked factor
 * @param {string} raceId - The race ID to check
 * @param {Object} state - Application state object
 * @param {Array} hiddenFactors - Array of hidden factor objects
 * @returns {boolean}
 */
export function isRaceTracked(raceId, state, hiddenFactors) {
    const trackedIds = getTrackedFactorRaceIds(state, hiddenFactors);
    return trackedIds.has(String(raceId));
}

/**
 * Check if a planner slot (month/half) has any races that satisfy the tracked factor
 * @param {string} month - Month name
 * @param {string} half - Half ('1st' or '2nd')
 * @param {string} yearKey - 'junior', 'classics', or 'senior'
 * @param {Object} stateParam - Optional application state object (uses global state if not provided)
 * @param {Array} hiddenFactorsParam - Optional array of hidden factor objects
 * @param {Map} raceByIdParam - Optional map of race ID to race object
 * @returns {boolean}
 */
export function isSlotTracked(month, half, yearKey, stateParam = null, hiddenFactorsParam = null, raceByIdParam = null) {
    // Use provided parameters or fall back to global state
    const stateToUse = stateParam || globalState;
    const raceByIdToUse = raceByIdParam || globalState.raceById;
    
    if (!stateToUse.trackedFactorId) return false;
    const trackedIds = getTrackedFactorRaceIds(stateToUse, hiddenFactorsParam || loadHiddenFactors());
    if (trackedIds.size === 0) return false;

    // Check if any tracked race matches this slot
    for (const id of trackedIds) {
        const race = raceByIdToUse.get(String(id));
        if (race && race.month === month && race.half === half && race[yearKey]) {
            return true;
        }
    }
    return false;
}
