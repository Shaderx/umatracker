// js/ui/race-renderer.js
// Renders the race grid/cards with filtering and sorting

import { state } from '../core/state.js';
import { getTrackedFactorRaceIds } from '../features/tracking.js';
import { loadHiddenFactors } from '../data/hidden-factors.js';
import { syncProgressHeightToPlanner } from './progress-renderer.js';

/**
 * Renders the races grid
 * @param {Set} selectedRaces - Set of selected race IDs
 * @param {Set} wonRaces - Set of won race IDs
 * @param {Set} lostRaces - Set of lost race IDs
 * @param {Function} isRaceTrackedFn - Function to check if race is tracked
 * @param {Function} isPlannedAnywhereFn - Function to check if race is in planner
 * @param {Function} toggleParticipationFn - Callback for participation toggle
 * @param {Function} toggleWinFn - Callback for win/loss toggle
 */
export function renderRaces(selectedRaces, wonRaces, lostRaces, isRaceTrackedFn, isPlannedAnywhereFn, toggleParticipationFn, toggleWinFn) {
    const grid = document.getElementById('races-grid');
    if (!grid) return;
    
    const filteredRaces = getFilteredRaces();
    
    grid.innerHTML = filteredRaces.map(race => {
        const isTracked = isRaceTrackedFn ? isRaceTrackedFn(race.id) : false;
        const isInPlanner = isPlannedAnywhereFn ? isPlannedAnywhereFn(String(race.id)) : false;
        const isSelected = selectedRaces.has(String(race.id));
        const isWon = wonRaces.has(String(race.id));
        const isLost = lostRaces.has(String(race.id));
        
        return `
        <div class="race-card ${isSelected ? 'selected' : ''} ${isWon ? 'won' : ''} ${isTracked ? 'race-tracked' : ''} ${isInPlanner ? 'race-in-planner' : ''}" 
             data-race-id="${race.id}" data-race="${race.name}" onclick="window.toggleParticipationFromRenderer('${race.id}')">
            ${race.image ? `<div class="race-thumb"><img class="race-thumb-img" src="${race.image}" alt="${(race.name || '').replace(/"/g, '&quot;')}" loading="lazy"></div>` : ''}
            <div class="race-name">
                <div class="race-name-en">${race.name}</div>
                <div class="race-name-jp">${race.nameJP}</div>
            </div>
            <div class="race-details">
                <span class="race-grade grade-${race.type}">${race.type}</span>
                ${race.length} • ${race.surface}/${state.translations.surfaces[race.surface] || race.surface}
            </div>
            <div class="race-details">
                ${race.racetrack}/${state.translations.tracks[race.racetrack] || race.racetrack}
                • ${state.translations.months[race.month] || race.month} ${state.translations.halves[race.half] || race.half} / ${race.month} ${race.half}
                ${race.direction ? `• ${state.translations.directions[race.direction]} / ${race.direction}` : ''}
                ${(() => {
                    const years = [];
                    if (race.junior) years.push('Junior');
                    if (race.classics) years.push('Classic');
                    if (race.senior) years.push('Senior');
                    return years.length > 0 ? `• ${years.join('/')}` : '';
                })()}
            </div>
            ${isSelected ? `
            <div class="win-button-container">
                <button class="loss-toggle-btn ${isLost ? 'lost' : 'won'}" 
                        onclick="event.stopPropagation(); window.toggleWinFromRenderer('${race.id}')">
                    ${isLost ? '👎' : '🏆'}
                </button>
            </div>
            ` : ''}
        </div>
        `;
    }).join('');
    
    syncProgressHeightToPlanner();
}

/**
 * Gets filtered races based on current filters
 * @returns {Array} Filtered and sorted race list
 */
export function getFilteredRaces() {
    // If no filters are active, show all races
    if (state.currentFilters.size === 0) {
        return sortRacesList([...state.races]);
    }
    
    // Separate filters by type
    const gradeFilters = ['GI', 'GII', 'GIII', 'Open', 'Pre-OP'];
    const activeGrades = [...state.currentFilters].filter(f => gradeFilters.includes(f));
    const otherFilters = [...state.currentFilters].filter(f => !gradeFilters.includes(f));
    
    let list = [...state.races];
    
    // Apply grade filters with OR logic
    if (activeGrades.length > 0) {
        list = list.filter(race => {
            return activeGrades.some(filter => {
                switch(filter) {
                    case 'GI': return race.type === 'GI';
                    case 'GII': return race.type === 'GII';
                    case 'GIII': return race.type === 'GIII';
                    case 'Open': return race.type === 'Open';
                    case 'Pre-OP': return race.type === 'Pre-OP';
                    default: return false;
                }
            });
        });
    }
    
    // Apply other filters with AND logic
    for (const filter of otherFilters) {
        list = list.filter(race => {
            switch(filter) {
                case 'junior': return race.junior;
                case 'classic': return race.classics;
                case 'senior': return race.senior;
                case 'SSS': {
                    const set = new Set(state.summerSeries?.sprint || []);
                    return set.has(race.name);
                }
                case 'SMS': {
                    const set = new Set(state.summerSeries?.mile || []);
                    return set.has(race.name);
                }
                case 'S2000': {
                    const set = new Set(state.summerSeries?.s2000 || []);
                    return set.has(race.name);
                }
                case 'selected': return state.selectedRaces.has(String(race.id));
                case 'tracked': {
                    const trackedIds = getTrackedFactorRaceIds(state, loadHiddenFactors());
                    return trackedIds.has(String(race.id));
                }
                case 'turf': return race.surface === 'turf';
                case 'dirt': return race.surface === 'dirt';
                case 'short': return state.distanceCategories.short(race);
                case 'mile': return state.distanceCategories.mile(race);
                case 'medium': return state.distanceCategories.medium(race);
                case 'long': return state.distanceCategories.long(race);
                default: return true;
            }
        });
    }
    
    return sortRacesList(list);
}

/**
 * Sorts races by type, month, half, and name
 * @param {Array} list - List of races to sort
 * @returns {Array} Sorted race list
 */
export function sortRacesList(list) {
    const typeOrder = { 'GI': 0, 'GII': 1, 'GIII': 2, 'Open': 3, 'Pre-OP': 4 };
    return list.sort((a, b) => {
        const ao = typeOrder[a.type] ?? 99;
        const bo = typeOrder[b.type] ?? 99;
        if (ao !== bo) return ao - bo;
        const am = state.monthOrder.indexOf(a.month);
        const bm = state.monthOrder.indexOf(b.month);
        if (am !== bm) return am - bm;
        const halfOrder = { '1st': 0, '2nd': 1 };
        const ah = halfOrder[a.half] ?? 0;
        const bh = halfOrder[b.half] ?? 0;
        if (ah !== bh) return ah - bh;
        return (a.name || '').localeCompare(b.name || '');
    });
}

/**
 * Setup window callbacks for race renderer
 * This allows onclick handlers in HTML to call back to the tracker
 */
export function setupRaceRendererCallbacks(toggleParticipationFn, toggleWinFn) {
    window.toggleParticipationFromRenderer = toggleParticipationFn;
    window.toggleWinFromRenderer = toggleWinFn;
}
