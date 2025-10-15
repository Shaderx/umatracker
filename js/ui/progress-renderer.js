// js/ui/progress-renderer.js
// Renders the hidden factors progress panel with progress bars and statistics

import { state } from '../core/state.js';
import { isMobileOrTablet } from '../core/utils.js';
import { loadHiddenFactors } from '../data/hidden-factors.js';

/**
 * Sort hidden factors by completion status
 * @param {Array} results - Array of factor results
 * @returns {Array} Sorted results
 */
function sortFactorsByStatus(results) {
    results.sort((a, b) => {
        const aCompleted = a.result.completed ? 1 : 0;
        const bCompleted = b.result.completed ? 1 : 0;
        const aInProgress = (!a.result.completed && a.result.current > 0) ? 1 : 0;
        const bInProgress = (!b.result.completed && b.result.current > 0) ? 1 : 0;
        
        // Completed factors come first (descending)
        if (aCompleted !== bCompleted) return bCompleted - aCompleted;
        
        // Among non-completed, in-progress come before not started (descending)
        if (aInProgress !== bInProgress) return bInProgress - aInProgress;
        
        // Within the same category, maintain original order (by comparing indices)
        // This preserves the logical grouping from hiddenFactors array
        return 0;
    });
    return results;
}

/**
 * Update progress stats in the UI
 * @param {number} completedCount - Number of completed factors
 * @param {number} inProgressCount - Number of in-progress factors
 */
function updateProgressStats(completedCount, inProgressCount) {
    const totalRacesEl = document.getElementById('total-races');
    const totalWinsEl = document.getElementById('total-wins');
    const totalLossesEl = document.getElementById('total-losses');
    const completedFactorsEl = document.getElementById('completed-factors');
    
    if (totalRacesEl) totalRacesEl.textContent = state.selectedRaces.size;
    if (totalWinsEl) totalWinsEl.textContent = state.wonRaces.size;
    if (totalLossesEl) totalLossesEl.textContent = state.lostRaces.size;
    if (completedFactorsEl) completedFactorsEl.textContent = completedCount;
    
    // Update quick stats
    const qsRacesEl = document.getElementById('qs-races');
    const qsWinsEl = document.getElementById('qs-wins');
    const qsCompletedEl = document.getElementById('qs-completed');
    const qsProgressEl = document.getElementById('qs-progress');
    
    if (qsRacesEl) qsRacesEl.textContent = state.selectedRaces.size;
    if (qsWinsEl) qsWinsEl.textContent = state.wonRaces.size;
    if (qsCompletedEl) qsCompletedEl.textContent = completedCount;
    if (qsProgressEl) qsProgressEl.textContent = inProgressCount;
}

/**
 * Main function to update and render progress panel
 * @param {boolean} factorsExpanded - Whether factors are expanded on mobile
 * @param {Function} setTrackedFactorCallback - Callback to set tracked factor
 * @param {Function} toggleFactorsExpandedCallback - Callback to toggle expansion
 * @returns {boolean} True if tracking was auto-cleared
 */
export function updateAndRenderProgress(factorsExpanded, setTrackedFactorCallback, toggleFactorsExpandedCallback) {
    // Load hidden factors and run checks
    const hiddenFactors = loadHiddenFactors();
    const results = hiddenFactors.map(factor => ({
        ...factor,
        result: factor.check()
    }));
    
    // Sort results: completed first, in-progress second, not started last
    sortFactorsByStatus(results);
    
    // Auto-clear tracking if the tracked factor is now completed
    let trackingAutoCleared = false;
    if (state.trackedFactorId) {
        const trackedFactor = results.find(r => r.id === state.trackedFactorId);
        if (trackedFactor && trackedFactor.result.completed) {
            state.trackedFactorId = null;
            trackingAutoCleared = true;
        }
    }
    
    // Update stats
    const completedCount = results.filter(r => r.result.completed).length;
    const inProgressCount = results.filter(r => !r.result.completed && r.result.current > 0).length;
    updateProgressStats(completedCount, inProgressCount);
    
    // Render progress panel
    renderHiddenFactors(
        results, 
        state.trackedFactorId, 
        factorsExpanded, 
        setTrackedFactorCallback,
        toggleFactorsExpandedCallback
    );
    
    return trackingAutoCleared;
}

/**
 * Renders the hidden factors progress panel
 * @param {Array} results - Array of hidden factor results with {id, nameEN, nameJP, condition, conditionEN, conditionJP, result, trackable}
 * @param {string|null} trackedFactorId - Currently tracked factor ID
 * @param {boolean} factorsExpanded - Whether factors are expanded on mobile
 * @param {Function} setTrackedFactorCallback - Callback to set tracked factor
 * @param {Function} toggleFactorsExpandedCallback - Callback to toggle expansion
 */
