// js/features/planner.js
// Planner logic and state management

import { state } from '../core/state.js';
import { cellKey } from '../ui/planner-renderer.js';

/**
 * Set the current planner year and update UI
 * @param {string} yearKey - Year key (junior/classics/senior)
 * @param {Function} renderPlannerGridFn - Callback to render planner grid
 */
export function setPlannerYear(yearKey, renderPlannerGridFn) {
    if (!['junior', 'classics', 'senior'].includes(yearKey)) return;
    state.plannerYear = yearKey;
    
    // Toggle active tab styles if present
    ['tab-junior', 'tab-classics', 'tab-senior'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('active');
    });
    
    const map = { junior: 'tab-junior', classics: 'tab-classics', senior: 'tab-senior' };
    const active = document.getElementById(map[yearKey]);
    if (active) active.classList.add('active');
    
    if (renderPlannerGridFn) renderPlannerGridFn();
}

/**
 * Clear all races from the current planner year
 * @param {Function} renderPlannerGridFn - Callback to render planner grid
 * @param {Function} renderRacesFn - Callback to render races
 * @param {Function} updateProgressFn - Callback to update progress
 */
export function clearPlannerYear(renderPlannerGridFn, renderRacesFn, updateProgressFn) {
    const yearCells = state.plannerData[state.plannerYear];
    Object.keys(yearCells).forEach(k => { yearCells[k] = null; });
    
    syncSelectionsFromPlanner();
    
    if (renderPlannerGridFn) renderPlannerGridFn();
    if (renderRacesFn) renderRacesFn();
    if (updateProgressFn) updateProgressFn();
}

/**
 * Remove a race from a specific planner slot
 * @param {string} month - Month name
 * @param {string} half - Half ('1st' or '2nd')
 * @param {Function} renderPlannerGridFn - Callback to render planner grid
 * @param {Function} renderRacesFn - Callback to render races
 * @param {Function} updateProgressFn - Callback to update progress
 */
export function removeRaceFromPlanner(month, half, renderPlannerGridFn, renderRacesFn, updateProgressFn) {
    const key = cellKey(month, half);
    const prev = state.plannerData[state.plannerYear][key];
    state.plannerData[state.plannerYear][key] = null;
    
    // If previous race no longer exists in any planner cell, remove from global selections
    if (prev && !isPlannedAnywhere(prev)) {
        state.selectedRaces.delete(prev);
        state.wonRaces.delete(prev);
        state.lostRaces.delete(prev);
    }
    
    if (renderPlannerGridFn) renderPlannerGridFn();
    if (renderRacesFn) renderRacesFn();
    if (updateProgressFn) updateProgressFn();
}

/**
 * Toggle win/loss status for a race in the planner
 * @param {string} month - Month name
 * @param {string} half - Half ('1st' or '2nd')
 * @param {Function} toggleWinByIdFn - Callback to toggle win by ID
 * @param {Function} renderPlannerGridFn - Callback to render planner grid
 */
export function toggleWinFromPlanner(month, half, toggleWinByIdFn, renderPlannerGridFn) {
    const key = cellKey(month, half);
    const id = state.plannerData[state.plannerYear][key];
    if (!id) return;
    
    // Cycle Won -> Lost -> Won
    if (toggleWinByIdFn) toggleWinByIdFn(id);
    if (renderPlannerGridFn) renderPlannerGridFn();
}

/**
 * Sync global selections from planner data
 * Removes any selections that are not in the planner
 */
export function syncSelectionsFromPlanner() {
    // Reconstruct global selections from planner (does not include manual grid selections)
    const planned = new Set();
    Object.values(state.plannerData).forEach(yearCells => {
        Object.values(yearCells).forEach(value => { if (value) planned.add(value); });
    });
    
    // Remove any selection not planned
    Array.from(state.selectedRaces).forEach(n => { 
        if (!planned.has(n)) {
            state.selectedRaces.delete(n);
            state.wonRaces.delete(n);
            state.lostRaces.delete(n);
        }
    });
}

