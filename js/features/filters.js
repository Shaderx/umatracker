/**
 * Filter System
 * Manages race filtering logic and UI interactions
 */

import { state } from '../core/state.js';
import { getTrackedFactorRaceIds } from './tracking.js';
import { loadHiddenFactors } from '../data/hidden-factors.js';

/**
 * Filter configuration - defines which filters belong to which groups
 */
export const filterGroups = {
    grade: ['GI', 'GII', 'GIII', 'Open', 'Pre-OP'], // OR logic
    surface: ['turf', 'dirt'], // Exclusive
    distance: ['short', 'mile', 'medium', 'long'], // Exclusive
    year: ['junior', 'classic', 'senior'], // Exclusive
    summer: ['SSS', 'SMS', 'S2000'], // Exclusive, clears all others
    other: ['selected', 'tracked']
};

/**
 * Handle filter button click
 * @param {Event} e - Click event
 * @param {Set} currentFilters - Current active filters
 * @param {Function} renderRaces - Function to re-render race grid
 * @param {Function} renderPlannerGrid - Function to re-render planner grid
 */
export function handleFilterClick(e, currentFilters, renderRaces, renderPlannerGrid) {
    const target = e.currentTarget || e.target;
    const filter = target?.dataset?.value;

    // Special handling for 'all' - clear all filters
    if (filter === 'all') {
        currentFilters.clear();
        document.querySelectorAll('#calendar-section .filter-btn[data-filter]').forEach(b => {
            b.classList.remove('active');
            b.classList.remove('summer-active');
        });
        target.classList.add('active');
        // Change text back to "All Races" when clicked
        target.innerHTML = 'All Races<br><span style="font-size: 0.7em;">全レース</span>';
        renderRaces();
        renderPlannerGrid();
        return;
    }

    // Remove 'all' button active state when selecting specific filters
    const allBtn = document.querySelector('#calendar-section .filter-btn[data-value="all"]');
    if (allBtn) {
        allBtn.classList.remove('active');
        // Change text to "Clear Filters" when other filters are active
        allBtn.innerHTML = 'Clear Filters<br><span style="font-size: 0.7em;">フィルター解除</span>';
    }

    // Find which group this filter belongs to
    let filterGroup = null;
    for (const [groupName, filters] of Object.entries(filterGroups)) {
        if (filters.includes(filter)) {
            filterGroup = groupName;
            break;
        }
    }

    // Handle summer series filters - they clear everything else
    if (filterGroup === 'summer') {
        handleSummerFilter(filter, currentFilters, filterGroups);
    }
    // Handle exclusive groups (surface, distance, year)
    else if (filterGroup === 'surface' || filterGroup === 'distance' || filterGroup === 'year') {
        handleExclusiveFilter(filter, currentFilters, filterGroup, filterGroups);
    }
    // Handle grade filters (OR logic - can have multiple)
    else if (filterGroup === 'grade') {
        handleGradeFilter(filter, currentFilters);
    }
    // Handle other filters (selected, tracked)
    else {
        handleOtherFilter(filter, currentFilters);
    }

    // If no filters are active, activate 'all'
    if (currentFilters.size === 0) {
        const allBtn = document.querySelector('#calendar-section .filter-btn[data-value="all"]');
        if (allBtn) {
            allBtn.classList.add('active');
            // Ensure text shows "All Races" when no filters are active
            allBtn.innerHTML = 'All Races<br><span style="font-size: 0.7em;">全レース</span>';
        }
    }

    renderRaces();
    renderPlannerGrid(); // Update planner to show filter highlights
}

/**
 * Handle summer series filter clicks (exclusive within summer group)
 * @param {string} filter - Filter name
 * @param {Set} currentFilters - Current active filters
 * @param {Object} filterGroups - Filter group configuration
 */
function handleSummerFilter(filter, currentFilters, filterGroups) {
    // Clear all filters except summer ones
    currentFilters.clear();
    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => {
        if (!filterGroups.summer.includes(b.dataset.filter) && b.dataset.filter !== 'all') {
            b.classList.remove('active');
        }
        b.classList.remove('summer-active');
    });

    // Toggle this summer filter
    if (currentFilters.has(filter)) {
        currentFilters.delete(filter);
        document.querySelector(`.filter-btn[data-value="${filter}"]`).classList.remove('active', 'summer-active');
    } else {
        // Clear other summer filters (exclusive within summer group)
        filterGroups.summer.forEach(f => {
            currentFilters.delete(f);
            const btn = document.querySelector(`.filter-btn[data-value="${f}"]`);
            if (btn) {
                btn.classList.remove('active');
                btn.classList.remove('summer-active');
            }
        });
        currentFilters.add(filter);
        document.querySelector(`.filter-btn[data-value="${filter}"]`).classList.add('active', 'summer-active');
    }
}

/**
 * Handle exclusive filter groups (surface, distance, year)
 * @param {string} filter - Filter name
 * @param {Set} currentFilters - Current active filters
 * @param {string} filterGroup - Group name
 * @param {Object} filterGroups - Filter group configuration
 */
