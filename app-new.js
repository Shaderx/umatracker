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
    clearAll as filterClearAll
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
import { openPicker as pickerOpen, closePicker as pickerClose, navigatePicker as pickerNavigate, navigatePickerWithAnimation as pickerNavigateAnim } from './js/features/picker-modal.js';
import { buildShareURL, tryImportFromURL } from './js/storage/url-sharing.js';
import { renderSaveSlotsUI, renderLoadSlotsUI } from './js/storage/storage-manager.js';

// Import UI Modules
import { renderHiddenFactors, setupProgressRendererCallbacks } from './js/ui/progress-renderer.js';
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
        this.lastKnownCompact = window.innerWidth <= 900;
        
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
            const isCompact = window.innerWidth <= 900;
            if (isCompact !== this.lastKnownCompact) {
                this.lastKnownCompact = isCompact;
                this.syncProgressHeightToPlanner();
                this.updateProgress();
            }
            this.positionPickerNavs?.();
        });
        
        // Factors panel toggle (mobile/tablet)
        const toggleBtn = document.getElementById('toggle-factors-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleFactorsPanel());
        }
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
    
    // Apply filters to race list
    applyFilters(races) {
        if (this.currentFilters.size === 0) {
            return races;
        }
        
        return races.filter(race => this.raceMatchesFilters(race));
    }
    
    // Check if a single race matches current filters (for planner slot highlighting)
    raceMatchesFilters(race) {
        if (this.currentFilters.size === 0) return true;

        const gradeKeys = ['GI', 'GII', 'GIII', 'Open', 'Pre-OP'];
        const activeGrades = [...this.currentFilters].filter(f => gradeKeys.includes(f));
        const otherFilters = [...this.currentFilters].filter(f => !gradeKeys.includes(f));

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
    
    renderPlannerGrid() {
        // Setup window callbacks for planner onclick handlers
        setupPlannerRendererCallbacks(
            (month, half) => this.openPicker(month, half),
            (month, half) => this.handleRemoveRace(month, half),
            (month, half) => this.handleToggleWinFromPlanner(month, half)
        );
        
        renderPlannerGrid(
            state.plannerYear,
            (race) => this.raceMatchesFilters(race),
            (month, half) => this.openPicker(month, half),
            (month, half) => this.handleRemoveRace(month, half),
            (month, half) => this.handleToggleWinFromPlanner(month, half)
        );
    }
    
    updateProgress() {
        // Load hidden factors and run checks
        const hiddenFactors = loadHiddenFactors();
        let results = hiddenFactors.map(factor => ({
            ...factor,
            result: factor.check()
        }));
        // Sort: completed first, partial next, then not-started
        results = results.sort((a, b) => {
            const rank = (r) => r.result.completed ? 0 : (r.result.progress > 0 ? 1 : 2);
            const ra = rank(a), rb = rank(b);
            if (ra !== rb) return ra - rb;
            // Within same rank, keep stable by EN name
            return (a.nameEN || a.name || '').localeCompare(b.nameEN || b.name || '');
        });
        
        // Render progress panel
        renderHiddenFactors(
            results, 
            state.trackedFactorId, 
            this.factorsExpanded, 
            (factorId) => this.handleTrackFactor(factorId),
            () => {
                this.factorsExpanded = !this.factorsExpanded;
                this.updateProgress();
            }
        );
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
    
    navigatePicker(direction) { pickerNavigate(this, direction); }
    
    navigatePickerWithAnimation(direction) { pickerNavigateAnim(this, direction); }

    // ========================================================================
    // Storage & Share Dialogs
    // ========================================================================
    openSaveDialog() {
        const modal = document.getElementById('save-modal');
        if (!modal) return;
        renderSaveSlotsUI(document.getElementById('save-slots-grid'), (slot) => this.openNameDialog(slot), () => showToast('Saved'));
        modal.classList.remove('hidden');
        lockBodyScroll(modal);
    }
    closeSaveDialog() {
        const modal = document.getElementById('save-modal');
        if (!modal) return;
        modal.classList.add('hidden');
        unlockBodyScroll(modal);
    }
    openLoadDialog() {
        const modal = document.getElementById('load-modal');
        if (!modal) return;
        renderLoadSlotsUI(document.getElementById('load-slots-grid'), (slot) => {
            const key = `umatracker_slot_${slot}`;
            const data = localStorage.getItem(key);
            if (!data) return;
            try {
                const obj = JSON.parse(data);
                this.deserializeState(obj);
                this.renderPlannerGrid();
                this.renderRaces();
                this.updateProgress();
                showToast('Loaded');
            } catch {}
        });
        modal.classList.remove('hidden');
        lockBodyScroll(modal);
    }
    closeLoadDialog() {
        const modal = document.getElementById('load-modal');
        if (!modal) return;
        modal.classList.add('hidden');
        unlockBodyScroll(modal);
    }
    openShareDialog() {
        const modal = document.getElementById('share-modal');
        if (!modal) return;
        const url = buildShareURL();
        const input = document.getElementById('share-url-input');
        if (input) input.value = url;
        // Basic stats
        const races = state.selectedRaces.size;
        const wins = state.wonRaces.size;
        // Calculate completed factors
        const hiddenFactors = loadHiddenFactors();
        const factors = hiddenFactors.filter(factor => factor.check().completed).length;
        const rEl = document.getElementById('share-stat-races');
        const wEl = document.getElementById('share-stat-wins');
        const fEl = document.getElementById('share-stat-factors');
        if (rEl) rEl.textContent = String(races);
        if (wEl) wEl.textContent = String(wins);
        if (fEl) fEl.textContent = String(factors);
        modal.classList.remove('hidden');
        lockBodyScroll(modal);
    }
    closeShareDialog() {
        const modal = document.getElementById('share-modal');
        if (!modal) return;
        modal.classList.add('hidden');
        unlockBodyScroll(modal);
    }
    copyShareURL() {
        const input = document.getElementById('share-url-input');
        if (!input) return;
        input.select();
        input.setSelectionRange(0, 99999);
        try {
            document.execCommand('copy');
            showToast('Share URL copied to clipboard');
        } catch {}
    }

    // ========================================================================
    // Persistence (localStorage) & URL share encoding (LZString optional)
    // ========================================================================
    serializeState() {
        // Only store essentials compatible with legacy
        return {
            selected: Array.from(state.selectedRaces),
            won: Array.from(state.wonRaces),
            lost: Array.from(state.lostRaces),
            planner: state.plannerData,
            year: state.plannerYear,
            tracked: state.trackedFactorId
        };
    }
    deserializeState(obj) {
        try {
            state.selectedRaces = new Set(obj.selected || []);
            state.wonRaces = new Set(obj.won || []);
            state.lostRaces = new Set(obj.lost || []);
            if (obj.planner) state.plannerData = obj.planner;
            if (obj.year) state.plannerYear = obj.year;
            state.trackedFactorId = obj.tracked || null;
        } catch {}
    }
    buildShareURL() {
        const base = window.location.origin + window.location.pathname;
        const raw = JSON.stringify(this.serializeState());
        const compressed = (window.LZString && window.LZString.compressToEncodedURIComponent) ? window.LZString.compressToEncodedURIComponent(raw) : encodeURIComponent(raw);
        return `${base}?s=${compressed}`;
    }
    renderSaveSlots() {
        const grid = document.getElementById('save-slots-grid');
        if (!grid) return;
        const slots = Array.from({ length: 6 }, (_, i) => i + 1);
        grid.innerHTML = slots.map(n => {
            const key = `umatracker_slot_${n}`;
            const data = localStorage.getItem(key);
            let name = '';
            if (data) {
                try { const obj = JSON.parse(data); name = obj.name || ''; } catch {}
            }
            return `<div class="save-slot-card ${data ? 'filled' : 'empty'}" data-slot="${n}">
                <div class="slot-header"><div class="slot-number">Slot ${n}</div><div class="slot-actions"><button class="btn-rename-slot" data-slot="${n}">✏️</button><button class="btn-delete-slot" data-slot="${n}">🗑️</button></div></div>
                <div class="slot-body">${data ? `<div class=\"slot-info\"><div class=\"slot-name\">${name || 'Unnamed'}</div></div>` : '<div class="empty-slot"><div class="plus-icon">＋</div><div class="jp-text">空きスロット</div></div>'}</div>
            </div>`;
        }).join('');
        grid.onclick = (e) => {
            const card = e.target.closest('.save-slot-card');
            const del = e.target.closest('.btn-delete-slot');
            const rename = e.target.closest('.btn-rename-slot');
            if (!card && !del && !rename) return;
            const slot = Number((card || del || rename).dataset.slot);
            const key = `umatracker_slot_${slot}`;
            if (del) {
                localStorage.removeItem(key);
                this.renderSaveSlots();
                return;
            }
            if (rename) {
                this.openNameDialog(slot);
                return;
            }
            // Save immediately (preserve name if present)
            const payload = this.serializeState();
            try {
                const existing = localStorage.getItem(key);
                if (existing) { const obj = JSON.parse(existing); if (obj.name) payload.name = obj.name; }
            } catch {}
            localStorage.setItem(key, JSON.stringify(payload));
            this.renderSaveSlots();
            showToast('Saved');
        };
    }
    renderLoadSlots() {
        const grid = document.getElementById('load-slots-grid');
        if (!grid) return;
        const slots = Array.from({ length: 6 }, (_, i) => i + 1);
        grid.innerHTML = slots.map(n => {
            const key = `umatracker_slot_${n}`;
            const data = localStorage.getItem(key);
            return `<div class="save-slot-card ${data ? 'filled' : 'empty'}" data-slot="${n}">
                <div class="slot-header"><div class="slot-number">Slot ${n}</div></div>
                <div class="slot-body">${data ? '<div class="slot-info">Saved</div>' : '<div class="empty-slot"><div class="plus-icon">－</div><div class="jp-text">空きスロット</div></div>'}</div>
            </div>`;
        }).join('');
        grid.onclick = (e) => {
            const card = e.target.closest('.save-slot-card');
            if (!card) return;
            const slot = Number(card.dataset.slot);
            const key = `umatracker_slot_${slot}`;
            const data = localStorage.getItem(key);
            if (!data) return;
            try {
                const obj = JSON.parse(data);
                this.deserializeState(obj);
                this.renderPlannerGrid();
                this.renderRaces();
                this.updateProgress();
                showToast('Loaded');
            } catch {}
        };
    }

    // Naming dialog flow
    openNameDialog(slot) {
        this.currentSaveSlot = slot;
        const modal = document.getElementById('name-modal');
        const input = document.getElementById('name-input');
        if (modal && input) {
            input.value = '';
            modal.classList.remove('hidden');
            lockBodyScroll(modal);
            setTimeout(() => { input.focus(); }, 0);
        }
    }
    closeNameDialog() {
        const modal = document.getElementById('name-modal');
        if (!modal) return;
        modal.classList.add('hidden');
        unlockBodyScroll(modal);
    }
    confirmSaveName() {
        const input = document.getElementById('name-input');
        const name = (input && typeof input.value === 'string') ? input.value.trim() : '';
        if (!this.currentSaveSlot) return this.closeNameDialog();
        const key = `umatracker_slot_${this.currentSaveSlot}`;
        const payload = this.serializeState();
        if (name) payload.name = name;
        localStorage.setItem(key, JSON.stringify(payload));
        this.currentSaveSlot = null;
        this.closeNameDialog();
        this.renderSaveSlots();
        showToast('Saved');
    }

    getAdjacentSlot(step) {
        if (!this.currentPickerSlot) return null;
        const { month, half } = this.currentPickerSlot;
        const months = state.monthOrder;
        const halves = state.halfOrder;
        let mIndex = months.indexOf(month);
        let hIndex = halves.indexOf(half);
        const linearIndex = mIndex * 2 + hIndex + step;
        if (linearIndex < 0 || linearIndex >= months.length * halves.length) return this.currentPickerSlot;
        const newM = months[Math.floor(linearIndex / 2)];
        const newH = halves[linearIndex % 2];
        return { year: state.plannerYear, month: newM, half: newH };
    }

    renderPickerCarousel() {
        if (!this.currentPickerSlot) return;
        const { month, half } = this.currentPickerSlot;
        this.renderPickerCard('current', { month, half });
        this.renderPickerCard('prev', this.getAdjacentSlot(-1));
        this.renderPickerCard('next', this.getAdjacentSlot(1));
        this.updatePickerPagination?.();
        this.attachPickerSwipeHandlers?.();
        this.updatePickerToggleCloseButton?.();
        this.positionPickerNavs?.();
    }

    updatePickerToggleCloseButton() {
        const btn = document.getElementById('toggle-close-btn');
        if (btn) {
            if (this.closeOnSelection) btn.classList.add('active'); else btn.classList.remove('active');
        }
    }

    renderPickerCard(position, slot) {
        const suffix = position === 'current' ? '' : `-${position}`;
        const listEl = document.getElementById(`picker-list${suffix}`);
        const titleEl = document.getElementById(`picker-title${suffix}`);
        if (!listEl || !slot) return;
        const { month, half } = slot;
        const t = state.translations;
        const monthLabel = t.months[month] || month;
        const halfLabel = t.halves[half] || half;
        if (titleEl) titleEl.textContent = `${monthLabel} ${halfLabel}`;

        // Build list of races available in this slot for the current planner year
        const available = state.races.filter(r => r.month === month && r.half === half && r[state.plannerYear]);
        const cellValue = state.plannerData[state.plannerYear][cellKey(month, half)];
        listEl.innerHTML = available.map(r => {
            const selected = String(cellValue) === String(r.id);
            const imageUrl = r.image || '';
            return `
                <div class="picker-item ${selected ? 'selected' : ''}" data-race-id="${r.id}">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${(r.name || '').replace(/\"/g, '&quot;')}">` : ''}
                    <div>
                        <h4>${r.name}</h4>
                        <div class="sub">${r.length} • ${r.surface} • ${r.racetrack}</div>
                        <div class="sub">${(state.translations.tracks[r.racetrack] || r.racetrack)} • ${(state.translations.months[r.month] || r.month)} ${(state.translations.halves[r.half] || r.half)} ${(r.direction ? `• ${(state.translations.directions[r.direction] || r.direction)}` : '')}</div>
                        <div class="sub">${r.type}${r.series ? ` • ${r.series}` : ''}${r.junior ? ' • Junior' : ''}${r.classics ? ' • Classic' : ''}${r.senior ? ' • Senior' : ''}</div>
                    </div>
                </div>
            `;
        }).join('');

        if (position === 'current') {
            listEl.onclick = (e) => {
                const item = e.target.closest('.picker-item');
                if (!item) return;
                const raceId = item.getAttribute('data-race-id');
                if (!raceId) return;
                // Place race into planner and mark as selected+won by default
                const r = state.raceById.get(String(raceId));
                if (r) {
                    planRaceIntoPlanner(r, state.plannerYear);
                    state.selectedRaces.add(String(raceId));
                    state.wonRaces.add(String(raceId));
                }
                this.renderPlannerGrid();
                this.renderRaces();
                this.updateProgress();
                if (this.closeOnSelection) this.closePicker();
                else this.renderPickerCarousel();
            };
        }
    }

    toggleCloseOnSelection() {
        this.closeOnSelection = !this.closeOnSelection;
        this.updatePickerToggleCloseButton();
    }

    positionPickerNavs() {
        const panel = document.getElementById('picker-panel');
        const leftBtn = document.querySelector('.picker-nav-left');
        const rightBtn = document.querySelector('.picker-nav-right');
        if (!panel || !leftBtn || !rightBtn) return;
        const rect = panel.getBoundingClientRect();
        const gutter = 12;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const leftX = Math.max(8, rect.left - leftBtn.offsetWidth - gutter);
        const rightX = Math.min(viewportWidth - rightBtn.offsetWidth - 8, rect.right + gutter);
        // Use fixed positioning with explicit top to avoid transform issues
        const centerY = rect.top + rect.height / 2 - (leftBtn.offsetHeight / 2);
        [leftBtn, rightBtn].forEach(btn => { btn.style.position = 'fixed'; btn.style.top = `${centerY}px`; });
        leftBtn.style.left = `${leftX}px`;
        rightBtn.style.left = `${rightX}px`;
    }

    attachPickerSwipeHandlers() {
        const panel = document.getElementById('picker-panel');
        const carousel = document.getElementById('picker-carousel');
        if (!panel || !carousel) return;
        let startX = 0; let startY = 0; let dragging = false; let moved = false;
        const onStart = (x, y) => { startX = x; startY = y; dragging = true; moved = false; carousel.style.transition = 'none'; };
        const onMove = (x, y) => {
            if (!dragging) return;
            const dx = x - startX; const dy = y - startY;
            if (!moved && Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
            // Only handle horizontal dominant gestures
            if (Math.abs(dx) > Math.abs(dy) * 1.2) {
                moved = true;
                const percent = (-33.333) + (dx / panel.offsetWidth) * 33.333;
                carousel.style.transform = `translateX(${percent}%)`;
            }
        };
        const onEnd = (x) => {
            if (!dragging) return;
            dragging = false;
            const dx = x - startX;
            carousel.style.transition = 'transform 200ms ease';
            if (moved && Math.abs(dx) > panel.offsetWidth * 0.15) {
                // Commit swipe
                const direction = dx > 0 ? -1 : 1; // right swipe -> previous
                const target = direction < 0 ? 0 : -66.666;
                carousel.style.transform = `translateX(${target}%)`;
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    carousel.style.transform = 'translateX(-33.333%)';
                    this.navigatePicker(direction < 0 ? 'prev' : 'next');
                }, 210);
            } else {
                // Snap back
                carousel.style.transform = 'translateX(-33.333%)';
            }
        };
        // Touch events
        panel.ontouchstart = (e) => onStart(e.touches[0].clientX, e.touches[0].clientY);
        panel.ontouchmove = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY);
        panel.ontouchend = (e) => onEnd((e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX));
        // Mouse events (desktop simulation)
        panel.onmousedown = (e) => onStart(e.clientX, e.clientY);
        panel.onmousemove = (e) => onMove(e.clientX, e.clientY);
        panel.onmouseup = (e) => onEnd(e.clientX);
        panel.onmouseleave = (e) => { if (dragging) onEnd(e.clientX || startX); };
    }
    
    // ========================================================================
    // UI Helper Functions
    // ========================================================================
    syncProgressHeightToPlanner() {
        const progressPanel = document.getElementById('progress-panel');
        const plannerGrid = document.querySelector('.planner-grid');
        
        if (!progressPanel || !plannerGrid) return;
        
        const isCompact = window.innerWidth <= 900;
        
        if (isCompact) {
            // On mobile/tablet, remove fixed height
            progressPanel.style.height = '';
        } else {
            // On desktop, match planner height
            const plannerHeight = plannerGrid.offsetHeight;
            progressPanel.style.height = `${plannerHeight}px`;
        }
    }
    
    toggleFactorsPanel() {
        this.factorsExpanded = !this.factorsExpanded;
        const panel = document.getElementById('progress-panel');
        const btn = document.getElementById('toggle-factors-btn');
        
        if (panel && btn) {
            if (this.factorsExpanded) {
                panel.classList.add('expanded');
                btn.textContent = '▼ Hide Progress';
            } else {
                panel.classList.remove('expanded');
                btn.textContent = '▶ Show Progress';
            }
        }
    }
    
    // ========================================================================
    // Storage Functions (Placeholder - will integrate later)
    // ========================================================================
    saveToSlot(slot) {
        // TODO: Integrate storage functionality
        console.log('Save to slot:', slot);
        showToast('Storage feature coming soon!', 3000);
    }
    
    loadFromSlot(slot) {
        // TODO: Integrate storage functionality
        console.log('Load from slot:', slot);
        showToast('Storage feature coming soon!', 3000);
    }
    
    deleteSlot(slot) {
        // TODO: Integrate storage functionality
        console.log('Delete slot:', slot);
        showToast('Storage feature coming soon!', 3000);
    }
    
    exportToURL() {
        // TODO: Integrate URL sharing functionality
        console.log('Export to URL');
        showToast('URL sharing feature coming soon!', 3000);
    }
    
    importFromURL() {
        // TODO: Integrate URL import functionality
        console.log('Import from URL');
        showToast('URL import feature coming soon!', 3000);
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
