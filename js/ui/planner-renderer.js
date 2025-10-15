// js/ui/planner-renderer.js
// Renders the race planner calendar grid

import { state } from '../core/state.js';
import { isSlotTracked, getTrackedFactorRaceIds } from '../features/tracking.js';
import { loadHiddenFactors } from '../data/hidden-factors.js';
import { syncProgressHeightToPlanner } from './progress-renderer.js';

/**
 * Renders the planner grid for the current year
 * @param {string} plannerYear - Current planner year (junior/classics/senior)
 * @param {Function} raceMatchesFiltersFn - Function to check if race matches filters
 * @param {Function} openPickerFn - Callback to open picker modal
 * @param {Function} removeRaceFromPlannerFn - Callback to remove race
 * @param {Function} toggleWinFromPlannerFn - Callback to toggle win/loss
 */
export function renderPlannerGrid(plannerYear, raceMatchesFiltersFn, openPickerFn, removeRaceFromPlannerFn, toggleWinFromPlannerFn) {
    const container = document.getElementById('planner-grid');
    if (!container) return; // older HTML may not have planner UI
    
    const yearCells = state.plannerData[plannerYear];
    const t = state.translations;
    const monthLabel = (m) => `${t.months[m] || m}`; // JP
    const halfLabel = (h) => `${t.halves[h] || h}`;   // JP
    const enShort = { January:'Jan', February:'Feb', March:'Mar', April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug', September:'Sep', October:'Oct', November:'Nov', December:'Dec' };

    const slots = [];
    state.monthOrder.forEach(month => {
        state.halfOrder.forEach(half => {
            const key = cellKey(month, half);
            const rawValue = yearCells[key];
            const hasAnyForSlot = state.races.some(r => r.month === month && r.half === half && !!r[plannerYear]);
            const selectedId = (typeof rawValue === 'string' && rawValue) ? String(rawValue) : null;
            const isSlotTrackedValue = isSlotTracked(month, half, plannerYear, state, loadHiddenFactors(), state.raceById);
            let slotBody = '';
            
            // Check if ANY available races in this slot match the current filters
            const hasMatchingRaces = state.currentFilters.size > 0 && state.races.some(r => {
                return r.month === month && r.half === half && !!r[plannerYear] && raceMatchesFiltersFn(r);
            });
            
            if (selectedId) {
                let r = state.raceById ? state.raceById.get(selectedId) : null;
                if (!r) {
                    // Backward compatibility: previously stored race name
                    r = state.races.find(rr => rr.name === selectedId) || null;
                }
                const hasImage = r && r.image;
                const bgStyle = hasImage ? `background-image: url('${r.image}')` : '';
                const badgeClass = state.lostRaces.has(selectedId) ? 'badge-lost' : (state.wonRaces.has(selectedId) ? 'badge-won' : '');
                slotBody = `
                    <div class=\"slot-wrapper\">
                        <button class=\"slot-button ${badgeClass}\" data-race-id=\"${selectedId}\" style=\"${bgStyle}\" onclick=\"window.openPickerFromPlanner('${month}','${half}')\">
                            <div class=\"slot-gradient\"></div>
                            <div class=\"slot-title year-${plannerYear}\">
                                <div class=\"en\">${r ? r.name : ''}</div>
                                <div class=\"jp\">${r && r.nameJP ? r.nameJP : ''}</div>
                            </div>
                        </button>
                        <button class=\"slot-remove\" title=\"Remove / 削除\" onclick=\"window.removeRaceFromPlannerFromRenderer('${month}','${half}')\">×</button>
                        <button class=\"loss-toggle-btn ${state.lostRaces.has(selectedId) ? 'lost' : 'won'}\" title=\"Toggle Win/Loss / 勝敗切替\" style=\"position:absolute; top:6px; left:6px;\" onclick=\"window.toggleWinFromPlannerFromRenderer('${month}','${half}')\">${state.lostRaces.has(selectedId) ? '👎' : '🏆'}</button>
                    </div>
                `;
            } else {
                slotBody = `<button class=\"planner-plus ${hasAnyForSlot ? '' : 'disabled'}\" ${hasAnyForSlot ? `onclick=\"window.openPickerFromPlanner('${month}','${half}')\"` : ''}>＋ Add / 追加</button>`;
            }
            const isSummer = (month === 'July' || month === 'August');
            const isEmptySlot = !selectedId && !hasAnyForSlot;
            slots.push(`
                <div class=\"planner-slot ${isEmptySlot ? 'disabled' : ''} ${isSummer ? 'summer' : ''} ${isSlotTrackedValue ? 'slot-tracked' : ''} ${hasMatchingRaces ? 'filter-match' : ''} year-${plannerYear}\">
                    <div class=\"planner-slot-head\"><span>${enShort[month] || month} ${half} / ${monthLabel(month)} ${halfLabel(half)}</span></div>
                    <div class=\"planner-slot-body\">${slotBody || `<button class=\\"planner-plus ${hasAnyForSlot ? '' : 'disabled'}\\" ${hasAnyForSlot ? `onclick=\\"window.openPickerFromPlanner('${month}','${half}')\\"` : ''}>＋ Add / 追加</button>`}</div>
                </div>
            `);
        });
    });
    container.innerHTML = slots.join('');
    syncProgressHeightToPlanner();
}

/**
 * Helper to create cell key from month and half
 * @param {string} month - Month name
 * @param {string} half - Half ('1st' or '2nd')
 * @returns {string} Cell key
 */
export function cellKey(month, half) {
    return `${month}|${half}`;
}

/**
 * Check if a race matches the current filters
 * @param {Object} race - Race object
 * @returns {boolean} True if race matches filters
 */
export function raceMatchesFilters(race) {
    // If no filters are active, don't highlight anything
    if (state.currentFilters.size === 0) {
        return false;
    }
    
    // Separate filters by type
    const gradeFilters = ['GI', 'GII', 'GIII', 'Open', 'Pre-OP'];
    const activeGrades = [...state.currentFilters].filter(f => gradeFilters.includes(f));
    const otherFilters = [...state.currentFilters].filter(f => !gradeFilters.includes(f));
    
    // Check grade filters with OR logic
    if (activeGrades.length > 0) {
        const gradeMatches = activeGrades.some(filter => {
            switch(filter) {
                case 'GI': return race.type === 'GI';
                case 'GII': return race.type === 'GII';
                case 'GIII': return race.type === 'GIII';
                case 'Open': return race.type === 'Open';
                case 'Pre-OP': return race.type === 'Pre-OP';
                default: return false;
            }
        });
        if (!gradeMatches) return false;
    }
    
    // Check other filters with AND logic
    for (const filter of otherFilters) {
        let matches = false;
        switch(filter) {
            case 'junior': matches = race.junior; break;
            case 'classic': matches = race.classics; break;
            case 'senior': matches = race.senior; break;
            case 'SSS': {
                const set = new Set(state.summerSeries?.sprint || []);
                matches = set.has(race.name);
                break;
            }
            case 'SMS': {
                const set = new Set(state.summerSeries?.mile || []);
                matches = set.has(race.name);
                break;
            }
            case 'S2000': {
                const set = new Set(state.summerSeries?.s2000 || []);
                matches = set.has(race.name);
                break;
            }
            case 'selected': matches = state.selectedRaces.has(String(race.id)); break;
            case 'tracked': {
                const trackedIds = getTrackedFactorRaceIds();
                matches = trackedIds.has(String(race.id));
                break;
            }
            case 'turf': matches = race.surface === 'turf'; break;
            case 'dirt': matches = race.surface === 'dirt'; break;
            case 'short': matches = state.distanceCategories.short(race); break;
            case 'mile': matches = state.distanceCategories.mile(race); break;
            case 'medium': matches = state.distanceCategories.medium(race); break;
            case 'long': matches = state.distanceCategories.long(race); break;
            default: matches = true;
        }
        // If any filter doesn't match, return false
        if (!matches) return false;
    }
    // All filters matched
    return true;
}

/**
 * Setup window callbacks for planner renderer
 * This allows onclick handlers in HTML to call back to the tracker
 */
export function setupPlannerRendererCallbacks(openPickerFn, removeRaceFromPlannerFn, toggleWinFromPlannerFn) {
    window.openPickerFromPlanner = openPickerFn;
    window.removeRaceFromPlannerFromRenderer = removeRaceFromPlannerFn;
    window.toggleWinFromPlannerFromRenderer = toggleWinFromPlannerFn;
}
