/**
 * State Management
 * Manages all application state including races, filters, planner data, and tracking
 */

// Month and half order constants
const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
const halfOrder = ['1st', '2nd'];

/**
 * Create empty planner data structure
 * @returns {Object} Empty planner data with slots for each month/half
 */
export function createEmptyPlannerData() {
    const data = {};
    for (const year of ['junior', 'classics', 'senior']) {
        data[year] = {};
        for (const month of monthOrder) {
            for (const half of halfOrder) {
                const key = `${month}|${half}`;
                data[year][key] = null;
            }
        }
    }
    return data;
}

/**
 * Global state object
 * Shared across all modules
 */
export const state = {
    // Race data
    races: [],
    hiddenFactors: [],
    
    // Selection state
    selectedRaces: new Set(),
    wonRaces: new Set(),
    lostRaces: new Set(),
    
    // Filter state
    currentFilters: new Set(),
    
    // Planner state
    plannerYear: 'junior', // 'junior' | 'classics' | 'senior'
    monthOrder: monthOrder,
    halfOrder: halfOrder,
    plannerData: createEmptyPlannerData(),
    
    // Modal state
    closeOnSelection: true,
    
    // Hidden factor tracking state
    trackedFactorId: null,
    
    // Mobile/tablet factors expansion state
    factorsExpanded: false,
    lastKnownCompact: typeof window !== 'undefined' ? window.innerWidth <= 900 : false,
    
    // Storage system state
    currentSaveSlot: null,
    currentDeleteSlot: null,
    
    // Body scroll lock state
    scrollPosition: 0,
    lockCount: 0,
    currentLockTarget: null,
    
    // Race lookup maps (initialized by race-data.js)
    raceById: new Map(),
    raceIdsByName: new Map(),
    
    // Distance categories (initialized by race-data.js)
    distanceCategories: {},
    
    // Track lists (initialized by race-data.js)
    easternTracks: [],
    westernTracks: [],
    
    // Summer series (initialized by race-data.js)
    summerSeries: {},
    
    // Translations (initialized by race-data.js)
    translations: {}
};

/**
 * Reset all state to initial values
 */
export function resetState() {
    state.selectedRaces.clear();
    state.wonRaces.clear();
    state.lostRaces.clear();
    state.currentFilters.clear();
    state.plannerYear = 'junior';
    state.plannerData = createEmptyPlannerData();
    state.trackedFactorId = null;
    state.factorsExpanded = false;
}
