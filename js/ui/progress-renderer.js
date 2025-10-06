// js/ui/progress-renderer.js
// Renders the hidden factors progress panel with progress bars and statistics

import { state } from '../core/state.js';

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
    
    container.innerHTML = results.map((factor, index) => {
        const statusClass = factor.result.completed ? 'completed' : 
                           factor.result.progress > 0 ? 'partial' : '';
        const progressPercentage = Math.min(100, (factor.result.current / factor.result.required) * 100);
        const isTracked = trackedFactorId === factor.id;
        const showTrackButton = factor.trackable !== false && !factor.result.completed;
        
        // On mobile/tablet, initially show only first 2 factors
        const shouldCollapseInitially = isCompactView && index >= 2 && !factorsExpanded;
        
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
    
    // Add show more button on mobile/tablet if there are more than 2 factors
    if (isCompactView && results.length > 2) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'show-more-factors' + (factorsExpanded ? ' expanded' : '');
        showMoreBtn.innerHTML = `
            <span>${factorsExpanded ? 'Show Less' : `Show More (${results.length - 2} hidden)`}</span>
            <span class="arrow">▼</span>
            <br><span style="font-size: 0.8em; opacity: 0.8;">${factorsExpanded ? '表示を減らす' : `さらに表示 (${results.length - 2}件)`}</span>
        `;
        showMoreBtn.onclick = () => {
            if (toggleFactorsExpandedCallback) toggleFactorsExpandedCallback();
        };
        container.appendChild(showMoreBtn);
    }

    // Ensure only two items visible by default on compact view
    if (isCompactView && !factorsExpanded) {
        const children = container.querySelectorAll('.factor-item');
        children.forEach((el, idx) => {
            if (idx >= 2) el.classList.add('hidden-factor-collapsed');
        });
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
    if (window.innerWidth > 900) {
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
