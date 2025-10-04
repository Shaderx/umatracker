/**
 * State Management
 * Manages all application state including races, filters, planner data, and tracking
 */

export class AppState {
    constructor() {
        // Race data
        this.races = [];
        this.hiddenFactors = [];
        
        // Selection state
        this.selectedRaces = new Set();
        this.wonRaces = new Set();
        this.lostRaces = new Set();
        
        // Filter state
        this.currentFilters = new Set();
        
        // Planner state
        this.plannerYear = 'junior'; // 'junior' | 'classics' | 'senior'
        this.monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        this.halfOrder = ['1st', '2nd'];
        this.plannerData = this.createEmptyPlannerData();
        
        // Modal state
        this.closeOnSelection = true;
        
        // Hidden factor tracking state
        this.trackedFactorId = null;
        
        // Mobile/tablet factors expansion state
        this.factorsExpanded = false;
        this.lastKnownCompact = window.innerWidth <= 900;
        
        // Storage system state
        this.currentSaveSlot = null;
        this.currentDeleteSlot = null;
        
        // Body scroll lock state
        this.scrollPosition = 0;
        this.lockCount = 0;
        this.currentLockTarget = null;
    }
    
    /**
     * Create empty planner data structure
     * @returns {Object} Empty planner data with slots for each month/half
     */
    createEmptyPlannerData() {
        const data = {};
        for (const year of ['junior', 'classics', 'senior']) {
            data[year] = {};
            for (const month of this.monthOrder) {
                data[year][month] = { '1st': null, '2nd': null };
            }
        }
        return data;
    }
    
    /**
     * Reset all state to initial values
     */
    reset() {
        this.selectedRaces.clear();
        this.wonRaces.clear();
        this.lostRaces.clear();
        this.currentFilters.clear();
        this.plannerYear = 'junior';
        this.plannerData = this.createEmptyPlannerData();
        this.trackedFactorId = null;
        this.factorsExpanded = false;
    }
}
