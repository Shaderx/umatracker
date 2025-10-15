// ============================================================================
// Uma Musume Hidden Factors Tracker - Modular Entry Point
// ============================================================================
// This file wires together all the extracted ES6 modules into a working app.
// Original monolithic app.js (2,965 lines) has been refactored into 16 modules.
// ============================================================================

// Import Core Modules
import { state, createEmptyPlannerData, resetState } from './js/core/state.js';
import { isMobileOrTablet, showToast } from './js/core/utils.js';

// Import Data Modules
import { 
    distanceCategories, 
    easternTracks, 
    westernTracks, 
    summerSeries, 
    translations,
    initializeRaceData 
} from './js/data/race-data.js';
import { loadHiddenFactors } from './js/data/hidden-factors.js';

// Import Feature Modules
import {
    setTrackedFactor,
    getTrackedFactorRaceIds,
    isRaceTracked,
    isSlotTracked
} from './js/features/tracking.js';
import { 
    filterGroups,
    handleFilterClick,
    clearAll as filterClearAll,
    raceMatchesFilters
} from './js/features/filters.js';
import { lockBodyScroll, unlockBodyScroll } from './js/features/scroll-lock.js';
import { 
    buildPlannerTimeline,
    getMaxConsecutiveRunsFromPlanner,
    getMaxConsecutiveWinsFromPlanner,
    hasLossThenWinFromPlanner
} from './js/features/planner-helpers.js';
import { 
    setPlannerYear,
    clearPlannerYear,
    removeRaceFromPlanner,
    toggleWinFromPlanner,
    syncSelectionsFromPlanner,
    isPlannedAnywhere,
    planRaceIntoPlanner,
    removeRaceEverywhereFromPlanner,
    toggleParticipationById,
    toggleWinById
} from './js/features/planner.js';
import { pickerOpen, pickerClose, pickerNavigate, pickerNavigateAnim, pickerToggleClose } from './js/features/picker-modal.js';
import { 
    openSaveDialog,
    closeSaveDialog,
    openLoadDialog,
    closeLoadDialog,
    openShareDialog,
    closeShareDialog,
    copyShareURL,
    openNameDialog,
    closeNameDialog,
    confirmSaveName
} from './js/features/modal-manager.js';
import { buildShareURL, tryImportFromURL, serializeState, deserializeState } from './js/storage/url-sharing.js';
import { renderSaveSlotsUI, renderLoadSlotsUI } from './js/storage/storage-manager.js';

// Import UI Modules
import { updateAndRenderProgress, setupProgressRendererCallbacks } from './js/ui/progress-renderer.js';
import { renderRaces, setupRaceRendererCallbacks } from './js/ui/race-renderer.js';
import { renderPlannerGrid, cellKey, setupPlannerRendererCallbacks } from './js/ui/planner-renderer.js';

// ============================================================================
// Discord Contact Function (preserved from original)
// ============================================================================
function contactOnDiscord() {
    window.open('https://discord.gg/d83pCZTwvB', '_blank');
}

// Make it globally accessible for HTML onclick
window.contactOnDiscord = contactOnDiscord;

// ============================================================================
// Main Tracker Class
// ============================================================================
class UmaMusumeTracker {
    constructor() {
        // Filter state
        this.currentFilters = new Set();
        state.currentFilters = this.currentFilters;
        
        // Modal toggle state
        this.closeOnSelection = true;
        
        // Mobile/tablet factors expansion state
        this.factorsExpanded = false;
        this.lastKnownCompact = isMobileOrTablet();
        
        // Storage system state
        this.currentSaveSlot = null;
        this.currentDeleteSlot = null;
        
        // Picker state (will be integrated later)
        this.currentPickerSlot = null;
        this.pickerMonth = null;
        this.pickerHalf = null;
        this.pickerPosition = 'current';
        this.pickerSlots = [];
        this.pickerIndex = 0;
        
        // Month and half order for planner
        this.monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        this.halfOrder = ['1st','2nd'];
        
        // Setup race renderer global callbacks used by onclick handlers
        setupRaceRendererCallbacks(
            (raceId) => this.handleToggleParticipation(raceId),
            (raceId) => this.handleToggleWin(raceId)
        );
        
        // Initialize the application
        this.initialize();
    }
    