function handleExclusiveFilter(filter, currentFilters, filterGroup, filterGroups) {
    const groupFilters = filterGroups[filterGroup];

    // If clicking the same filter, toggle it off
    if (currentFilters.has(filter)) {
        currentFilters.delete(filter);
        document.querySelector(`.filter-btn[data-value="${filter}"]`).classList.remove('active');
    } else {
        // Remove all filters from this group and add the new one
        groupFilters.forEach(f => {
            currentFilters.delete(f);
            const btn = document.querySelector(`.filter-btn[data-value="${f}"]`);
            if (btn) btn.classList.remove('active');
        });
        currentFilters.add(filter);
        document.querySelector(`.filter-btn[data-value="${filter}"]`).classList.add('active');
    }
}

/**
 * Handle grade filters (OR logic - can have multiple)
 * @param {string} filter - Filter name
 * @param {Set} currentFilters - Current active filters
 */
function handleGradeFilter(filter, currentFilters) {
    if (currentFilters.has(filter)) {
        currentFilters.delete(filter);
        document.querySelector(`.filter-btn[data-value="${filter}"]`).classList.remove('active');
    } else {
        currentFilters.add(filter);
        document.querySelector(`.filter-btn[data-value="${filter}"]`).classList.add('active');
    }
}

/**
 * Handle other filters (selected, tracked)
 * @param {string} filter - Filter name
 * @param {Set} currentFilters - Current active filters
 */
function handleOtherFilter(filter, currentFilters) {
    if (currentFilters.has(filter)) {
        currentFilters.delete(filter);
        document.querySelector(`.filter-btn[data-value="${filter}"]`).classList.remove('active');
    } else {
        currentFilters.add(filter);
        document.querySelector(`.filter-btn[data-value="${filter}"]`).classList.add('active');
    }
}

/**
 * Clear all races and planner data
 * @param {Object} state - Application state object
 * @param {Function} renderPlannerGrid - Function to re-render planner grid
 * @param {Function} renderRaces - Function to re-render race grid
 * @param {Function} updateProgress - Function to update progress display
 * @returns {boolean} True if confirmed and cleared
 */
export function clearAll(state, renderPlannerGrid, renderRaces, updateProgress) {
    const confirmed = confirm('This will clear all races in planner and database.\n\nこれにより、プランナーとデータベースのすべてのレースがクリアされます。\n\nAre you sure you want to continue?');
    if (!confirmed) return false;

    state.selectedRaces.clear();
    state.wonRaces.clear();
    state.lostRaces.clear();
    // Also clear planner across all years
    Object.keys(state.plannerData).forEach(yearKey => {
        const cells = state.plannerData[yearKey];
        Object.keys(cells).forEach(k => { cells[k] = null; });
    });
    renderPlannerGrid();
    renderRaces();
    updateProgress();
    return true;
}

/**
 * Check if a race matches the current filters
 * @param {Object} race - Race object to check
 * @param {Set} currentFilters - Set of active filter strings
 * @returns {boolean} True if race matches filters
 */
export function raceMatchesFilters(race, currentFilters) {
    if (currentFilters.size === 0) return true;

    const gradeKeys = ['GI', 'GII', 'GIII', 'Open', 'Pre-OP'];
    const activeGrades = [...currentFilters].filter(f => gradeKeys.includes(f));
    const otherFilters = [...currentFilters].filter(f => !gradeKeys.includes(f));

    if (activeGrades.length > 0) {
        const gradeMatch = activeGrades.some(g => {
            switch (g) {
                case 'GI': return race.type === 'GI';
                case 'GII': return race.type === 'GII';
                case 'GIII': return race.type === 'GIII';
                case 'Open': return race.type === 'Open';
                case 'Pre-OP': return race.type === 'Pre-OP';
                default: return false;
            }
        });
        if (!gradeMatch) return false;
    }

    for (const filter of otherFilters) {
        switch (filter) {
            case 'short': if (!state.distanceCategories.short(race)) return false; break;
            case 'mile': if (!state.distanceCategories.mile(race)) return false; break;
            case 'medium': if (!state.distanceCategories.medium(race)) return false; break;
            case 'long': if (!state.distanceCategories.long(race)) return false; break;
            case 'turf': if (race.surface !== 'turf') return false; break;
            case 'dirt': if (race.surface !== 'dirt') return false; break;
            case 'junior': if (!race.junior) return false; break;
            case 'classic': if (!race.classics) return false; break;
            case 'senior': if (!race.senior) return false; break;
            case 'selected': if (!state.selectedRaces.has(String(race.id))) return false; break;
            case 'tracked': {
                const trackedIds = getTrackedFactorRaceIds(state, loadHiddenFactors());
                if (!trackedIds.has(String(race.id))) return false;
                break;
            }
            default: break;
        }
    }
    return true;
}