export function renderHiddenFactors(results, trackedFactorId, factorsExpanded, setTrackedFactorCallback, toggleFactorsExpandedCallback) {
    const container = document.getElementById('hidden-factors');
    if (!container) return;
    
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth > 640 && window.innerWidth <= 900;
    const isCompactView = isMobile || isTablet;
    
    // Add/remove expanded class for CSS styling
    if (factorsExpanded) {
        container.classList.add('factors-expanded');
    } else {
        container.classList.remove('factors-expanded');
    }
    
    container.innerHTML = results.map((factor, index) => {
        const statusClass = factor.result.completed ? 'completed' : 
                           factor.result.progress > 0 ? 'partial' : '';
        const progressPercentage = Math.min(100, (factor.result.current / factor.result.required) * 100);
        const isTracked = trackedFactorId === factor.id;
        const showTrackButton = factor.trackable !== false && !factor.result.completed;
        
        // On mobile/tablet, show only completed and in-progress factors (hide not-started)
        const isCompleted = factor.result.completed;
        const isInProgress = !factor.result.completed && factor.result.current > 0;
        const shouldCollapseInitially = isCompactView && !isCompleted && !isInProgress && !factorsExpanded;
        
        return `
            <div class="factor-item ${statusClass} ${isTracked ? 'factor-tracked' : ''} ${shouldCollapseInitially ? 'hidden-factor-collapsed' : ''}">
                <div class="factor-header">
                    <div class="factor-name">
                        <div class="factor-name-en">${factor.nameEN}</div>
                        <div class="factor-name-jp">${factor.nameJP}</div>
                        ${factor.result.completed ? '<div class="completion-badge">✅</div>' : ''}
                    </div>
                    ${showTrackButton ? `
                        <button class="btn btn-track ${isTracked ? 'active' : ''}" 
                                onclick="window.setTrackedFactorFromRenderer('${factor.id}')" 
                                title="Track this factor / この因子を追跡">
                            🔍
                        </button>
                    ` : ''}
                </div>
                <div class="factor-condition">
                    <div class="condition-en">${factor.conditionEN || factor.condition}</div>
                    ${factor.conditionJP ? `<div class="condition-jp">${factor.conditionJP}</div>` : ''}
                </div>
                <div class="factor-progress">
                    <div>Progress / 進捗: ${factor.result.current}/${factor.result.required}</div>
                    ${factor.result.details ? `<div style="margin-top: 2px; font-size: 0.75rem;">• ${factor.result.details}</div>` : ''}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add show more button on mobile/tablet if there are hidden factors
    // Remove any existing show more button first
    const progressPanel = document.getElementById('progress-panel');
    const existingBtn = progressPanel ? progressPanel.querySelector('.show-more-factors') : null;
    if (existingBtn) {
        existingBtn.remove();
    }
    
    if (isCompactView && progressPanel) {
        // Count how many not-started factors are hidden in compact mode
        const notStartedCount = results.filter(f => !f.result.completed && f.result.current === 0).length;
        
        if (notStartedCount > 0) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-factors' + (factorsExpanded ? ' expanded' : '');
            showMoreBtn.innerHTML = `
                <span>${factorsExpanded ? 'Show Less' : `Show More (${notStartedCount} hidden)`}</span>
                <span class="arrow">▼</span>
                <br><span style="font-size: 0.8em; opacity: 0.8;">${factorsExpanded ? '表示を減らす' : `さらに表示 (${notStartedCount}件)`}</span>
            `;
            showMoreBtn.onclick = () => {
                if (toggleFactorsExpandedCallback) toggleFactorsExpandedCallback();
            };
            // Append to progress-panel (after hidden-factors), not inside hidden-factors
            progressPanel.appendChild(showMoreBtn);
        }
    }
    
    // Show/hide clear tracking button
    const clearBtn = document.getElementById('clear-tracking-btn');
    if (clearBtn) {
        clearBtn.style.display = trackedFactorId ? 'block' : 'none';
    }
    
    // Show/hide tracked filter button
    const trackedFilterBtn = document.getElementById('tracked-filter-btn');
    if (trackedFilterBtn) {
        trackedFilterBtn.style.display = trackedFactorId ? 'inline-flex' : 'none';
    }
}

/**
 * Syncs the progress panel height to match the planner on desktop
 */
export function syncProgressHeightToPlanner() {
    const progressPanel = document.getElementById('progress-panel');
    const plannerSection = document.getElementById('planner-section');
    
    if (!progressPanel || !plannerSection) return;
    
    // Only sync on desktop (> 900px)
    if (!isMobileOrTablet()) {
        const plannerHeight = plannerSection.offsetHeight;
        progressPanel.style.minHeight = `${plannerHeight}px`;
    } else {
        // Reset on mobile/tablet
        progressPanel.style.minHeight = '';
    }
}

/**
 * Setup window callbacks for progress renderer
 * This allows onclick handlers in HTML to call back to the tracker
 */
export function setupProgressRendererCallbacks(setTrackedFactorFn) {
    window.setTrackedFactorFromRenderer = (factorId) => {
        try { setTrackedFactorFn && setTrackedFactorFn(factorId); } catch (e) { console.error(e); }
    };
}