    async initialize() {
        // Load race data
        await initializeRaceData();
        
        // Import from URL share if present
        tryImportFromURL?.();
        
        // Bridge progress panel track button → handler
        setupProgressRendererCallbacks((factorId) => this.handleTrackFactor(factorId));
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.renderAll();
        
        // Sync progress panel height with planner after initial render
        setTimeout(() => this.syncProgressHeightToPlanner(), 0);
    }
    
    // ========================================================================
    // Event Listeners Setup
    // ========================================================================
    setupEventListeners() {
        // Filter button listeners (scope to calendar controls only)
        document.querySelectorAll('#calendar-section .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                handleFilterClick(
                    e,
                    this.currentFilters,
                    () => this.renderRaces(),
                    () => this.renderPlannerGrid()
                );
                this.updateProgress();
                // Update picker modal highlighting if it's open
                if (this.currentPickerSlot) {
                    this.renderPickerCarousel();
                }
            });
        });
        
        // Planner year tab listeners
        document.querySelectorAll('.year-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const year = (e.currentTarget || e.target).dataset.year;
                this.handleSetPlannerYear(year);
            });
        });
        
        // Clear planner year button
        const clearPlannerBtn = document.getElementById('clear-planner-year-btn');
        if (clearPlannerBtn) {
            clearPlannerBtn.addEventListener('click', () => this.handleClearPlannerYear());
        }
        
        // Clear all button
        const clearAllBtn = document.getElementById('clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAll());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // ESC key closes picker
            if (e.key === 'Escape') {
                this.closePicker();
            }
            // Arrow keys for picker navigation
            if (this.currentPickerSlot) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.navigatePicker('prev');
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigatePicker('next');
                }
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            const isCompact = isMobileOrTablet();
            if (isCompact !== this.lastKnownCompact) {
                this.lastKnownCompact = isCompact;
                this.syncProgressHeightToPlanner();
                this.updateProgress();
            }
            this.positionPickerNavs?.();
        });
    }
    
    // ========================================================================
    // Render Functions
    // ========================================================================
    renderAll() {
        this.renderRaces();
        this.renderPlannerGrid();
        this.updateProgress();
    }
    
    renderRaces() {
        const hiddenFactors = loadHiddenFactors();
        renderRaces(
            state.selectedRaces,
            state.wonRaces,
            state.lostRaces,
            (raceId) => isRaceTracked(String(raceId), state, hiddenFactors),
            (raceId) => isPlannedAnywhere(String(raceId)),
            (raceId) => this.handleToggleParticipation(raceId),
            (raceId) => this.handleToggleWin(raceId)
        );
    }
    
    renderPlannerGrid() {
        // Setup window callbacks for planner onclick handlers
        setupPlannerRendererCallbacks(
            (month, half) => this.openPicker(month, half),
            (month, half) => this.handleRemoveRace(month, half),
            (month, half) => this.handleToggleWinFromPlanner(month, half)
        );
        
        renderPlannerGrid(
            state.plannerYear,
            (race) => raceMatchesFilters(race, this.currentFilters),
            (month, half) => this.openPicker(month, half),
            (month, half) => this.handleRemoveRace(month, half),
            (month, half) => this.handleToggleWinFromPlanner(month, half)
        );
    }
    
    updateProgress() {
        // Update and render progress panel (all logic moved to progress-renderer.js)
        const trackingAutoCleared = updateAndRenderProgress(
            this.factorsExpanded, 
            (factorId) => this.handleTrackFactor(factorId),
            () => {
                this.factorsExpanded = !this.factorsExpanded;
                this.updateProgress();
            }
        );
        
        // If tracking was auto-cleared, update the planner and races to remove highlights
        if (trackingAutoCleared) {
            this.renderRaces();
            this.renderPlannerGrid();
        }
        
        // Re-sync height after content changes
        setTimeout(() => this.syncProgressHeightToPlanner(), 0);
    }
    
    // ========================================================================
    // Event Handlers
    // ========================================================================
    handleSetPlannerYear(year) {
        setPlannerYear(year, () => this.renderPlannerGrid());
    }
    
    handleClearPlannerYear() {
        if (confirm('Are you sure you want to clear all races for the current year?')) {
            clearPlannerYear(
                () => this.renderPlannerGrid(),
                () => this.renderRaces(),
                () => this.updateProgress()
            );
        }
    }
    
    handleToggleParticipation(raceId) {
        toggleParticipationById(
            raceId,
            () => this.renderRaces(),
            () => this.renderPlannerGrid(),
            () => this.updateProgress()
        );
    }
    
    handleToggleWin(raceId) {
        toggleWinById(raceId);
        this.renderRaces();
        this.renderPlannerGrid();
        this.updateProgress();
    }
    
    handleRemoveRace(month, half) {
        removeRaceFromPlanner(
            month,
            half,
            () => this.renderPlannerGrid(),
            () => this.renderRaces(),
            () => this.updateProgress()
        );
    }
    
    handleToggleWinFromPlanner(month, half) {
        toggleWinFromPlanner(
            month,
            half,
            toggleWinById,
            () => this.renderPlannerGrid()
        );
        this.updateProgress();
    }
    
    handleTrackFactor(factorId) {
        // Toggle tracked factor and refresh highlights
        state.trackedFactorId = (state.trackedFactorId === factorId) ? null : factorId;
        this.renderRaces();
        this.renderPlannerGrid();
        this.updateProgress();
    }

    // ========================================================================
    // Clear All Function
    // ========================================================================
    clearAll() {
        filterClearAll(
            state,
            () => this.renderPlannerGrid(),
            () => this.renderRaces(),
            () => this.updateProgress()
        );
    }
    
    // ========================================================================
    // Picker Functions (Placeholder - will integrate from original app.js)
    // ========================================================================
    openPicker(month, half) { pickerOpen(this, month, half); }
    
    closePicker() { pickerClose(this); }
    
    toggleCloseOnSelection() { pickerToggleClose(this); }
    
    navigatePicker(direction) { pickerNavigate(this, direction); }
    
    navigatePickerWithAnimation(direction) { pickerNavigateAnim(this, direction); }

    // ========================================================================
    // Storage & Share Dialogs (Delegated to modal-manager.js)
    // ========================================================================
    openSaveDialog() {
        openSaveDialog((slot) => {
            this.currentSaveSlot = openNameDialog(slot);
        });
    }
    closeSaveDialog() { closeSaveDialog(); }
    
    openLoadDialog() {
        openLoadDialog((slot) => {
            const key = `umatracker_slot_${slot}`;
            const data = localStorage.getItem(key);
            if (!data) return;
            try {
                const obj = JSON.parse(data);
                deserializeState(obj);
                this.renderPlannerGrid();
                this.renderRaces();
                this.updateProgress();
                showToast('Loaded');
            } catch {}
        });
    }
    closeLoadDialog() { closeLoadDialog(); }
    
    openShareDialog() { openShareDialog(); }
    closeShareDialog() { closeShareDialog(); }
    copyShareURL() { copyShareURL(); }

    // Naming dialog flow
    openNameDialog(slot) {
        this.currentSaveSlot = openNameDialog(slot);
    }
    closeNameDialog() { closeNameDialog(); }
    confirmSaveName() {
        confirmSaveName(this.currentSaveSlot, () => {
        this.currentSaveSlot = null;
            renderSaveSlotsUI(
                document.getElementById('save-slots-grid'), 
                (slot) => this.openNameDialog(slot), 
                () => showToast('Saved')
            );
        });
    }
    
    // ========================================================================
    // UI Helper Functions
    // ========================================================================
    syncProgressHeightToPlanner() {
        try {
            const progressPanel = document.getElementById('progress-panel');
            if (!progressPanel) return;
            
            // Skip on mobile/tablet - let natural flow work
            if (isMobileOrTablet()) {
                progressPanel.style.maxHeight = '';
                progressPanel.style.minHeight = '';
                return;
            }
            
            const plannerSection = document.getElementById('planner-section');
            if (!plannerSection) return;
            
            const plannerHeight = plannerSection.getBoundingClientRect().height;
            progressPanel.style.maxHeight = `${plannerHeight}px`;
        } catch (err) {
            // Ignore errors silently
        }
    }
    
    toggleFactorsPanel() {
        this.factorsExpanded = !this.factorsExpanded;
        this.updateProgress();
    }
}

// ============================================================================
// Initialize Application
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new UmaMusumeTracker();
});

// ============================================================================
// Export for testing
// ============================================================================
export { UmaMusumeTracker };