/**
 * Check if a race is planned anywhere in the planner
 * @param {string} raceId - Race ID
 * @returns {boolean} True if race is in planner
 */
export function isPlannedAnywhere(raceId) {
    return Object.values(state.plannerData).some(yearCells => {
        return Object.values(yearCells).some(value => value === raceId);
    });
}

/**
 * Plan a race into the planner at its appropriate slot
 * @param {Object} race - Race object
 * @param {string} preferYear - Preferred year (junior/classics/senior)
 */
export function planRaceIntoPlanner(race, preferYear) {
    // Decide target year: prefer the active tab if applicable; otherwise the first truthy flag
    let targetYear = null;
    const flags = ['junior', 'classics', 'senior'];
    if (preferYear && race[preferYear]) targetYear = preferYear;
    if (!targetYear) {
        for (let i = 0; i < flags.length; i++) {
            if (race[flags[i]]) { targetYear = flags[i]; break; }
        }
    }
    if (!targetYear) targetYear = state.plannerYear;
    
    const key = cellKey(race.month, race.half);
    const prevId = state.plannerData[targetYear][key];
    state.plannerData[targetYear][key] = String(race.id);
    
    // If previous race no longer exists in any planner cell, remove from global selections
    if (prevId && !isPlannedAnywhere(prevId)) {
        state.selectedRaces.delete(prevId);
        state.wonRaces.delete(prevId);
        state.lostRaces.delete(prevId);
    }
}

/**
 * Remove a race from all planner slots
 * @param {string} raceId - Race ID
 */
export function removeRaceEverywhereFromPlanner(raceId) {
    Object.keys(state.plannerData).forEach(yearKey => {
        const yearCells = state.plannerData[yearKey];
        Object.keys(yearCells).forEach(cellKey => {
            if (yearCells[cellKey] === raceId) yearCells[cellKey] = null;
        });
    });
}

/**
 * Toggle participation for a race (add/remove from selections and planner)
 * @param {string} raceId - Race ID
 * @param {Function} renderRacesFn - Callback to render races
 * @param {Function} renderPlannerGridFn - Callback to render planner grid
 * @param {Function} updateProgressFn - Callback to update progress
 */
export function toggleParticipationById(raceId, renderRacesFn, renderPlannerGridFn, updateProgressFn) {
    const id = String(raceId);
    // Validate race exists before mutating state to avoid corrupt selections
    const exists = state.raceById && state.raceById.has(id);
    if (!exists) {
        return;
    }
    if (state.selectedRaces.has(id)) {
        // Remove participation and clear all results
        state.selectedRaces.delete(id);
        state.wonRaces.delete(id);
        state.lostRaces.delete(id);
        // Also remove from planner wherever it appears
        removeRaceEverywhereFromPlanner(id);
    } else {
        // Add participation and automatically mark as won
        state.selectedRaces.add(id);
        state.wonRaces.add(id);
        // Also place into planner for the appropriate year/month/half
        const race = state.raceById.get(id);
        if (race) planRaceIntoPlanner(race, state.plannerYear);
    }
    
    if (renderRacesFn) renderRacesFn();
    if (renderPlannerGridFn) renderPlannerGridFn();
    if (updateProgressFn) updateProgressFn();
}

/**
 * Toggle win/loss status for a race by ID
 * @param {string} raceId - Race ID
 */
export function toggleWinById(raceId) {
    const id = String(raceId);
    if (!state.selectedRaces.has(id)) return; // Must be selected first
    
    // Cycle: Won -> Lost -> Won
    if (state.wonRaces.has(id)) {
        // Currently won, mark as lost
        state.wonRaces.delete(id);
        state.lostRaces.add(id);
    } else if (state.lostRaces.has(id)) {
        // Currently lost, mark as won
        state.lostRaces.delete(id);
        state.wonRaces.add(id);
    } else {
        // Neither (shouldn't happen), mark as won
        state.wonRaces.add(id);
    }
}
