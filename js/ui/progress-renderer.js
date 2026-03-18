// js/ui/progress-renderer.js
// Renders the progress panel: JP hidden factors OR EN epithets depending on active DB

import { state } from '../core/state.js';
import { isMobileOrTablet } from '../core/utils.js';
import { loadHiddenFactors } from '../data/hidden-factors.js';
import { loadEpithets, clearEpithetCache } from '../data/epithets-en.js';
import { getCurrentDb } from '../data/race-data.js';

function sortByStatus(results) {
    results.sort((a, b) => {
        const aC = a.result.completed ? 1 : 0;
        const bC = b.result.completed ? 1 : 0;
        const aP = (!a.result.completed && a.result.current > 0) ? 1 : 0;
        const bP = (!b.result.completed && b.result.current > 0) ? 1 : 0;
        if (aC !== bC) return bC - aC;
        if (aP !== bP) return bP - aP;
        return 0;
    });
    return results;
}

function updateProgressStats(completedCount, inProgressCount) {
    const totalRacesEl = document.getElementById('total-races');
    const totalWinsEl = document.getElementById('total-wins');
    const totalLossesEl = document.getElementById('total-losses');
    const completedFactorsEl = document.getElementById('completed-factors');

    if (totalRacesEl) totalRacesEl.textContent = state.selectedRaces.size;
    if (totalWinsEl) totalWinsEl.textContent = state.wonRaces.size;
    if (totalLossesEl) totalLossesEl.textContent = state.lostRaces.size;
    if (completedFactorsEl) completedFactorsEl.textContent = completedCount;

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
 * Main update + render entry point.
 * Automatically picks JP hidden factors or EN epithets based on active DB.
 */
export function updateAndRenderProgress(factorsExpanded, setTrackedFactorCallback, toggleFactorsExpandedCallback) {
    const isEN = getCurrentDb() === 'en';

    let items;
    if (isEN) {
        clearEpithetCache();
        items = loadEpithets();
    } else {
        items = loadHiddenFactors();
    }

    const results = items.map(item => ({
        ...item,
        result: item.check()
    }));

    sortByStatus(results);

    let trackingAutoCleared = false;
    if (state.trackedFactorId) {
        const tracked = results.find(r => r.id === state.trackedFactorId);
        if (tracked && tracked.result.completed) {
            state.trackedFactorId = null;
            trackingAutoCleared = true;
        }
    }

    const completedCount = results.filter(r => r.result.completed).length;
    const inProgressCount = results.filter(r => !r.result.completed && r.result.current > 0).length;
    updateProgressStats(completedCount, inProgressCount);

    // Update section title based on active DB
    const titleEl = document.querySelector('#progress-panel .section-title');
    if (titleEl) {
        titleEl.innerHTML = isEN
            ? 'Epithet Tracker<br><span style="font-size: 0.8em; font-weight: normal; color: #718096;">称号トラッカー (Global)</span>'
            : 'Progress Tracker<br><span style="font-size: 0.8em; font-weight: normal; color: #718096;">進捗トラッカー</span>';
    }

    // Compute reward tally for EN epithets
    const rewardTally = isEN ? computeRewardTally(results) : null;

    renderFactorList(
        results,
        state.trackedFactorId,
        factorsExpanded,
        setTrackedFactorCallback,
        toggleFactorsExpandedCallback,
        isEN,
        rewardTally
    );

    return trackingAutoCleared;
}

function computeRewardTally(results) {
    let stats5 = 0;
    let stats10 = 0;
    let stats15 = 0;
    const hints = [];
    for (const f of results) {
        if (!f.result.completed) continue;
        const r = f.reward || '';
        const statsMatch = r.match(/random stats \+(\d+)/);
        if (statsMatch) {
            const val = parseInt(statsMatch[1]);
            if (val === 5) stats5++;
            else if (val === 10) stats10++;
            else if (val === 15) stats15++;
        }
        if (r.includes('hint')) hints.push(r);
    }
    return { stats5, stats10, stats15, hints };
}

function renderFactorList(results, trackedFactorId, factorsExpanded, setTrackedFactorCallback, toggleFactorsExpandedCallback, isEN, rewardTally) {
    const container = document.getElementById('hidden-factors');
    if (!container) return;

    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth > 640 && window.innerWidth <= 900;
    const isCompactView = isMobile || isTablet;

    if (factorsExpanded) {
        container.classList.add('factors-expanded');
    } else {
        container.classList.remove('factors-expanded');
    }

    let tallyHtml = '';
    if (isEN && rewardTally) {
        const hintHtml = rewardTally.hints.length
            ? rewardTally.hints.map(h => `<span class="tally-hint">${h}</span>`).join('')
            : '';
        // Each reward is "2 random stats +X" - so multiply by 2 for total bonus
        const totalBonus = (rewardTally.stats5 * 2 * 5) + (rewardTally.stats10 * 2 * 10) + (rewardTally.stats15 * 2 * 15);
        const parts = [];
        if (rewardTally.stats5 > 0) parts.push(`${rewardTally.stats5}×+5`);
        if (rewardTally.stats10 > 0) parts.push(`${rewardTally.stats10}×+10`);
        if (rewardTally.stats15 > 0) parts.push(`${rewardTally.stats15}×+15`);
        const breakdownHtml = parts.length ? `<span class="tally-breakdown">(${parts.join(', ')})</span>` : '';
        tallyHtml = `<div class="reward-tally">
            <span class="tally-stats">📊 Random Stats <strong>+${totalBonus}</strong></span>
            ${breakdownHtml}
            ${hintHtml}
        </div>`;
    }

    container.innerHTML = tallyHtml + results.map(factor => {
        const statusClass = factor.result.completed ? 'completed' :
                           factor.result.progress > 0 ? 'partial' : '';
        const progressPct = Math.min(100, (factor.result.current / factor.result.required) * 100);
        const isTracked = trackedFactorId === factor.id;
        const showTrack = factor.trackable !== false && !factor.result.completed;

        const isCompleted = factor.result.completed;
        const isInProgress = !factor.result.completed && factor.result.current > 0;
        const shouldCollapse = isCompactView && !isCompleted && !isInProgress && !factorsExpanded;

        const nameMain = isEN ? factor.name : factor.nameEN;
        const nameSub = isEN ? (factor.reward || '') : (factor.nameJP || '');
        const condText = isEN ? factor.condition : (factor.conditionEN || factor.condition);
        const condSub = isEN ? '' : (factor.conditionJP || '');

        const prereqHtml = isEN && factor.prereqs
            ? `<div class="epithet-prereqs">Requires: ${factor.prereqs.map(p => {
                const ep = results.find(r => r.id === p);
                const done = ep && ep.result.completed;
                return `<span class="prereq-tag ${done ? 'prereq-done' : ''}">${ep ? (ep.name || ep.nameEN) : p} ${done ? '✓' : '✗'}</span>`;
            }).join(' ')}</div>`
            : '';

        return `
            <div class="factor-item ${statusClass} ${isTracked ? 'factor-tracked' : ''} ${shouldCollapse ? 'hidden-factor-collapsed' : ''} ${isEN ? 'epithet-item' : ''}">
                <div class="factor-header">
                    <div class="factor-name">
                        <div class="factor-name-en">${nameMain}</div>
                        <div class="factor-name-jp">${nameSub}</div>
                        ${isCompleted ? '<div class="completion-badge">✅</div>' : ''}
                    </div>
                    ${showTrack ? `
                        <button class="btn btn-track ${isTracked ? 'active' : ''}"
                                onclick="window.setTrackedFactorFromRenderer('${factor.id}')"
                                title="Track / 追跡">
                            🔍
                        </button>
                    ` : ''}
                </div>
                <div class="factor-condition">
                    <div class="condition-en">${condText}</div>
                    ${condSub ? `<div class="condition-jp">${condSub}</div>` : ''}
                </div>
                ${prereqHtml}
                <div class="factor-progress">
                    <div>Progress: ${factor.result.current}/${factor.result.required}</div>
                    ${factor.result.details ? `<div style="margin-top: 2px; font-size: 0.75rem;">• ${factor.result.details}</div>` : ''}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPct}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Show more button for compact view
    const progressPanel = document.getElementById('progress-panel');
    const existingBtn = progressPanel ? progressPanel.querySelector('.show-more-factors') : null;
    if (existingBtn) existingBtn.remove();

    if (isCompactView && progressPanel) {
        const notStartedCount = results.filter(f => !f.result.completed && f.result.current === 0).length;
        if (notStartedCount > 0) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-factors' + (factorsExpanded ? ' expanded' : '');
            showMoreBtn.innerHTML = `
                <span>${factorsExpanded ? '表示を減らす' : `さらに表示 (${notStartedCount}件)`}</span>
                <span class="arrow">▼</span>
                <br><span style="font-size: 0.8em; opacity: 0.8;">${factorsExpanded ? 'Show Less' : `Show More (${notStartedCount} hidden)`}</span>
            `;
            showMoreBtn.onclick = () => {
                if (toggleFactorsExpandedCallback) toggleFactorsExpandedCallback();
            };
            progressPanel.appendChild(showMoreBtn);
        }
    }

    const clearBtn = document.getElementById('clear-tracking-btn');
    if (clearBtn) clearBtn.style.display = trackedFactorId ? 'block' : 'none';

    const trackedFilterBtn = document.getElementById('tracked-filter-btn');
    if (trackedFilterBtn) trackedFilterBtn.style.display = trackedFactorId ? 'inline-flex' : 'none';
}

// Keep old export name for compatibility
export { renderFactorList as renderHiddenFactors };

export function syncProgressHeightToPlanner() {
    const progressPanel = document.getElementById('progress-panel');
    const plannerSection = document.getElementById('planner-section');
    if (!progressPanel || !plannerSection) return;
    if (!isMobileOrTablet()) {
        progressPanel.style.minHeight = `${plannerSection.offsetHeight}px`;
    } else {
        progressPanel.style.minHeight = '';
    }
}

export function setupProgressRendererCallbacks(setTrackedFactorFn) {
    window.setTrackedFactorFromRenderer = (factorId) => {
        try { setTrackedFactorFn && setTrackedFactorFn(factorId); } catch (e) { console.error(e); }
    };
}
