/**
 * Planner Helper Functions
 * Utility functions for analyzing planner timeline data
 */

import { state } from '../core/state.js';

/**
 * Build a flat timeline of all planner cells in chronological order
 * @returns {Array} Array of cell objects with year, month, half, id, won, lost, filled
 */
export function buildPlannerTimeline() {
    const cells = [];
    const yearOrder = ['junior', 'classics', 'senior'];
    
    try {
        yearOrder.forEach(year => {
            const yearCells = state.plannerData[year] || {};
            state.monthOrder.forEach(month => {
                state.halfOrder.forEach(half => {
                    const key = `${month}|${half}`;
                    const raw = yearCells[key];
                    const id = raw ? String(raw) : null;
                    const won = id ? state.wonRaces.has(id) : false;
                    const lost = id ? state.lostRaces.has(id) : false;
                    cells.push({ year, month, half, id, won, lost, filled: !!id });
                });
            });
        });
    } catch (e) {
        // Fallback to empty timeline
        console.error('Error building planner timeline:', e);
    }
    
    return cells;
}

/**
 * Get maximum consecutive runs (filled slots) in planner
 * @returns {number} Maximum consecutive run count
 */
export function getMaxConsecutiveRunsFromPlanner() {
    const cells = buildPlannerTimeline();
    let max = 0, cur = 0;
    
    for (const c of cells) {
        if (c.filled) {
            cur += 1;
        } else {
            cur = 0;
        }
        if (cur > max) max = cur;
    }
    
    return max;
}

/**
 * Get maximum consecutive wins in planner
 * @returns {number} Maximum consecutive win count
 */
export function getMaxConsecutiveWinsFromPlanner() {
    const cells = buildPlannerTimeline();
    let max = 0, cur = 0;
    
    for (const c of cells) {
        if (c.won) {
            cur += 1;
        } else {
            cur = 0;
        }
        if (cur > max) max = cur;
    }
    
    return max;
}

/**
 * Check if there's a loss followed by a win in planner timeline
 * @returns {boolean} True if loss then win pattern exists
 */
export function hasLossThenWinFromPlanner() {
    const cells = buildPlannerTimeline();
    let seenLoss = false;
    
    for (const c of cells) {
        if (!c.filled) continue;
        if (c.lost) seenLoss = true;
        if (c.won && seenLoss) return true;
    }
    
    return false;
}
