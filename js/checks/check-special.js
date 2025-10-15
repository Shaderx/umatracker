/**
 * Special Condition Check Modules
 * Checks for special hidden factors (consecutive runs, never give up, rebellious spirit)
 */

import { state } from '../core/state.js';
import {
    buildPlannerTimeline,
    getMaxConsecutiveRunsFromPlanner,
    getMaxConsecutiveWinsFromPlanner,
    hasLossThenWinFromPlanner
} from '../features/planner-helpers.js';

/**
 * Check consecutive runs (叩き良化型)
 * Requires 2+ consecutive races in planner
 * @returns {Object} Check result with completion status
 */
export function checkConsecutiveRuns() {
    const maxStreak = getMaxConsecutiveRunsFromPlanner();
    const required = 2;
    
    return {
        completed: maxStreak >= required,
        current: Math.min(maxStreak, required),
        required,
        progress: Math.min(100, (maxStreak / required) * 100),
        details: `Max planned consecutive runs: ${maxStreak}`
    };
}

/**
 * Check consecutive wins (連戦連勝)
 * Requires 2+ consecutive wins in planner
 * @returns {Object} Check result with completion status
 */
export function checkConsecutiveWins() {
    const maxWinStreak = getMaxConsecutiveWinsFromPlanner();
    const required = 2;
    
    return {
        completed: maxWinStreak >= required,
        current: Math.min(maxWinStreak, required),
        required,
        progress: Math.min(100, (maxWinStreak / required) * 100),
        details: `Max planned consecutive wins: ${maxWinStreak}`
    };
}

/**
 * Check improves with racing (叩き良化型)
 * Requires 3+ consecutive races in planner (reporter event not modeled)
 * @returns {Object} Check result with completion status
 */
export function checkImprovesWithRacing() {
    const maxStreak = getMaxConsecutiveRunsFromPlanner();
    const required = 3;
    
    return {
        completed: maxStreak >= required,
        current: Math.min(maxStreak, required),
        required,
        progress: Math.min(100, (maxStreak / required) * 100),
        details: `Max planned consecutive runs: ${maxStreak} (reporter event not modeled)`
    };
}

/**
 * Check never give up spirit (諦めない心)
 * Requires a loss followed by a win in planner timeline
 * @returns {Object} Check result with completion status
 */
export function checkNeverGiveUp() {
    const cells = buildPlannerTimeline();
    const anyLoss = cells.some(c => c.lost);
    const anyWin = cells.some(c => c.won);
    const completed = hasLossThenWinFromPlanner();
    
    return {
        completed,
        current: completed ? 2 : (anyLoss || anyWin ? 1 : 0),
        required: 2,
        progress: completed ? 100 : (anyLoss || anyWin ? 50 : 0),
        details: completed 
            ? 'Loss occurs before a later win (planner order)' 
            : 'Need a loss followed by a later win (planner order)'
    };
}

/**
 * Check rebellious spirit (反骨精神)
 * Simplified: any win counts (would require aptitude system)
 * @returns {Object} Check result with completion status
 */
export function checkRebelliousSpirit() {
    const wonAny = state.wonRaces.size > 0;
    
    return {
        completed: wonAny,
        current: wonAny ? 1 : 0,
        required: 1,
        progress: wonAny ? 100 : 0,
        details: `Simplified: Any win counts (requires aptitude system)`
    };
}
